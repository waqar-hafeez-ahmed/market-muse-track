// services/priceService.js
import axios from "axios";
import dotenv from "dotenv";
import PriceCache from "../models/PriceCache.js";
dotenv.config();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

export const cryptoSymbolToId = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  XRP: "ripple",
  DOGE: "dogecoin",
  MATIC: "polygon",
  DOT: "polkadot",
  LTC: "litecoin",
};

// --- helpers ---
function normalizeSymbol(sym) {
  if (!sym) return sym;
  let s = sym.trim().toUpperCase();
  if (s === "APPL") return "AAPL"; // common typo
  return s.replace(/^GPB\//, "GBP/");
}

function inferType(sym) {
  const s = normalizeSymbol(sym);
  if (s.includes("/")) return "forex"; // FX + metals
  return "stock";
}

// --- CRYPTO ---
export async function getCryptoPrices(symbols) {
  if (!symbols.length) return {};

  const ids = symbols
    .map((sym) => cryptoSymbolToId[sym.toUpperCase()] || null)
    .filter(Boolean);

  if (!ids.length) return {};

  try {
    const { data } = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
      params: {
        ids: ids.join(","),
        vs_currencies: "usd",
        include_24hr_change: "true",
      },
    });

    const result = {};
    for (const sym of symbols) {
      const id = cryptoSymbolToId[sym.toUpperCase()];
      if (id && data[id]) {
        result[sym] = {
          symbol: sym,
          type: "crypto",
          price: parseFloat(data[id].usd),
          previousClose: parseFloat(
            data[id].usd / (1 + data[id].usd_24h_change / 100)
          ),
          change24h: parseFloat(data[id].usd_24h_change),
          currency: "USD",
        };
      }
    }
    return result;
  } catch (err) {
    console.error("❌ Error fetching crypto prices:", err.message);
    return {};
  }
}

// --- STOCKS/FOREX ---
export async function getStockPrices(symbols) {
  if (!symbols.length) return {};

  if (!TWELVE_DATA_API_KEY) {
    console.error("❌ Missing Twelve Data API key!");
    return {};
  }

  try {
    const normSymbols = symbols.map(normalizeSymbol);
    const joined = normSymbols.join(",");
    const url = `${TWELVE_DATA_BASE_URL}/quote?symbol=${joined}&apikey=${TWELVE_DATA_API_KEY}`;
    const { data } = await axios.get(url);

    const result = {};
    if (normSymbols.length === 1) {
      const stockData = data;
      const sym = normSymbols[0];
      if (stockData && stockData.close) {
        result[sym] = {
          symbol: sym,
          type: inferType(sym),
          price: parseFloat(stockData.close),
          previousClose: parseFloat(stockData.previous_close) || null,
          change24h: stockData.percent_change
            ? parseFloat(stockData.percent_change)
            : null,
          currency: stockData.currency || "USD",
        };
      }
    } else {
      for (const sym of normSymbols) {
        const stockData = data[sym] || {};
        if (stockData && stockData.close) {
          result[sym] = {
            symbol: sym,
            type: inferType(sym),
            price: parseFloat(stockData.close),
            previousClose: parseFloat(stockData.previous_close) || null,
            change24h: stockData.percent_change
              ? parseFloat(stockData.percent_change)
              : null,
            currency: stockData.currency || "USD",
          };
        }
      }
    }
    return result;
  } catch (err) {
    console.error("❌ Error fetching stock/forex prices:", err.message);
    return {};
  }
}

// --- Unified latest prices ---
export async function getLatestPrices(symbols, type = "auto") {
  if (!symbols || !symbols.length) return {};

  // Check cache first
  const cachedPrices = await PriceCache.find({ symbol: { $in: symbols } });
  const cachedPriceMap = new Map(
    cachedPrices.map((price) => [price.symbol, price])
  );

  const results = {};
  for (const sym of symbols) {
    if (cachedPriceMap.has(sym)) {
      const cachedData = cachedPriceMap.get(sym);
      // Ensure the cached data has the expected structure
      results[sym] = {
        symbol: sym,
        price: cachedData.price,
        previousClose: cachedData.previousClose || null,
        change24h: cachedData.change24h || null,
        currency: cachedData.currency || "USD",
        type: cachedData.type || inferType(sym),
      };
    }
  }

  // Determine which symbols need fresh data
  const symbolsNeedingUpdate = symbols.filter((sym) => !results[sym]);

  if (symbolsNeedingUpdate.length > 0) {
    let freshData = {};

    if (type === "crypto") {
      freshData = await getCryptoPrices(symbolsNeedingUpdate);
    } else if (type === "stock" || type === "forex") {
      freshData = await getStockPrices(symbolsNeedingUpdate);
    } else {
      const stockSymbols = symbolsNeedingUpdate.filter(
        (sym) => !cryptoSymbolToId[sym.toUpperCase()]
      );
      const cryptoSymbols = symbolsNeedingUpdate.filter(
        (sym) => cryptoSymbolToId[sym.toUpperCase()]
      );
      const [stocks, cryptos] = await Promise.all([
        stockSymbols.length ? getStockPrices(stockSymbols) : {},
        cryptoSymbols.length ? getCryptoPrices(cryptoSymbols) : {},
      ]);
      freshData = { ...stocks, ...cryptos };
    }

    // Cache the new prices
    for (const sym of Object.keys(freshData)) {
      const priceData = freshData[sym];
      if (priceData && priceData.price) {
        await PriceCache.updateOne(
          { symbol: sym },
          {
            $set: {
              price: priceData.price,
              previousClose: priceData.previousClose || null,
              change24h: priceData.change24h || null,
              currency: priceData.currency || "USD",
              lastUpdated: new Date(),
            },
          },
          { upsert: true }
        );
        results[sym] = freshData[sym];
      }
    }
  }

  return results;
}
