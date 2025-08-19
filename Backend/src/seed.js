import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import Portfolio from './models/Portfolio.js';
import logger from './utils/logger.js';

const seedPortfolios = async () => {
  try {
    await connectDB();

    const data = [
      { name: 'Growth Portfolio', note: '$60k target' },
      { name: 'Conservative Portfolio', note: '$40k target' },
      { name: 'Tech Focus', note: '$25k target' },
      { name: 'Dividend Portfolio', note: '$11k target' },
      { name: 'Speculative Portfolio', note: '$1k target' }
    ];

    await Portfolio.deleteMany({});
    await Portfolio.insertMany(data);

    logger.info('Portfolios seeded successfully');
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

seedPortfolios();
