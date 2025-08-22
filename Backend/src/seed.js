import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Portfolio from "./models/Portfolio.js";
import logger from "./utils/logger.js";

const seedPortfolios = async () => {
  try {
    await connectDB();

    const data = [
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c81f"),
        name: "Growth Portfolio",
        description: "Aggressive growth-focused investments",
        totalValue: 60000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c820"),
        name: "Conservative Portfolio",
        description: "Stable and secure investments",
        totalValue: 40000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c821"),
        name: "Tech Focus Portfolio",
        description: "Investments in technology sector",
        totalValue: 25000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c822"),
        name: "Dividend Portfolio",
        description: "Dividend-paying stocks for income",
        totalValue: 11000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c823"),
        name: "Speculative Portfolio",
        description: "High-risk, high-reward bets",
        totalValue: 1000,
      },
    ];

    await Portfolio.deleteMany({});

    await Portfolio.insertMany(data);

    logger.info("Portfolios seeded successfully");
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

seedPortfolios();
