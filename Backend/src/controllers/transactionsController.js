import Transaction from "../models/Transaction.js";
import Portfolio from "../models/Portfolio.js";
import mongoose from "mongoose";
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

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      return res.status(400).json({ error: "Invalid portfolioId" });
    }

    // Optional: check portfolio exists
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const tx = new Transaction({
      portfolioId: new mongoose.Types.ObjectId(portfolioId), // ✅ ensure correct type
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

// ✅ Update transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid transaction id" });
    }

    // Find and update
    const updatedTx = await Transaction.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(updatedTx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid transaction id" });
    }

    const deletedTx = await Transaction.findByIdAndDelete(id);

    if (!deletedTx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
