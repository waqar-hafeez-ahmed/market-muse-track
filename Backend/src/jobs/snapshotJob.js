import cron from "node-cron";
import Portfolio from "../models/Portfolio.js";
import {
  createSnapshot,
  getGlobalSnapshots,
} from "../services/snapShotService.js";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("📊 Running daily snapshot job...");
  const portfolios = await Portfolio.find();
  for (const p of portfolios) {
    await createSnapshot(p._id);
  }

  // Create global snapshots after individual snapshots
  await getGlobalSnapshots();

  console.log(
    "✅ Snapshots saved for all portfolios and global snapshots updated"
  );
});
