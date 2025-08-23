import express from "express";
import Snapshot from "../models/DailySnapshot.js";
import {
  createSnapshot,
  getGlobalSnapshots,
} from "../services/snapShotService.js";

const router = express.Router();

// GET snapshots for portfolio
router.get("/:portfolioId", async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const snapshots = await Snapshot.find({ portfolioId }).sort({ date: 1 }); // oldest → newest
    res.json(snapshots);
  } catch (err) {
    console.error("❌ Failed to fetch snapshots:", err);
    res.status(500).json({ error: "Failed to fetch snapshots" });
  }
});

// GET global snapshots (aggregated across all portfolios)
router.get("/", async (req, res) => {
  try {
    const snapshots = await getGlobalSnapshots();
    res.json(snapshots);
  } catch (err) {
    console.error("❌ Failed to fetch global snapshots:", err);
    res.status(500).json({ error: "Failed to fetch global snapshots" });
  }
});

// Create snapshot manually for testing
router.post("/:portfolioId", async (req, res) => {
  try {
    const snapshot = await createSnapshot(req.params.portfolioId);
    console.log("Created snapshot:", snapshot);
    if (!snapshot)
      return res.status(404).json({ error: "Portfolio not found" });
    res.json(snapshot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
