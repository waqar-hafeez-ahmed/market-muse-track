import Transaction from "../models/Transaction.js";
import Portfolio from "../models/Portfolio.js";

// ✅ Create a transaction
export const createTransaction = async (req, res) => {
  try {
    const {
      portfolioId,
      assetType,
      symbol,
      cgId,
      action,
      quantity,
      price,
      fee,
      executedAt,
      note,
    } = req.body;

    // Basic validation
    if (
      !portfolioId ||
      !assetType ||
      !symbol ||
      !action ||
      !quantity ||
      !price
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optional: check portfolio exists
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const tx = new Transaction({
      portfolioId,
      assetType,
      symbol,
      cgId,
      action,
      quantity,
      price,
      fee,
      executedAt: executedAt || new Date(),
      note,
    });

    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
