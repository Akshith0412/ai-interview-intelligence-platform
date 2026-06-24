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

module.exports = {
  getDashboardSummary,
};