import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

let priceCache = {};
let cacheTimestamp = 0;

const cryptoSymbolToId = {
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
const SYMBOL_ALIASES = {
  OIL: "WTI/USD", // crude oil
  USOIL: "WTI/USD",
  UKOIL: "BRENT/USD",
  GOLD: "XAU/USD",
  SILVER: "XAG/USD",
  PLATINUM: "XPT/USD",
  Google: "GOOGL",
};

function normalizeSymbol(sym) {
  if (!sym) return sym;
  let s = sym.trim().toUpperCase();
  if (SYMBOL_ALIASES[s]) return SYMBOL_ALIASES[s];
  return s.replace(/^GPB\//, "GBP/"); // fix typo
}

function inferType(sym) {
  const s = normalizeSymbol(sym);
  if (s.includes("/")) return "forex"; // includes FX + metals
  return "equity";
}

// --- CRYPTO ---
export async function getCryptoPrices(symbols) {
  const now = Date.now();
  const upperSymbols = symbols.map((s) => s.toUpperCase());

  if (priceCache.crypto && now - cacheTimestamp < 90 * 1000) {
    return priceCache.crypto;
  }

  const ids = upperSymbols
    .map((sym) => cryptoSymbolToId[sym] || null)
    .filter(Boolean);

  if (!ids.length) return {};

  const { data } = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
    params: {
      ids: ids.join(","),
      vs_currencies: "usd",
      include_24hr_change: "true",
    },
  });

  const result = {};
  for (const sym of upperSymbols) {
    const id = cryptoSymbolToId[sym];
    if (id && data[id]) {
      result[sym] = {
        symbol: sym,
        type: "crypto",
        name: sym,
        price: parseFloat(data[id].usd),
        previousClose: parseFloat(
          data[id].usd / (1 + data[id].usd_24h_change / 100)
        ), // approx
        change24h: parseFloat(data[id].usd_24h_change),
        currency: "USD",
      };
    }
  }

  priceCache.crypto = result;
  cacheTimestamp = now;
  return result;
}

// --- STOCKS + FOREX/COMMODITIES ---
export async function getStockPrices(symbols) {
  if (!symbols.length) return {};

  const apiKey = TWELVE_DATA_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing Twelve Data API key!");
    return {};
  }

  try {
    const normSymbols = symbols.map(normalizeSymbol);
    const joined = normSymbols.join(",");
    const url = `${TWELVE_DATA_BASE_URL}/quote?symbol=${joined}&apikey=${apiKey}`;
    const { data } = await axios.get(url);

    // console.log("🔍 TwelveData raw response:", JSON.stringify(data, null, 2));

    const result = {};
    if (normSymbols.length === 1) {
      const stockData = data;
      const sym = normSymbols[0];
      if (stockData && stockData.close) {
        result[sym] = {
          symbol: sym,
          type: inferType(sym),
          name: stockData.name || sym,
          price: parseFloat(stockData.close),
          previousClose: parseFloat(stockData.previous_close) || null,
          currency: stockData.currency || "USD",
        };
      } else {
        console.error(`⚠️ No valid data for ${sym}:`, stockData);
      }
    } else {
      for (const sym of normSymbols) {
        const stockData = data[sym] || {};
        if (stockData && stockData.close) {
          result[sym] = {
            symbol: sym,
            type: inferType(sym),
            name: stockData.name || sym,
            price: parseFloat(stockData.close),
            previousClose: parseFloat(stockData.previous_close) || null,
            currency: stockData.currency || "USD",
          };
        } else {
          console.error(`⚠️ No valid data for ${sym}:`, stockData);
        }
      }
    }

    return result;
  } catch (err) {
    console.error(
      "❌ Error fetching stock/forex prices:",
      err.response?.data || err.message
    );
    return {};
  }
}

export async function getForexPrices(symbols) {
  if (!symbols.length) return {};

  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing Twelve Data API key!");
    return {};
  }

  try {
    const joined = symbols.join(",");
    const url = `${TWELVE_DATA_BASE_URL}/quote?symbol=${joined}&apikey=${apiKey}`;
    const { data } = await axios.get(url);

    const result = {};
    if (symbols.length === 1) {
      const fxData = data;
      result[symbols[0]] = {
        symbol: symbols[0],
        type: "forex",
        name: fxData.name || symbols[0],
        price: parseFloat(fxData.close || fxData.price) || null,
        previousClose: parseFloat(fxData.previous_close) || null,
        currency: fxData.currency || "USD",
      };
    } else {
      for (const sym of symbols) {
        const fxData = data[sym] || {};
        result[sym] = {
          symbol: sym,
          type: "forex",
          name: fxData.name || sym,
          price: parseFloat(fxData.close || fxData.price) || null,
          previousClose: parseFloat(fxData.previous_close) || null,
          currency: fxData.currency || "USD",
        };
      }
    }

    return result;
  } catch (err) {
    console.error("❌ Error fetching forex prices:", err.message);
    return {};
  }
}

// --- Unified latest prices ---
// --- Unified latest prices ---
export async function getLatestPrices(symbols, type = "auto") {
  if (!symbols || !symbols.length) return {};

  // If caller already knows type, shortcut
  if (type === "crypto") {
    return await getCryptoPrices(symbols);
  }
  if (type === "stock" || type === "forex") {
    return await getStockPrices(symbols);
  }

  // "auto" mode: split by lookup table
  const stockSymbols = symbols.filter(
    (s) => !cryptoSymbolToId[s.toUpperCase()]
  );
  const cryptoSymbols = symbols.filter(
    (s) => cryptoSymbolToId[s.toUpperCase()]
  );

  const [stocks, cryptos] = await Promise.all([
    stockSymbols.length ? getStockPrices(stockSymbols) : {},
    cryptoSymbols.length ? getCryptoPrices(cryptoSymbols) : {},
  ]);

  return { ...stocks, ...cryptos };
}
