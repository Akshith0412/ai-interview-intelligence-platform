const { generateEmbedding } = require("./embedding.service");
const resources = require("./resources.json");

// Pre-compute embeddings for all resources once (lazy singleton)
let resourceVectors = null;

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function buildResourceIndex() {
  if (resourceVectors) return resourceVectors;

  console.log(
    `Building in-memory resource index (${resources.length} resources)...`
  );

  const indexed = await Promise.all(
    resources.map(async (resource) => {
      // Embed the skill name + title + description for rich semantic matching
      const text = `${resource.skill} ${resource.title} ${resource.description}`;
      const vector = await generateEmbedding(text);
      return { resource, vector };
    })
  );

  resourceVectors = indexed;
  console.log("Resource index ready.");
  return resourceVectors;
}

/**
 * For each missing skill, embed the skill query and find the top-N
 * most semantically similar resources using cosine similarity.
 * Returns grouped recommendations: { skill: [resources] }
 */
async function recommendResources(missingSkills, topN = 3) {
  const index = await buildResourceIndex();
  const recommendations = {};

  for (const skill of missingSkills) {
    const skillVector = await generateEmbedding(skill);

    // Score every resource
    const scored = index.map(({ resource, vector }) => ({
      resource,
      score: cosineSimilarity(skillVector, vector),
    }));

    // Sort descending and take top N
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topN);

    recommendations[skill] = top.map(({ resource }) => ({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      skill: resource.skill,
    }));
  }

  return recommendations;
}

module.exports = recommendResources;