import Snapshot from "../models/DailySnapshot.js";
import Portfolio from "../models/Portfolio.js";
import { getHoldings } from "../services/portfolioService.js";

export const createSnapshot = async (portfolioId) => {
  try {
    // make sure portfolio exists
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) throw new Error("Portfolio not found");

    // compute holdings
    const holdings = await getHoldings(portfolioId);

    // total portfolio value
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);

    // Save snapshot (one per day enforced by schema index)
    const snapshot = await Snapshot.findOneAndUpdate(
      { portfolioId, date: new Date().setHours(0, 0, 0, 0) }, // same-day snapshot
      { portfolioId, totalValue },
      { upsert: true, new: true }
    );

    return snapshot;
  } catch (err) {
    console.error("❌ Error creating snapshot:", err.message);
    return null;
  }
};
