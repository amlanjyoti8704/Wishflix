"use server";

import { redis } from "@/lib/redis";
import { supabase } from "../../lib/supabaseClient";

export async function getRecentlyViewedCached(
  profileId: string
) {

  const cacheKey =
    `recent:${profileId}`;

  const cached =
    await redis.get(cacheKey);

  if(cached){
    console.log("REDIS HIT");
    return cached;
  }

  console.log("SUPABASE HIT");

  const { data, error } =
    await supabase
      .from("recently_viewed")
      .select(`
        viewed_at,
        media (
          *,
          media_categories (
            category
          )
        )
      `)
      .eq(
        "profile_id",
        profileId
      )
      .order(
        "viewed_at",
        {
          ascending:false
        }
      )
      .limit(20);

  if(error){
    console.log(error);
    return [];
  }

  await redis.set(
    cacheKey,
    data,
    {
      ex: 60 * 10
    }
  );

  return data;
}