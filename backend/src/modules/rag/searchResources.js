require("dotenv").config();

const qdrant =
  require("../../config/qdrant");

const {
  generateEmbedding,
} = require(
  "./embedding.service"
);

async function search() {

  const query =
    "I want to learn Retrieval Augmented Generation";

  const embedding =
    await generateEmbedding(
      query
    );

  const results =
    await qdrant.search(
      "learning_resources",
      {
        vector: embedding,
        limit: 3,
      }
    );

  console.log(results);

}

search();