const model = require("../../config/gemini");

const generateQuestions = async (
  targetRole,
  missingSkills,
  skills,
  projects,
) => {
  const prompt = `
Generate 10 interview questions.

Role:
${targetRole}

Missing Skills:
${missingSkills.join(", ")}

Candidate Skills:
${skills.join(", ")}

Projects:
${JSON.stringify(projects, null, 2)}

Generate:
- 4 questions from missing skills
- 3 questions from candidate projects
- 3 questions from candidate strengths

Return ONLY valid JSON.

{
  "questions": [
    "question1",
    "question2"
  ]
}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  return JSON.parse(
    response.replace(/```json|```/g, "").trim()
  );
};



module.exports = generateQuestions;