// jobs/poller.js
import Transaction from "../models/Transaction.js";
import Asset from "../models/Asset.js";
import PriceCache from "../models/PriceCache.js";
import logger from "../utils/logger.js";
import { emitPricesUpdate } from "../sockets/index.js";
import {
  getLatestPrices,
  getCryptoPrices,
  getStockPrices,
  cryptoSymbolToId,
} from "../services/priceService.js";

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

  // Check if the symbol is a known crypto symbol
  if (cryptoSymbolToId[s]) {
    return { type: "crypto", symbol: s };
  }

  // Otherwise, classify as stock
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
    // Bypass cache and fetch fresh data directly
    let results = {};
    if (type === "crypto") {
      results = await getCryptoPrices(batch);
    } else if (type === "stock" || type === "forex") {
      results = await getStockPrices(batch);
    } else {
      const stockSymbols = batch.filter(
        (sym) => !cryptoSymbolToId[sym.toUpperCase()]
      );
      const cryptoSymbols = batch.filter(
        (sym) => cryptoSymbolToId[sym.toUpperCase()]
      );
      const [stocks, cryptos] = await Promise.all([
        stockSymbols.length ? getStockPrices(stockSymbols) : {},
        cryptoSymbols.length ? getCryptoPrices(cryptoSymbols) : {},
      ]);
      results = { ...stocks, ...cryptos };
    }
    for (const sym of batch) {
      const data = results?.[sym];
      if (!data) {
        logger.warn(`❌ No data for symbol: ${sym}`);
        continue;
      }

      const price = Number(data.price);
      if (!Number.isFinite(price)) {
        logger.warn(
          `❌ Invalid price for symbol: ${sym}, price: ${data.price}`
        );
        continue;
      }

      const entry = {
        price,
        ts: Date.now(),
        previousClose: data.previousClose || null,
        change24h: data.change24h || null,
        currency: data.currency || "USD",
      };
      marketCache.set(sym, entry);
      updates[sym] = entry;
      logger.info(
        `✅ Updated ${sym}: price=${price}, prevClose=${data.previousClose}, change24h=${data.change24h}`
      );

      await Asset.updateMany(
        { symbol: sym },
        { $set: { latestPrice: price, lastUpdated: new Date() } }
      );

      // Also update PriceCache with all the fields
      await PriceCache.updateOne(
        { symbol: sym },
        {
          $set: {
            price: price,
            previousClose: data.previousClose || null,
            change24h: data.change24h || null,
            currency: data.currency || "USD",
            lastUpdated: new Date(),
          },
        },
        { upsert: true }
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
  setInterval(pollCrypto, 2 * 60 * 1000); // crypto every 2m
  setInterval(pollStocks, 5 * 60 * 1000); // stocks every 5m

  logger.info("🚀 Poller started");
}
