const mongoose =
  require("mongoose");

const LearningResource =
  require("./learningResource.model");

require("dotenv").config();

const resources =
  require("./resources.json");

async function seed() {

  await mongoose.connect(
    process.env.MONGO_URI
  );

  await LearningResource.deleteMany();

  await LearningResource.insertMany(
    resources
  );

  console.log(
    "Resources Seeded"
  );

  process.exit();
}

seed();