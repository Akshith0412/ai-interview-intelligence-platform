const mongoose =
  require("mongoose");

const jobDescriptionSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      company: String,

      role: String,

      jdText: String,

      extractedSkills: [String],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "JobDescription",
    jobDescriptionSchema
  );