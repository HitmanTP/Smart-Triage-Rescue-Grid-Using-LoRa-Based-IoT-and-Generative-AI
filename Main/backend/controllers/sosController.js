const Victim = require("../models/Victim");
const SOSMessage = require("../models/SOSMessage");
const TriageReport = require("../models/TriageReport");
const axios = require("axios");

// POST /api/sos — Create a new SOS (from portal, mock generator, or real hardware)
const createSOS = async (req, res) => {
  try {
    const { name, age, locationContext, nodeId, rawText, type, hops, rssi, seqId } = req.body;

    // 1. Create the Victim record
    const victim = await Victim.create({
      name,
      age,
      locationContext: locationContext || "Unknown",
      nodeId,
    });

    // 2. Create the SOS Message
    const sosMessage = await SOSMessage.create({
      seqId: seqId || `SEQ_${Date.now()}`,
      rawText,
      nodeId,
      type: type || "MANUAL",
      hops: hops || 1,
      rssi: rssi || -60,
      victimId: victim._id,
    });

    // 3. Create a placeholder Triage Report (will be filled by AI)
    const triageReport = await TriageReport.create({
      sosId: sosMessage._id,
      victimId: victim._id,
      isManDown: type === "AUTO",
    });

    // 4. Emit real-time event via Socket.io (io is attached to req.app)
    const io = req.app.get("io");
    io.emit("new_sos", {
      triageReport,
      sosMessage,
      victim,
    });

    // 5. Trigger AI classification asynchronously (don't wait for it)
    triggerAIClassification(sosMessage, triageReport._id, victim, io);

    res.status(201).json({
      success: true,
      message: "SOS received and queued for AI triage",
      data: { victim, sosMessage, triageReport },
    });
  } catch (error) {
    console.error("SOS Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Async function — calls Python Flask AI service
const triggerAIClassification = async (sosMessage, triageReportId, victim, io) => {
  try {
    console.log(`🤖 Sending to AI: "${sosMessage.rawText}"`);

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/classify`,
      {
        text: sosMessage.rawText,
        type: sosMessage.type,          // AUTO type defaults to RED in AI service
        victim_name: victim.name,
        victim_age: victim.age,
      },
      { timeout: 30000 }               // 30 second timeout for LLM
    );

    const { priority, reasoning, recommended_action } = aiResponse.data;

    // Update the triage report with AI result
    const updatedReport = await TriageReport.findByIdAndUpdate(
      triageReportId,
      {
        priority,
        reasoning,
        recommendedAction: recommended_action,
        aiProcessed: true,
      },
      { new: true }
    );

    // Update SOS message status
    await SOSMessage.findByIdAndUpdate(sosMessage._id, {
      triageStatus: "CLASSIFIED",
    });

    console.log(`✅ AI classified as ${priority}: ${victim.name}`);

    // Emit update to dashboard
    io.emit("triage_update", {
      triageReportId,
      priority,
      reasoning,
      recommendedAction: recommended_action,
    });
  } catch (error) {
    console.error(`❌ AI Service Error: ${error.message}`);
    // If AI fails, mark as UNCLASSIFIED — commander reviews manually
    await TriageReport.findByIdAndUpdate(triageReportId, {
      priority: "UNCLASSIFIED",
      reasoning: "AI service unavailable. Manual review required.",
      aiProcessed: false,
    });
  }
};

module.exports = { createSOS };
