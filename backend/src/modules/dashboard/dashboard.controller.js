const InterviewSession = require(
  "../interview/interviewSession.model"
);

const getDashboardSummary = async (
  req,
  res
) => {
  try {

    const sessions =
      await InterviewSession.find({
        userId: req.user.userId,
      });

    let totalInterviews =
      sessions.length;

    let totalScore = 0;
    let answerCount = 0;

    sessions.forEach(session => {

      session.answers.forEach(answer => {

        totalScore += answer.score;
        answerCount++;

      });

    });

    const averageScore =
      answerCount === 0
        ? 0
        : Math.round(
            totalScore / answerCount
          );

    res.status(200).json({
      totalInterviews,
      averageScore,
    });

  } catch (error) {

    res.status(500).json({
      message: "Dashboard failed",
      error: error.message,
    });

  }
};

const getProgress = async (req, res) => {
  try {

    const sessions =
      await InterviewSession.find({
        userId: req.user.userId,
      });

    const totalInterviews = sessions.length;

    let totalScore = 0;
    let answerCount = 0;

    // Track per-skill scores
    const skillScores = {};

    sessions.forEach(session => {

      // Compute session average score
      let sessionTotal = 0;
      let sessionCount = 0;

      session.answers.forEach(answer => {
        if (answer.score !== null && answer.score !== undefined) {
          totalScore += answer.score;
          answerCount++;
          sessionTotal += answer.score;
          sessionCount++;
        }
      });

      // Associate session's missing skills
      // with the session's average score
      if (
        sessionCount > 0 &&
        session.missingSkills &&
        session.missingSkills.length > 0
      ) {
        const sessionAvg =
          sessionTotal / sessionCount;

        session.missingSkills.forEach(skill => {
          if (!skillScores[skill]) {
            skillScores[skill] = {
              total: 0,
              count: 0,
            };
          }
          skillScores[skill].total += sessionAvg;
          skillScores[skill].count += 1;
        });
      }

    });

    const averageScore =
      answerCount === 0
        ? 0
        : parseFloat(
            (totalScore / answerCount).toFixed(1)
          );

    // Build sorted skill list
    const skillList = Object.entries(skillScores)
      .map(([skill, data]) => ({
        skill,
        averageScore: parseFloat(
          (data.total / data.count).toFixed(1)
        ),
      }))
      .sort(
        (a, b) => a.averageScore - b.averageScore
      );

    const weakestSkills = skillList
      .slice(0, 5)
      .map(s => s.skill);

    const strongestSkills = skillList
      .slice(-5)
      .reverse()
      .map(s => s.skill);

    res.status(200).json({
      totalInterviews,
      averageScore,
      weakestSkills,
      strongestSkills,
    });

  } catch (error) {

    res.status(500).json({
      message: "Progress tracking failed",
      error: error.message,
    });

  }
};

module.exports = {
  getDashboardSummary,
  getProgress,
};