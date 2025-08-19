import express from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transactionsController.js";

const router = express.Router();

// GET all transactions
router.get("/", getTransactions);

// POST new transaction
router.post("/", createTransaction);

export default router;
