const express = require("express");

const protect = require(
  "../../middleware/auth.middleware"
);

const {
  generateInterview,
  evaluateInterviewAnswer,
} = require("./interview.controller");

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateInterview
);

router.post(
  "/evaluate",
  protect,
  evaluateInterviewAnswer
);

module.exports = router;