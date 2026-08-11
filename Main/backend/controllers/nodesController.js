const LoRaNode = require("../models/LoRaNode");

// GET /api/nodes — Fetch all node health data
const getAllNodes = async (req, res) => {
  try {
    const nodes = await LoRaNode.find().sort({ nodeId: 1 });
    res.json({ success: true, data: nodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/nodes/:nodeId/mute — Admin mutes/unmutes a node
const toggleMuteNode = async (req, res) => {
  try {
    const node = await LoRaNode.findOne({ nodeId: req.params.nodeId });
    if (!node) return res.status(404).json({ success: false, message: "Node not found" });

    node.isMuted = !node.isMuted;
    await node.save();

    res.json({ success: true, message: `Node ${node.isMuted ? "muted" : "unmuted"}`, data: node });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Called internally by mock generator to update node heartbeat
const upsertNodeHeartbeat = async (nodeId, batteryPercent, rssi, snr) => {
  try {
    const status =
      batteryPercent < 15 ? "LOW_BATTERY" : "ONLINE";

    await LoRaNode.findOneAndUpdate(
      { nodeId },
      { batteryPercent, rssi, snr, lastHeartbeat: new Date(), status },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error(`Node heartbeat error: ${error.message}`);
  }
};

module.exports = { getAllNodes, toggleMuteNode, upsertNodeHeartbeat };
