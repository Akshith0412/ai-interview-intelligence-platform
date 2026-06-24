const model = require("../../config/gemini");

const evaluateAnswer = async (
  question,
  answer,
  targetRole
) => {

  const prompt = `
You are a senior technical interviewer.

Role:
${targetRole}

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
`;

  try {

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      result.response.text();

    return JSON.parse(
      response
        .replace(/```json|```/g, "")
        .trim()
    );

  } catch (error) {

    console.error(error);

    return {
      score: 0,
      strengths: [],
      weaknesses: [
        "AI evaluation service is temporarily unavailable."
      ],
      suggestions: [
        "Please try again later."
      ]
    };

  }

};

module.exports = evaluateAnswer;