const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      default: null,
    },

    skills: [String],

    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
      },
    ],

    education: {
      degree: String,
      branch: String,
    },

    experienceLevel: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);