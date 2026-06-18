"use server";

import { createAuthenticatedClient } from "../../lib/serverSupabase";
import { clearMemoryCache } from "./memoryCacheService";
import { generateEmbedding } from "./embeddingService";
import { clearRecommendationCache } from "./recommendationCacheService";

export async function saveMemory(
  profileId: string,
  type: string,
  content: string,
  accessToken: string,
  mediaId?: string,
) {

  console.log("SAVE MEMORY CALLED");
  console.log({
    profileId,
    type,
    mediaId
  });

  const embedding =
    await generateEmbedding(content);

  console.log(
    "EMBEDDING LENGTH",
    embedding.length
  );

  const supabase =
    createAuthenticatedClient(accessToken);

//   const { error } =
//     await supabase
//       .from("memory_embeddings")
//       .insert({
//         profile_id: profileId,
//         memory_type: type,
//         content,
//         embedding
//       });

    let existingQuery=
        supabase
            .from("memory_embeddings")
            .select("id")
            .eq("profile_id", profileId)
            .eq("memory_type", type)
    
    if(mediaId){
        existingQuery=
            existingQuery.eq("media_id", mediaId);
    }

    const { data: existing } =
        await existingQuery.maybeSingle();

    console.log(
      "ABOUT TO INSERT MEMORY"
    );
    
    const result= existing?
        await supabase
        .from("memory_embeddings")
        .update({
            content,
            embedding,
            created_at: new Date().toISOString()
        })
        .eq("id", existing.id)
        :
        await supabase
        .from("memory_embeddings")
        .insert({
            profile_id: profileId,
            media_id: mediaId,
            memory_type: type,
            content,
            embedding
        });
    
    console.log(
        "RESULT",
        result
    );

  if(result.error){
    console.log(result.error);
  }

  if(!result.error){
    const memoryClear=await clearMemoryCache(profileId);
    const recommendationClear=await clearRecommendationCache(profileId);

    console.log(
      "CACHE CLEARED",
      memoryClear,
      "Recommendation Cache Cleared",
      recommendationClear
    );
  }
}

export async function deleteMemory(
  profileId:string,
  mediaId:string,
  accessToken:string
){
  const supabase=
    createAuthenticatedClient(accessToken);

  const {error}=await supabase
    .from("memory_embeddings")
    .delete()
    .eq("profile_id", profileId)
    .eq("media_id", mediaId);

  if(error){
    console.log(error);
  }

  if(!error){
    await clearMemoryCache(profileId);
    await clearRecommendationCache(profileId);
  }
}