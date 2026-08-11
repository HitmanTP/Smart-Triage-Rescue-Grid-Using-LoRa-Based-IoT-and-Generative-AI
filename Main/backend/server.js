require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

// Make io accessible in controllers via req.app.get("io")
app.set("io", io);

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/sos", require("./routes/sos"));
app.use("/api/triage", require("./routes/triage"));
app.use("/api/nodes", require("./routes/nodes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ Smart Triage Backend Running",
    timestamp: new Date().toISOString(),
  });
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`🔌 Dashboard connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`❌ Dashboard disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for real-time dashboard`);
});
