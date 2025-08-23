import { startPoller } from "./jobs/poller.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import http from "http"; // 👈 import http
import connectDB from "./config/db.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import transactionsRouter from "./routes/transactions.js";
import logger from "./utils/logger.js";
import newsRoutes from "./routes/news.js";
import holdingsRoutes from "./routes/holdings.js";
import "./jobs/snapshotJob.js";
import snapshotRoutes from "./routes/snapShotRoutes.js";
import validSymbolsRoutes from "./routes/validSymbolsRoutes.js";
import { initSocket } from "./sockets/index.js"; // 👈 import our socket initializer

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 8 requests per minute
    message: "Too many requests, please try again after a minute.", // optional custom message
  })
);

// Routes
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/portfolios", portfolioRoutes); // Portfolio routes
app.use("/api/transactions", transactionsRouter); // Transactions routes
app.use("/api/news", newsRoutes);
app.use("/api/holdings", holdingsRoutes); // Static holdings endpoint
app.use("/api/snapshots", snapshotRoutes);
app.use("/api/valid-symbols", validSymbolsRoutes);
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () =>
      logger.info(`🚀 Server + WS running on port ${PORT}`)
    );
    startPoller();
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

// 404 fallback
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      message: `Not found: ${req.method} ${req.originalUrl}`,
      code: "E_NOT_FOUND",
    },
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  logger.error(err); // pino handles stack
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Server error",
      code: err.code || "E_SERVER",
    },
  });
});
