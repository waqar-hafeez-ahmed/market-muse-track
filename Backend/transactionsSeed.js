// transactionseed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Portfolio from "./src/models/Portfolio.js";
import Transaction from "./src/models/Transaction.js";

dotenv.config();

const seedTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // 1️⃣ Fetch all portfolios
    const portfolios = await Portfolio.find({});
    if (portfolios.length === 0) {
      console.error("❌ No portfolios found. Seed portfolios first!");
      process.exit(1);
    }

    // 2️⃣ Prepare transactions for each portfolio
    const transactions = portfolios.flatMap((portfolio, index) => {
      return [
        {
          portfolioId: portfolio._id,
          assetType: "stock",
          symbol: ["AAPL", "GOOGL", "MSFT"][index % 3],
          action: "BUY",
          quantity: 10 + index,
          price: 100 + index * 50,
          fee: 0,
          executedAt: new Date(),
          note: `Initial transaction for ${portfolio.name}`
        },
        {
          portfolioId: portfolio._id,
          assetType: "crypto",
          symbol: ["BTC", "ETH", "SOL"][index % 3],
          action: "BUY",
          quantity: 1 + index * 0.1,
          price: 20000 + index * 5000,
          fee: 0,
          executedAt: new Date(),
          note: `Crypto transaction for ${portfolio.name}`
        }
      ];
    });

    // 3️⃣ Clear old transactions and insert new
    await Transaction.deleteMany();
    await Transaction.insertMany(transactions);

    console.log(`✅ ${transactions.length} Transactions seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding transactions:", error);
    process.exit(1);
  }
};

seedTransactions();
