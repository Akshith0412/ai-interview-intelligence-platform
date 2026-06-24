const express = require("express");

const protect = require(
  "../../middleware/auth.middleware"
);

const {
  getSkillGapAnalysis,
} = require("./analysis.controller");

const router = express.Router();

router.post(
  "/skill-gap",
  protect,
  getSkillGapAnalysis
);

module.exports = router;