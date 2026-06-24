const model = require("../config/gemini");
const { findCandidateSkills } = require("../modules/rag/taxonomySearch");

const extractCandidateProfile = async (resumeText) => {
  // Step 1: Semantic search to get candidate skills
  const candidatePool = await findCandidateSkills(resumeText, 0.4);

  // Step 2: Gemini Verification and full extraction
  const prompt = `
Extract information from this resume.

We have already performed a semantic search to find potential skills matching the text.
Candidate Skill Pool: [${candidatePool.join(", ")}]

Instructions:
1. Verify which skills from the "Candidate Skill Pool" the candidate ACTUALLY possesses based on the resume text. 
2. Do NOT hallucinate skills not present in the pool unless they are prominently featured in the resume. 
3. Extract the remaining details (name, projects, education, experienceLevel).

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

  return JSON.parse(
    response.replace(/```json|```/g, "").trim()
  );
};

module.exports = extractCandidateProfile;