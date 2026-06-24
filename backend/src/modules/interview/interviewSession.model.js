const mongoose = require("mongoose");

const interviewSessionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      targetRole: String,

      questions: [String],

      answers: [
        {
          question: String,
          answer: String,
          score: Number,
        }
      ]
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);