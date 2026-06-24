const qdrant = require("../../config/qdrant");
const { generateEmbedding } = require("./embedding.service");
const taxonomy = require("./skill_taxonomy.json");

async function seedTaxonomy() {
  try {
    const collectionName = "skill_taxonomy";
    
    console.log("Checking if collection exists...");
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === collectionName);

    if (exists) {
      console.log(`Deleting existing collection '${collectionName}'...`);
      await qdrant.deleteCollection(collectionName);
    }

    console.log(`Creating collection '${collectionName}'...`);
    await qdrant.createCollection(collectionName, {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });

    console.log(`Embedding ${taxonomy.length} skills...`);
    const points = [];
    
    for (let i = 0; i < taxonomy.length; i++) {
      const skill = taxonomy[i];
      const vector = await generateEmbedding(skill);
      points.push({
        id: i + 1,
        vector: vector,
        payload: { skill: skill }
      });
    }

    console.log(`Upserting points to Qdrant...`);
    await qdrant.upsert(collectionName, {
      wait: true,
      points: points
    });

    console.log("Taxonomy successfully seeded into Qdrant!");
  } catch (error) {
    console.error("Error seeding taxonomy:", error);
  }
}

seedTaxonomy();
