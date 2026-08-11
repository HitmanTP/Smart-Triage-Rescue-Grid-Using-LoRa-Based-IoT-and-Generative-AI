const express = require("express");
const router = express.Router();
const { getAllNodes, toggleMuteNode } = require("../controllers/nodesController");

router.get("/", getAllNodes);
router.patch("/:nodeId/mute", toggleMuteNode);

module.exports = router;
