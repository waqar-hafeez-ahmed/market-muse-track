// jobs/poller.js
import Transaction from "../models/Transaction.js";
import Asset from "../models/Asset.js";
import logger from "../utils/logger.js";
import { emitPricesUpdate } from "../sockets/index.js";
import { getLatestPrices } from "../services/priceService.js";

const RATE_LIMIT_PER_MIN = Number(process.env.TWELVEDATA_LIMIT_PER_MIN || 8);
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // Cache expiry time
const SYMBOLS_REFRESH_MS = 5 * 60 * 1000;

const marketCache = new Map();
let cryptoRing = [];
let stockRing = [];
let cryptoPtr = 0;
let stockPtr = 0;
let isCryptoPolling = false;
let isStockPolling = false;

function normalize(sym) {
  return sym ? String(sym).trim().toUpperCase() : null;
}

function classifySymbol(sym) {
  const s = normalize(sym);
  if (!s) return null;
  if (/^[A-Z0-9]+$/.test(s) && s.length <= 5)
    return { type: "crypto", symbol: s };
  return { type: "stock", symbol: s };
}

async function loadSymbolsFromDB() {
  const raw = await Transaction.distinct("symbol");
  const uniq = Array.from(new Set(raw.map(normalize))).filter(Boolean);

  cryptoRing = uniq.filter((s) => classifySymbol(s)?.type === "crypto");
  stockRing = uniq.filter((s) => classifySymbol(s)?.type === "stock");

  if (cryptoPtr >= cryptoRing.length) cryptoPtr = 0;
  if (stockPtr >= stockRing.length) stockPtr = 0;

  logger.info(
    `📈 Symbols loaded → crypto: ${cryptoRing.length}, stocks: ${stockRing.length}`
  );
}

function nextBatch(ring, ptr, n) {
  if (!ring.length) return { batch: [], newPtr: ptr };
  const out = [];
  let p = ptr;
  for (let i = 0; i < Math.min(n, ring.length); i++) {
    out.push(ring[p]);
    p = (p + 1) % ring.length;
  }
  return { batch: out, newPtr: p };
}

async function doPoll(batch, type) {
  const updates = {};
  try {
    const results = await getLatestPrices(batch, type);
    for (const sym of batch) {
      const data = results?.[sym];
      if (!data) continue;

      const price = Number(data.price);
      if (!Number.isFinite(price)) continue;

      const entry = { price, ts: Date.now(), ...data };
      marketCache.set(sym, entry);
      updates[sym] = entry;

      await Asset.updateMany(
        { symbol: sym },
        { $set: { latestPrice: price, lastUpdated: new Date() } }
      );
    }
    if (Object.keys(updates).length > 0) {
      emitPricesUpdate(updates);
      logger.info(`📣 Emitted ${Object.keys(updates).length} ${type} updates`);
    }
  } catch (err) {
    logger.error(`❌ Polling error: ${err.message}`);
  }
}

async function pollCrypto() {
  if (isCryptoPolling) return;
  isCryptoPolling = true;
  const { batch, newPtr } = nextBatch(cryptoRing, cryptoPtr, 10);
  cryptoPtr = newPtr;
  if (batch.length) {
    logger.info(`🪙 Polling crypto: ${batch.join(", ")}`);
    await doPoll(batch, "crypto");
  }
  isCryptoPolling = false;
}

async function pollStocks() {
  if (isStockPolling) return;
  isStockPolling = true;
  const { batch, newPtr } = nextBatch(stockRing, stockPtr, RATE_LIMIT_PER_MIN);
  stockPtr = newPtr;
  if (batch.length) {
    logger.info(`📊 Polling stocks: ${batch.join(", ")}`);
    await doPoll(batch, "stock");
  }
  isStockPolling = false;
}

export function getCachedQuote(symbol) {
  return marketCache.get(normalize(symbol));
}

export function getAllCachedQuotes() {
  return Object.fromEntries(marketCache.entries());
}

export async function startPoller() {
  await loadSymbolsFromDB();
  setInterval(loadSymbolsFromDB, SYMBOLS_REFRESH_MS);
  setInterval(pollCrypto, 20 * 1000); // crypto every 20s
  setInterval(pollStocks, 2 * 60 * 1000); // stocks every 2m

  logger.info("🚀 Poller started");
}
