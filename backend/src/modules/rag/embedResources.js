require("dotenv").config();

const mongoose =
  require("mongoose");

const LearningResource =
  require("./learningResource.model");

const {
  generateEmbedding,
} = require(
  "./embedding.service"
);


const qdrant =
  require("../../config/qdrant");



async function embedResources() {

    await mongoose.connect(
  process.env.MONGO_URI
);
  const resources =
    await LearningResource.find();

  for (
    let i = 0;
    i < resources.length;
    i++
  ) {

    const resource =
      resources[i];

    const text = `
      ${resource.skill}
      ${resource.title}
      ${resource.description}
    `;

    const embedding =
      await generateEmbedding(
        text
      );

    await qdrant.upsert(
      "learning_resources",
      {
        wait: true,

        points: [
          {
            id: i + 1,

            vector:
              embedding,

            payload: {
              mongoId:
                resource._id.toString(),

              skill:
                resource.skill,

              title:
                resource.title,

              description:
                resource.description,

              url:
                resource.url,
            },
          },
        ],
      }
    );

    console.log(
      `Embedded: ${resource.title}`
    );

  }

  console.log(
    "Embedding Complete"
  );

}

embedResources();