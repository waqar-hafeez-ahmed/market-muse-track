// Backend/src/sockets/index.js
import { Server } from "socket.io";

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
    socket.emit("hello", { msg: "socket connected" });
  });
}

export function emitPricesUpdate(payload) {
  if (io) io.emit("prices:update", payload);
}

export function emitHoldingsUpdate(payload) {
  if (io) io.emit("holdings:update", payload);
}
