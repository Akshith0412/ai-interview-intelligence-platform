const {
  generateLearningPlan
} = require("./rag.service");

async function test() {

  const result =
    await generateLearningPlan([
      "RAG",
      "LangChain",
      "Docker",
      "Vector Databases",
      "LLMs"
    ]);

  console.log(result);
}

test();