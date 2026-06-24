const express = require("express");
const protect = require(
  "../../middleware/auth.middleware"
);

const upload = require("../../config/multer");

const {
  uploadResume,
  getProfile,
} = require("./resume.controller");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;