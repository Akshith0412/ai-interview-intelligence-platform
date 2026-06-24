const express = require("express");

const protect = require(
  "../../middleware/auth.middleware"
);

const {
  generateInterview,
  submitAnswer,
  evaluateInterviewAnswer,
} = require("./interview.controller");

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateInterview
);

router.post(
  "/answer",
  protect,
  submitAnswer
);

router.post(
  "/evaluate",
  protect,
  evaluateInterviewAnswer
);

module.exports = router;