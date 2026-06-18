"use server"
import { getCurrentProfile } from "@/lib/getCurrentProfile";
import { supabase } from "../../lib/supabaseClient";
// import { generateEmbedding } from "./embeddingService";
import { getQueryEmbedding } from "./queryEmbeddingCacheService";

export async function semanticSearch(query: string, profileId: string) {


  const embedding =
    await getQueryEmbedding(query);

  const { data, error } =
    await supabase.rpc(
      "search_media",
      {
        query_embedding: embedding,
        profile_uuid: profileId,
        match_threshold: 0.6,
        match_count: 20,
      }
    );

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}