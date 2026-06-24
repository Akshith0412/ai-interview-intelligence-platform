const CandidateProfile = require(
  "../resume/candidateProfile.model"
);

const JobDescription = require(
  "../jobDescription/jobDescription.model"
);

const analyzeSkillGap = require(
  "./skillGapAnalyzer"
);

const recommendResources = require(
  "../rag/recommendResources"
);

const getSkillGapAnalysis = async (req, res) => {
  try {

    const profile =
      await CandidateProfile.findOne({
        userId: req.user.userId,
      });

    if (!profile) {
      return res.status(404).json({
        message: "Candidate profile not found",
      });
    }

    const jd =
      await JobDescription.findOne(
        { userId: req.user.userId },
        null,
        { sort: { createdAt: -1 } }
      );

    if (!jd) {
      return res.status(404).json({
        message: "Job Description not found",
      });
    }

    const candidateSkills = profile.skills;
    const jdSkills = jd.extractedSkills;

    // Use Gemini to semantically normalize + identify truly missing skills
    let missingSkills = [];

    try {
      const analysis = await analyzeSkillGap(
        candidateSkills,
        jdSkills
      );
      missingSkills = analysis.missingSkills || [];
    } catch (aiError) {
      // Fallback to case-insensitive exact match if Gemini fails
      console.warn(
        "Gemini skill analysis failed, using fallback:",
        aiError.message
      );
      const lowerCandidate = candidateSkills.map(
        s => s.toLowerCase()
      );
      missingSkills = jdSkills.filter(
        skill => !lowerCandidate.includes(skill.toLowerCase())
      );
    }

    // RAG: embed missing skills → cosine similarity → top 3 resources each
    let recommendedResources = {};

    if (missingSkills.length > 0) {
      try {
        const {generateLearningPlan}= require("../rag/rag.service");

        const ragResult =
  await generateLearningPlan(
    missingSkills
  );

recommendedResources =
  ragResult.resources;

      } catch (ragError) {
        console.warn(
          "RAG recommendation skipped:",
          ragError.message
        );
      }
    }

    res.status(200).json({
      targetRole: jd.role,
      currentSkills: candidateSkills,
      jdSkills,
      missingSkills,
      recommendedResources,
    });

  } catch (error) {
    res.status(500).json({
      message: "Analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  getSkillGapAnalysis,
};