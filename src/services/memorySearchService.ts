"use server";

import { supabase }
from "../../lib/supabaseClient";

import { getQueryEmbedding }
from "./queryEmbeddingCacheService";

export async function memorySearch(
  query: string,
  profileId: string
) {

  const embedding =
    await getQueryEmbedding(query);

  const { data, error } =
    await supabase.rpc(
      "search_memory",
      {
        query_embedding: embedding,
        profile_uuid: profileId,
        match_threshold: 0.35,
        match_count: 20
      }
    );

  if(error){
    console.log(error);
    return [];
  }

  return data;
}