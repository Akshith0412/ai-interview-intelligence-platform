const qdrant =
  require("../../config/qdrant");

const {
  generateEmbedding,
} = require(
  "./embedding.service"
);

async function recommendResources(
  missingSkills
) {

  const recommendations = {};

  for (
    const skill
    of missingSkills
  ) {

    const embedding =
      await generateEmbedding(
        skill
      );

    const results =
      await qdrant.search(
        "learning_resources",
        {
          vector: embedding,
          limit: 3,
        }
      );

    recommendations[
      skill
    ] = results.map(
      item => ({
        title:
          item.payload.title,

        description:
          item.payload.description,

        url:
          item.payload.url,
      })
    );

  }

  return recommendations;
}

module.exports =
  recommendResources;