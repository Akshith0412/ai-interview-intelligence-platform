const model = require("../config/gemini");

const extractCandidateProfile = async (resumeText) => {
  const prompt = `
Extract information from this resume.

Return ONLY valid JSON.

{
  "name": "",
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],
  "education": {
    "degree": "",
    "branch": ""
  },
  "experienceLevel": ""
}

Resume:

${resumeText}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  console.log(response); // temporary for debugging

  return JSON.parse(
    response.replace(/```json|```/g, "").trim()
  );
};

module.exports = extractCandidateProfile;