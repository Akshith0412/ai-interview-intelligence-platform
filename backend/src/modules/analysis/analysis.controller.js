const CandidateProfile = require(
  "../resume/candidateProfile.model"
);

const JobDescription =
  require(
    "../jobDescription/jobDescription.model"
  );

const recommendResources =
  require(
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
  await JobDescription.findOne({
    userId: req.user.userId
  }).sort({
    createdAt: -1
  });
  if (!jd) {
  return res.status(404).json({
    message: "Job Description not found",
  });
}

  const candidateSkills =
  profile.skills;

const jdSkills =
  jd.extractedSkills;

  const missingSkills =
  jdSkills.filter(
    skill =>
      !candidateSkills.includes(
        skill
      )
  );

  const recommendedResources =
  await recommendResources(
    missingSkills
  );
  

    
    res.status(200).json({
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