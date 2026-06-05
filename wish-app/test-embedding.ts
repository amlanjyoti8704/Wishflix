// test-embedding.ts

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCv5EckXf48LlA9KCdPfy1ewKG3YKEDa1w",
});

async function main() {

  const result =

    await ai.models.embedContent({

      model: "gemini-embedding-001",

      contents: "birthday celebration with family"

    });

  console.log(

    result.embeddings?.[0]?.values?.length

  );

}
// async function main() {

//   const models = await ai.models.list();

//   for await (const model of models) {

//     console.log(model.name);

//   }

// }

main();