const mongoose = require("mongoose");
const dotenv = require("dotenv");

const RoleRequirement = require(
  "../src/modules/analysis/roleRequirement.model"
);

dotenv.config();

const roles = [
  {
    roleName: "AI Engineer",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "RAG",
      "Vector Databases",
      "LLMs",
      "Prompt Engineering"
    ]
  },

  {
    roleName: "Backend Engineer",
    requiredSkills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Redis",
      "Docker",
      "REST APIs",
      "JWT"
    ]
  },

  {
    roleName: "Software Engineer",
    requiredSkills: [
      "DSA",
      "OOP",
      "DBMS",
      "OS",
      "CN",
      "Git"
    ]
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await RoleRequirement.deleteMany();

    await RoleRequirement.insertMany(roles);

    console.log("Roles Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedRoles();