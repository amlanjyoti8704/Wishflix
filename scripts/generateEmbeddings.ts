import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { createClient }
from "@supabase/supabase-js";

import { generateEmbedding }
from "../src/services/embeddingService";

console.log("URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVICE =", process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("GEMINI =", process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


async function main() {

    console.log(
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

console.log(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

  const { data: mediaItems, error } =
    await supabase
      .from("media")
      .select("*");

  if(error){
    console.error(error);
    return;
  }

  for(const media of mediaItems){

    console.log(
      `Embedding: ${media.title}`
    );

    const text = `
      Title: ${media.title || ""}
      Description: ${media.description || ""}
    `;

    const embedding =
      await generateEmbedding(text);

    const { error:updateError } =
      await supabase
        .from("media")
        .update({
          embedding
        })
        .eq("id", media.id);

    if(updateError){
      console.log(
        updateError
      );
    }
  }


  console.log(
    "Finished!"
  );
}

main();