const mongoose = require("mongoose");

const loraNodeSchema = new mongoose.Schema(
  {
    nodeId: { type: String, required: true, unique: true }, // "node_01", "node_02", "node_03"
    batteryPercent: { type: Number, min: 0, max: 100, default: 100 },
    rssi: { type: Number, default: -60 },                   // Signal strength in dBm
    snr: { type: Number, default: 9 },                      // Signal-to-Noise Ratio
    lastHeartbeat: { type: Date, default: Date.now },
    meshPath: { type: String, default: "node -> gateway" }, // Simulated routing path
    isMuted: { type: Boolean, default: false },             // Admin can mute a node
    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "LOW_BATTERY"],
      default: "ONLINE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoRaNode", loraNodeSchema);
