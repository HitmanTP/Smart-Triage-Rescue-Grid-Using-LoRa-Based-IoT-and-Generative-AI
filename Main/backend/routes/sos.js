const express = require("express");
const router = express.Router();
const { createSOS } = require("../controllers/sosController");

router.post("/", createSOS);

module.exports = router;
