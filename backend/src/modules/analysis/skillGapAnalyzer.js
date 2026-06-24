const model = require("../../config/gemini");

/**
 * Uses Gemini to:
 * 1. Normalize and deduplicate JD skills (remove generic/overlapping entries)
 * 2. Semantically filter out skills the candidate already has
 *    (even if named differently — e.g. "DSA" covers "Programming Fundamentals")
 * 3. Return only genuinely missing, specific, concrete skills
 *
 * Returns { missingSkills: string[] }
 */
async function analyzeSkillGap(candidateSkills, jdSkills) {
  const prompt = `
You are an expert technical recruiter performing a precise skill gap analysis.

Candidate Skills:
${candidateSkills.join(", ")}

Job Description Required Skills:
${jdSkills.join(", ")}

Instructions:
1. First, NORMALIZE the JD skills list:
   - Remove generic/vague entries like "Software Engineering", "Software Development", "Programming Fundamentals" — these are not specific skills
   - Merge duplicates and near-duplicates (e.g. "RAG" and "RAG (Retrieval Augmented Generation)" → keep only "RAG")
   - Keep only concrete, learnable technical skills and frameworks

2. Then, identify which NORMALIZED JD skills are TRULY missing from the candidate:
   - Use semantic understanding — "DSA" covers "Data Structures", "Machine Learning" covers basic "Applied AI"
   - Do NOT mark a skill as missing if the candidate has an equivalent or broader skill
   - Do NOT include skills the candidate clearly has under a different name

3. Return ONLY the final list of genuinely missing, specific, concrete skills.

Return ONLY valid JSON:
{
  "missingSkills": ["skill1", "skill2"]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );
}

module.exports = analyzeSkillGap;
