const recommendResources =
  require(
    "./recommendResources"
  );

async function test() {

  const resources =
    await recommendResources([
      "RAG",
      "Docker",
      "LLMs"
    ]);

  console.log(resources);

}

test();