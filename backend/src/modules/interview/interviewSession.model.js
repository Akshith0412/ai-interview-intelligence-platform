const mongoose = require("mongoose");

const interviewSessionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      candidateProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile",
      },

      jobDescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobDescription",
      },

      targetRole: String,

      missingSkills: [String],

      questions: [String],

      answers: [
        {
          question: String,
          answer: String,
          score: Number,
          strengths: [String],
          weaknesses: [String],
          suggestions: [String],
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