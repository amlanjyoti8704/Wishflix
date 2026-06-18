"use server";

import { redis } from "@/lib/redis";

export async function getRecommendationCache(
  profileId: string
) {

  const cacheKey =
    `recommend:${profileId}`;

  const cached =
    await redis.get(cacheKey);

  if(cached){

    console.log(
      "RECOMMEND CACHE HIT:",
      profileId
    );

    return cached;
  }

  console.log(
    "RECOMMEND CACHE MISS:",
    profileId
  );

  return null;
}

export async function setRecommendationCache(
  profileId: string,
  recommendations: any[]
) {

  const cacheKey =
    `recommend:${profileId}`;

  await redis.set(
    cacheKey,
    recommendations,
    {
      ex: 60 * 10
    }
  );

  console.log(
    "RECOMMEND CACHE STORED:",
    profileId
  );
}

export async function clearRecommendationCache(
  profileId: string
) {

  const cacheKey =
    `recommend:${profileId}`;

  await redis.del(cacheKey);

  console.log(
    "RECOMMEND CACHE CLEARED:",
    profileId
  );
}