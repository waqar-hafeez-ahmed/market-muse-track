// Backend/src/jobs/poller.js
import Transaction from "../models/Transaction.js";
import Asset from "../models/Asset.js";
import { getLatestPrices } from "../services/priceService.js";
import { emitPricesUpdate } from "../sockets/index.js";

const POLL_MS = Number(process.env.POLL_INTERVAL_MS) || 70000;

async function collectUniqueSymbols() {
  // 1) Symbols stored directly on transactions (if any)
  const txSymbolsRaw = await Transaction.distinct("symbol", {
    symbol: { $exists: true, $type: "string", $ne: "" },
  });

  // 2) Asset symbols via assetId references
  const assetIds = await Transaction.distinct("assetId", {
    assetId: { $exists: true, $type: "objectId" },
  });

  let assetSymbolsRaw = [];
  if (assetIds.length) {
    const assets = await Asset.find(
      { _id: { $in: assetIds } },
      { symbol: 1, _id: 0 }
    ).lean();
    assetSymbolsRaw = assets.map((a) => a.symbol).filter(Boolean);
  }

  // 3) Merge + UPPERCASE + dedupe
  const all = [...txSymbolsRaw, ...assetSymbolsRaw]
    .filter((s) => typeof s === "string")
    .map((s) => s.toUpperCase());

  return [...new Set(all)];
}

export function startPoller(interval = POLL_MS) {
  setInterval(async () => {
    try {
      // Gather once per tick
      const uniqueSymbols = await collectUniqueSymbols();

      if (!uniqueSymbols.length) {
        console.warn(
          "⚠️ No valid symbols found in DB. Check that either Transaction.symbol exists or Transaction.assetId points to an Asset with a symbol."
        );
        return;
      }

      console.log("✅ Extracted uniqueSymbols:", uniqueSymbols);

      // Fetch latest prices (stocks + crypto handled inside priceService)
      const prices = await getLatestPrices(uniqueSymbols);

      // Normalize to array payload
      const payload = Array.isArray(prices)
        ? prices
        : prices
        ? Object.values(prices)
        : [];

      if (payload.length) {
        emitPricesUpdate(payload);
        console.log("📡 Emitted prices:update", payload.length, "items");
      } else {
        console.warn("⚠️ getLatestPrices returned no data for:", uniqueSymbols);
      }
    } catch (err) {
      console.error("❌ Poller error:", err?.stack || err?.message || err);
    }
  }, interval);
}
