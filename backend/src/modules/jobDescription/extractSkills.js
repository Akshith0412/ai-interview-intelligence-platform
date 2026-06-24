const { findCandidateSkills } = require("../rag/taxonomySearch");

async function extractSkills(jdText) {
  // Step 1: Semantic search to get candidate skills
  const candidatePool = await findCandidateSkills(jdText, 0.4);

  // Step 2: Return the skills directly without Gemini verification
  return {
    skills: candidatePool
  };
}

module.exports = extractSkills;