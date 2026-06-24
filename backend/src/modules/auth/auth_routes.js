const express = require("express");
const { registerUser,loginUser,getProfile } = require("./auth_controller");

const router = express.Router();

const protect = require("../../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;