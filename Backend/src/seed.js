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
        name: "Crypto Portfolio - 50k",
        description: "Aggressive investments",
        __v: 50000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c820"),
        name: "Stocks Portfolio - 55k",
        description: "Stable and secure investments",
        __v: 55000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c821"),
        name: "Crypto Portfolio - 35k",
        description: "Investments in technology sector",
        __v: 35000,
      },
      {
        _id: new mongoose.Types.ObjectId("68a45b0f1ec49f52c1f0c822"),
        name: "Crypto Portfolio - 15k",
        description: "Dividend-paying stocks for income",
        __v: 15000,
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
