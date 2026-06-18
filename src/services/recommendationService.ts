"use server";

import { supabase } from "../../lib/supabaseClient";

export async function getRecommendations(
  profileId: string
) {

  const { data, error } =
    await supabase.rpc(
      "recommend_media",
      {
        profile_uuid: profileId,
        // match_threshold: 30,
        match_count: 20
      }
    );


  if(error){
    console.log(error);
    return [];
  }

  return data ?? [];
}

