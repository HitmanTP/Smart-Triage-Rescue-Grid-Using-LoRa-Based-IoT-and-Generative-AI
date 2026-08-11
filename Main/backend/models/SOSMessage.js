const mongoose = require("mongoose");

const sosMessageSchema = new mongoose.Schema(
  {
    seqId: { type: String, required: true, unique: true }, // e.g. "SEQ_001"
    rawText: { type: String, required: true },             // Natural language injury description
    nodeId: { type: String, required: true },
    type: {
      type: String,
      enum: ["MANUAL", "AUTO"],    // MANUAL = victim filled form, AUTO = Man Down sensor
      default: "MANUAL",
    },
    hops: { type: Number, default: 1 },                    // How many LoRa hops (simulated)
    rssi: { type: Number, default: -60 },                  // Signal strength (simulated)
    triageStatus: {
      type: String,
      enum: ["PENDING", "CLASSIFIED", "DISPATCHED", "RESCUED"],
      default: "PENDING",
    },
    victimId: { type: mongoose.Schema.Types.ObjectId, ref: "Victim" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOSMessage", sosMessageSchema);
