const express =
  require("express");

const router =
  express.Router();

const auth =
  require(
    "../../middleware/auth.middleware"
  );

const {
  uploadJobDescription,
} = require(
  "./jobDescription.controller"
);

router.post(
  "/upload",
  auth,
  uploadJobDescription
);

module.exports =
  router;