import express from "express";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from "../controllers/transactionsController.js";

const router = express.Router();

// GET all transactions
router.get("/", getTransactions);

// POST new transaction
router.post("/", createTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
export default router;
