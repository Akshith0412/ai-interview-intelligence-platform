const mongoose = require("mongoose");


const learningResourceSchema =
  new mongoose.Schema(
    {
      skill: String,

      title: String,

      description: String,

      url: String,

      embedding: [Number],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "LearningResource",
    learningResourceSchema
  );