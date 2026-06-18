"use server";

import { redis } from "@/lib/redis";
import { createAuthenticatedClient }
from "../../lib/serverSupabase";

type ContinueWatching = {
  progress_seconds: number;
  duration_seconds: number;
  media: any;
};

export async function getContinueWatchingCached(
  profileId: string,
  accessToken: string
) {

  const cacheKey =
    `continue:${profileId}`;

  const cached =
    await redis.get<ContinueWatching[]>(
      cacheKey
    );

  if (cached) {

    console.log(
      "CONTINUE WATCHING REDIS HIT:",
      profileId
    );

    return cached;
  }

  console.log(
    "CONTINUE WATCHING REDIS MISS:",
    profileId
  );

  const supabase =
    createAuthenticatedClient(
      accessToken
    );

  const { data, error } =
    await supabase
      .from("continue_watching")
      .select(`
        progress_seconds,
        duration_seconds,
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
        "updated_at",
        { ascending: false }
      );

  if (error) {
    console.log(error);
    return [];
  }

  await redis.set(
    cacheKey,
    data,
    {
      ex: 60 * 5
    }
  );

  return data;
}