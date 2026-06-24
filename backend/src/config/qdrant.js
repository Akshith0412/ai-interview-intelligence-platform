const {
  QdrantClient,
} = require(
  "@qdrant/js-client-rest"
);

const qdrant =
  new QdrantClient({
    url: "http://localhost:6333",
  });

module.exports = qdrant;