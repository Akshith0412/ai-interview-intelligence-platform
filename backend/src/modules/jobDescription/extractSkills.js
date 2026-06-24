const model =
  require("../../config/gemini");

async function extractSkills(
  jdText
) {

  const prompt = `
Extract all technical skills from the following job description.

Return ONLY valid JSON.

{
  "skills": []
}

Job Description:

${jdText}
`;

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

}

module.exports =
  extractSkills;