const CandidateProfile = require(
  "../resume/candidateProfile.model"
);

const JobDescription = require(
  "../jobDescription/jobDescription.model"
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
    const {
      candidateProfileId,
      jobDescriptionId,
    } = req.body;

    if (!candidateProfileId || !jobDescriptionId) {
      return res.status(400).json({
        message:
          "candidateProfileId and jobDescriptionId are required",
      });
    }

    const profile =
      await CandidateProfile.findById(
        candidateProfileId
      );

    if (
      !profile ||
      profile.userId.toString() !== req.user.userId
    ) {
      return res.status(404).json({
        message: "Candidate profile not found",
      });
    }

    const jd =
      await JobDescription.findById(
        jobDescriptionId
      );

    if (
      !jd ||
      jd.userId.toString() !== req.user.userId
    ) {
      return res.status(404).json({
        message: "Job description not found",
      });
    }

    const candidateSkillsLower =
      profile.skills.map(s => s.toLowerCase());

    const missingSkills =
      jd.extractedSkills.filter(
        skill =>
          !candidateSkillsLower.includes(
            skill.toLowerCase()
          )
      );

    const targetRole = jd.role;

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
        candidateProfileId,
        jobDescriptionId,
        targetRole,
        missingSkills,
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

const submitAnswer = async (req, res) => {
  try {
    const {
      sessionId,
      question,
      answer,
    } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({
        message:
          "sessionId, question, and answer are required",
      });
    }

    const session =
      await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    if (
      session.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Not authorized for this session",
      });
    }

    const updatedSession =
      await InterviewSession.findByIdAndUpdate(
        sessionId,
        {
          $push: {
            answers: {
              question,
              answer,
              score: null,
              strengths: [],
              weaknesses: [],
              suggestions: [],
            },
          },
        },
        { new: true }
      );

    const savedAnswer =
      updatedSession.answers[
        updatedSession.answers.length - 1
      ];

    res.status(200).json({
      message: "Answer submitted successfully",
      answer: savedAnswer,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Answer submission failed",
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
    } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({
        message:
          "sessionId, question, and answer are required",
      });
    }

    const session =
      await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    if (
      session.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Not authorized for this session",
      });
    }

    const targetRole = session.targetRole;

    const feedback =
      await evaluateAnswer(
        question,
        answer,
        targetRole
      );

    // Clamp score to 0-10 range
    feedback.score = Math.max(
      0,
      Math.min(10, feedback.score)
    );

    // Find existing unevaluated answer and update it
    const existingAnswerIndex =
      session.answers.findIndex(
        a =>
          a.question === question &&
          a.score === null
      );

    if (existingAnswerIndex !== -1) {
      // Update existing answer with evaluation
      session.answers[existingAnswerIndex].score =
        feedback.score;
      session.answers[existingAnswerIndex].strengths =
        feedback.strengths;
      session.answers[existingAnswerIndex].weaknesses =
        feedback.weaknesses;
      session.answers[existingAnswerIndex].suggestions =
        feedback.suggestions;
    } else {
      // No prior submission — push full entry
      session.answers.push({
        question,
        answer,
        score: feedback.score,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        suggestions: feedback.suggestions,
      });
    }

    await session.save();

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
  submitAnswer,
  evaluateInterviewAnswer,
};