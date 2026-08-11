const mongoose = require("mongoose");

const victimSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    locationContext: { type: String, default: "Unknown" },
    nodeId: { type: String, required: true }, // e.g. "node_01"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Victim", victimSchema);
