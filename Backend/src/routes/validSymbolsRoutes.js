import express from "express";
import {
  getCachedValidSymbols,
  validateSymbol,
} from "../services/validSymbolsService.js";

const router = express.Router();

// GET /api/valid-symbols - Get cached valid symbols (for autocomplete)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const symbols = await getCachedValidSymbols(search || "");
    res.json(symbols);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/valid-symbols/validate - Validate a symbol
router.post("/validate", async (req, res) => {
  try {
    const { symbol, assetType } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }

    const validationResult = await validateSymbol(symbol, assetType);

    if (validationResult.valid) {
      res.json({ valid: true, symbol: validationResult.symbol });
    } else {
      res.status(400).json({ valid: false, error: validationResult.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
