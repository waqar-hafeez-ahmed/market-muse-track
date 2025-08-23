import axios from "axios";
import dotenv from "dotenv";
import ValidSymbol from "../models/ValidSymbol.js";
dotenv.config();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

// Validate a symbol using Twelve Data API with proper error handling
export const validateSymbol = async (symbol, assetType = "auto") => {
  try {
    const symbolUpper = symbol.toUpperCase();

    // First check if symbol is already cached (recently validated)
    const cachedSymbol = await ValidSymbol.findOne({
      symbol: symbolUpper,
      lastValidated: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Cache for 24 hours
    });

    if (cachedSymbol) {
      return { valid: true, symbol: cachedSymbol };
    }

    // Validate using Twelve Data API with timeout and retry logic
    const response = await axios.get(`${TWELVE_DATA_BASE_URL}/quote`, {
      params: {
        symbol: symbolUpper,
        apikey: TWELVE_DATA_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    const quoteData = response.data;

    // Handle null values gracefully
    if (!quoteData || !quoteData.symbol) {
      return { valid: false, error: "Symbol not found or invalid" };
    }

    // Cache the valid symbol
    const validSymbol = await ValidSymbol.findOneAndUpdate(
      { symbol: quoteData.symbol },
      {
        $set: {
          name: quoteData.name || quoteData.symbol,
          type: assetType,
          lastValidated: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return { valid: true, symbol: validSymbol };
  } catch (error) {
    // Handle different error types
    if (error.response?.status === 404) {
      return { valid: false, error: "Symbol not found" };
    }
    if (error.response?.status === 429) {
      return {
        valid: false,
        error: "Rate limit exceeded. Please try again later.",
      };
    }
    if (error.code === "ECONNABORTED") {
      return { valid: false, error: "Request timeout. Please try again." };
    }
    if (error.response?.status >= 500) {
      return {
        valid: false,
        error: "Service temporarily unavailable. Please try again later.",
      };
    }

    console.error("Error validating symbol:", error.message);
    return { valid: false, error: "Unable to validate symbol at this time" };
  }
};

// Get cached valid symbols for autocomplete
export const getCachedValidSymbols = async (searchTerm = "") => {
  try {
    const regex = new RegExp(searchTerm, "i");
    return await ValidSymbol.find({
      $or: [{ symbol: regex }, { name: regex }],
      lastValidated: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Only show symbols validated in last 7 days
    }).limit(10);
  } catch (error) {
    console.error("Error fetching cached symbols:", error.message);
    return [];
  }
};
