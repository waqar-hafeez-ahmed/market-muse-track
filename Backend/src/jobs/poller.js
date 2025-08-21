// Backend/src/jobs/poller.js
import Transaction from "../models/Transaction.js";
import Asset from "../models/Asset.js";
import { getLatestPrices } from "../services/priceService.js";
import { emitPricesUpdate } from "../sockets/index.js";

const STOCK_POLL_MS = 300_000; // 5 minutes
const CRYPTO_POLL_MS = 20_000; // 20 seconds

// 🗂️ Collect symbols from both Transactions and Assets
async function collectSymbolsByType() {
  try {
    // Distinct transaction symbols
    const txSymbolsRaw = await Transaction.distinct("symbol", {
      symbol: { $exists: true, $type: "string", $ne: "" },
    });

    // Distinct assetIds
    const assetIds = await Transaction.distinct("assetId", {
      assetId: { $exists: true, $type: "objectId" },
    });

    let assetSymbolsRaw = [];
    if (assetIds.length) {
      const assets = await Asset.find(
        { _id: { $in: assetIds } },
        { symbol: 1, type: 1, _id: 0 }
      ).lean();

      assetSymbolsRaw = assets
        .filter((a) => a.symbol)
        .map((a) => ({
          symbol: a.symbol.toUpperCase(),
          type: a.type?.toLowerCase() || "unknown",
        }));
    }

    // Merge tx + asset symbols, transactions default to unknown
    const all = [
      ...txSymbolsRaw.map((s) => ({
        symbol: s.toUpperCase(),
        type: "unknown",
      })),
      ...assetSymbolsRaw,
    ];

    // Deduplicate by symbol (last seen type wins)
    const bySymbol = {};
    for (let { symbol, type } of all) {
      bySymbol[symbol] = type;
    }

    const stocks = Object.keys(bySymbol).filter((s) => bySymbol[s] === "stock");
    const cryptos = Object.keys(bySymbol).filter(
      (s) => bySymbol[s] === "crypto"
    );

    console.log("✅ Extracted symbols:", { stocks, cryptos });
    return { stocks, cryptos };
  } catch (err) {
    console.error("❌ Error in collectSymbolsByType:", err.message);
    return { stocks: [], cryptos: [] };
  }
}

export async function startPoller() {
  const { stocks, cryptos } = await collectSymbolsByType();

  // --- CRYPTO POLLER ---
  setInterval(async () => {
    try {
      const { cryptos } = await collectSymbolsByType();
      if (!cryptos.length) return;
      const prices = await getLatestPrices(cryptos, "crypto");
      if (prices) emitPricesUpdate(Object.values(prices));
    } catch (err) {
      console.error("❌ Crypto poller error:", err.message);
    }
  }, CRYPTO_POLL_MS);

  // --- STOCK POLLER ---
  setInterval(async () => {
    try {
      const { stocks } = await collectSymbolsByType();
      if (!stocks.length) return;
      const prices = await getLatestPrices(stocks, "stock");
      if (prices) {
        emitPricesUpdate(Object.values(prices));
      }
    } catch (err) {
      console.error("❌ Stock poller error:", err.message);
    }
  }, STOCK_POLL_MS);
}
