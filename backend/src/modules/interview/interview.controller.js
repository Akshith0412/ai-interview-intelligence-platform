const CandidateProfile = require(
  "../resume/candidateProfile.model"
);

const RoleRequirement = require(
  "../analysis/roleRequirement.model"
);

const generateQuestions = require(
  "./questionGenerator"
);

const evaluateAnswer = require(
  "./evaluateAnswer"
);

const InterviewSession = require(
  "./interviewSession.model"
);

const generateInterview = async (req, res) => {
  try {
    const { targetRole } = req.body;

    const profile =
      await CandidateProfile.findOne({
        userId: req.user.userId,
      });

    if (!profile) {
      return res.status(404).json({
        message: "Candidate profile not found",
      });
    }

    const role =
      await RoleRequirement.findOne({
        roleName: targetRole,
      });

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const missingSkills =
      role.requiredSkills.filter(
        skill => !profile.skills.includes(skill)
      );

    const questions =
      await generateQuestions(
        targetRole,
        missingSkills,
        profile.skills,
        profile.projects
      );

    const session =
      await InterviewSession.create({
        userId: req.user.userId,
        targetRole,
        questions: questions.questions,
    });

    res.status(200).json({
        sessionId: session._id,
        targetRole,
        missingSkills,
        questions: questions.questions,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Question generation failed",
      error: error.message,
    });
  }
};

const evaluateInterviewAnswer = async (
  req,
  res
) => {
  try {
    const {
      sessionId,
      question,
      answer,
      targetRole,
    } = req.body;

    const feedback =
      await evaluateAnswer(
        question,
        answer,
        targetRole
      );
      console.log("Session ID:", sessionId);
        console.log("Feedback:", feedback);
const updatedSession =
  await InterviewSession.findByIdAndUpdate(
    sessionId,
    {
      $push: {
        answers: {
          question,
          answer,
          score: feedback.score,
        }
      }
    },
    { new: true }
  );

console.log(updatedSession);

    res.status(200).json(feedback);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Evaluation failed",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterview,
  evaluateInterviewAnswer,
};