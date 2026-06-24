const qdrant =
  require("../../config/qdrant");

async function createCollection() {

  try {

    await qdrant.createCollection(
      "learning_resources",
      {
        vectors: {
          size: 384,
          distance: "Cosine",
        },
      }
    );

    console.log(
      "Collection Created"
    );

  } catch (error) {

    console.log(error);

  }

}

createCollection();