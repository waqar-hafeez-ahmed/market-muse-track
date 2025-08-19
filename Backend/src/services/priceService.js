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
        name: sym, // you can expand by calling /coins/{id} if you want full name
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

// --- STOCKS ---
export async function getStockPrices(symbols) {
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
      const stockData = data;
      result[symbols[0]] = {
        symbol: symbols[0],
        type: "equity",
        name: stockData.name || symbols[0],
        price: parseFloat(stockData.close || stockData.price) || null,
        previousClose: parseFloat(stockData.previous_close) || null,
        currency: stockData.currency || "USD",
      };
    } else {
      for (const sym of symbols) {
        const stockData = data[sym] || {};
        result[sym] = {
          symbol: sym,
          type: "equity",
          name: stockData.name || sym,
          price: parseFloat(stockData.close || stockData.price) || null,
          previousClose: parseFloat(stockData.previous_close) || null,
          currency: stockData.currency || "USD",
        };
      }
    }

    return result;
  } catch (err) {
    console.error("❌ Error fetching stock prices:", err.message);
    return {};
  }
}

export async function getLatestPrices(symbols) {
  const stockSymbols = symbols.filter(
    (s) => !cryptoSymbolToId[s.toUpperCase()]
  );
  const cryptoSymbols = symbols.filter(
    (s) => cryptoSymbolToId[s.toUpperCase()]
  );

  const [stocks, cryptos] = await Promise.all([
    getStockPrices(stockSymbols),
    getCryptoPrices(cryptoSymbols),
  ]);

  return { ...stocks, ...cryptos };
}
