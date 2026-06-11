"use server";

import { redis } from "@/lib/redis";
import { createAuthenticatedClient }
from "../../lib/serverSupabase";

type RecentlyViewed = {
  viewed_at:string;
  media:any;
}

export async function getRecentlyViewedCached(
  profileId: string,
  accessToken: string
) {

  const cacheKey =
    `recent:${profileId}`;

    // console.log(
    // "CACHE KEY",
    // cacheKey
    // );

  // Check cache first
  const cached =
    await redis.get<RecentlyViewed[]>(cacheKey);

    // console.log(
    //   "CACHED VALUE:",
    //   cached
    // );

  if (cached) {

    console.log(
      "RECENTLY VIEWED REDIS HIT:",
      profileId
    );

    return cached;
  }

  console.log(
    "RECENTLY VIEWED REDIS MISS:",
    profileId
  );

  const supabase =
    createAuthenticatedClient(
      accessToken
    );

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

console.log(
  "SETTING CACHE",
  cacheKey
);

  await redis.set(
    cacheKey,
    data,
    {
      ex: 60 * 5,
    }
  );

  console.log(
  "CACHE STORED",
  cacheKey
);

  return data;
}