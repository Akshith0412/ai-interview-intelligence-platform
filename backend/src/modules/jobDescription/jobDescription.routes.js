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
  getJobDescriptions,
} = require(
  "./jobDescription.controller"
);

router.post(
  "/upload",
  auth,
  uploadJobDescription
);

router.get(
  "/list",
  auth,
  getJobDescriptions
);

module.exports =
  router;