const express = require("express");
const router = express.Router();
const {
  getAllTriage,
  updateDispatchStatus,
  overridePriority,
} = require("../controllers/triageController");

router.get("/", getAllTriage);
router.patch("/:id/status", updateDispatchStatus);
router.patch("/:id/priority", overridePriority);

module.exports = router;
