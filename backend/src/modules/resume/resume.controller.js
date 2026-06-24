const fs = require("fs");
const pdf = require("pdf-parse");
const extractCandidateProfile = require("../../services/resumeExtractor");
const CandidateProfile = require(
  "./candidateProfile.model"
);


const uploadResume = async (req, res) => {
  try {
    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdf(dataBuffer);
    const profile = await extractCandidateProfile(pdfData.text);

    const savedProfile =
  await CandidateProfile.findOneAndUpdate(
    {
      userId: req.user.userId,
    },
    {
      userId: req.user.userId,
      ...profile,
    },
    {
      new: true,
      upsert: true,
    }
  );

    res.status(200).json({
      message: "Resume uploaded & Processed successfully",
      profile : savedProfile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Resume processing failed",
      error:error.message,
    });
  }
};

module.exports = {
  uploadResume,
};