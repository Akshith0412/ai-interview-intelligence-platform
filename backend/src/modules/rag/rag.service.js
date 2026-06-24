const qdrant =
  require("../../config/qdrant");

const {
  generateEmbedding,
} = require(
  "./embedding.service"
);

const model =
  require("../../config/gemini");

async function generateLearningPlan(
  missingSkills
) {

    const allResources = [];
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
        vector:
          embedding,
        limit: 2,
      }
    );

  allResources.push(
    ...results
  );
}

const uniqueResources =
  Array.from(
    new Map(
      allResources.map(
        item => [
          item.payload.title,
          item
        ]
      )
    ).values()
  );

  const context =
    uniqueResources
      .map(
        item =>
          `
Title:
${item.payload.title}

Description:
${item.payload.description}

URL:
${item.payload.url}
`
      )
      .join("\n\n");

  const prompt = `
You are an AI Career Mentor.

Missing Skills:
${missingSkills.join(", ")}

Learning Resources:
${context}

Create a personalized roadmap
for mastering the missing skills.
`;

console.log(
  "Retrieved Resources:"
);

console.log(
  uniqueResources
);
  const result =
    await model.generateContent(
      prompt
    );

  return result.response.text();

}

module.exports = {
  generateLearningPlan,
};