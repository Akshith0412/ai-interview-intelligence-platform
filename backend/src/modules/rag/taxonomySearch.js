const qdrant = require("../../config/qdrant");
const { generateEmbedding } = require("./embedding.service");
const { chunkText } = require("../../utils/chunking");

/**
 * Takes raw text (like a Resume or JD), chunks it, embeds each chunk, 
 * searches the 'skill_taxonomy' Qdrant collection, and returns a deduplicated 
 * set of candidate skills that semantically match the text chunks.
 */
async function findCandidateSkills(text, scoreThreshold = 0.5) {
  const chunks = chunkText(text, 50, 10); // Smaller chunks for more granular skill matching
  const candidateSet = new Set();
  
  for (const chunk of chunks) {
    const vector = await generateEmbedding(chunk);
    
    const searchResults = await qdrant.search("skill_taxonomy", {
      vector: vector,
      limit: 3, // Top 3 taxonomy matches per chunk
      score_threshold: scoreThreshold
    });
    
    for (const result of searchResults) {
      if (result.payload && result.payload.skill) {
        candidateSet.add(result.payload.skill);
      }
    }
  }
  
  return Array.from(candidateSet);
}

module.exports = { findCandidateSkills };
