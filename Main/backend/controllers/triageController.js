const TriageReport = require("../models/TriageReport");
const SOSMessage = require("../models/SOSMessage");

// GET /api/triage — Fetch all reports sorted by priority (RED first)
const getAllTriage = async (req, res) => {
  try {
    const priorityOrder = { RED: 1, YELLOW: 2, GREEN: 3, UNCLASSIFIED: 4 };

    const reports = await TriageReport.find()
      .populate("victimId")
      .populate("sosId")
      .sort({ createdAt: -1 })
      .lean();

    // Sort by priority level first, then by newest createdAt first
    reports.sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/triage/:id/status — Update dispatch status
const updateDispatchStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["PENDING", "DISPATCHED", "RESCUED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const report = await TriageReport.findByIdAndUpdate(
      req.params.id,
      { dispatchStatus: status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Sync SOS message status
    await SOSMessage.findByIdAndUpdate(report.sosId, {
      triageStatus: status,
    });

    const io = req.app.get("io");
    io.emit("status_update", { triageReportId: req.params.id, dispatchStatus: status });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/triage/:id/priority — Commander overrides AI priority
const overridePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!["RED", "YELLOW", "GREEN"].includes(priority)) {
      return res.status(400).json({ success: false, message: "Invalid priority" });
    }

    const report = await TriageReport.findByIdAndUpdate(
      req.params.id,
      { priority, priorityOverride: true },
      { new: true }
    );

    const io = req.app.get("io");
    io.emit("priority_override", { triageReportId: req.params.id, priority });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllTriage, updateDispatchStatus, overridePriority };
