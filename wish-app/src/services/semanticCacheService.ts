"use server";

import { redis } from "@/lib/redis";

export async function getSemanticCache(
  profileId: string,
  query: string
) {

  const cacheKey =
    `semantic:${profileId}:${query.toLowerCase()}`;

  const cached =
    await redis.get(cacheKey);

  if(cached){

    console.log(
      "SEMANTIC REDIS HIT:",
      cacheKey
    );

    return cached;
  }

  console.log(
    "SEMANTIC REDIS MISS:",
    cacheKey
  );

  return null;
}

export async function setSemanticCache(
  profileId: string,
  query: string,
  results: any
) {

  const cacheKey =
    `semantic:${profileId}:${query.toLowerCase()}`;

  await redis.set(
    cacheKey,
    results,
    {
      ex: 60 * 10 // 10 mins
    }
  );

  console.log(
    "SEMANTIC CACHE STORED:",
    cacheKey
  );
}

export async function clearSemanticCache(
  profileId: string
) {

  const keys =
    await redis.keys(
      `semantic:${profileId}:*`
    );

  if(keys.length > 0){

    await redis.del(...keys);

    console.log(
      "SEMANTIC CACHE CLEARED:",
      profileId
    );
  }
}

export async function clearAllSemanticCache() {

  const keys =
    await redis.keys(
      "semantic:*"
    );

  if(keys.length){

    await redis.del(...keys);

  }

}