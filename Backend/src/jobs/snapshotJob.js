import cron from "node-cron";
import Portfolio from "../models/Portfolio.js";
import { createSnapshot } from "../services/snapShotService.js";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("📊 Running daily snapshot job...");
  const portfolios = await Portfolio.find();
  for (const p of portfolios) {
    await createSnapshot(p._id);
  }
  console.log("✅ Snapshots saved for all portfolios");
});
