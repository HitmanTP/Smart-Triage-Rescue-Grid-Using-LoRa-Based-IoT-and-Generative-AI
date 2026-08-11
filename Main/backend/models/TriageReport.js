const mongoose = require("mongoose");

const triageReportSchema = new mongoose.Schema(
  {
    sosId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SOSMessage",
      required: true,
    },
    victimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Victim",
      required: true,
    },
    priority: {
      type: String,
      enum: ["RED", "YELLOW", "GREEN", "UNCLASSIFIED"],
      default: "UNCLASSIFIED",
    },
    priorityOverride: { type: Boolean, default: false }, // True if commander manually changed it
    reasoning: { type: String, default: "Pending AI classification..." },
    recommendedAction: { type: String, default: "Awaiting AI analysis" },
    dispatchStatus: {
      type: String,
      enum: ["PENDING", "DISPATCHED", "RESCUED"],
      default: "PENDING",
    },
    isManDown: { type: Boolean, default: false }, // True if triggered by AUTO sensor
    aiProcessed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TriageReport", triageReportSchema);
