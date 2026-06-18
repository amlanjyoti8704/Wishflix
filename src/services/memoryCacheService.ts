"use server";

import { redis } from "@/lib/redis";

export async function getMemoryCache(
  profileId: string,
  query: string
) {

  const normalizedQuery=query.trim().toLowerCase();

  if(normalizedQuery.length===0){
    return null;
  }

  const cacheKey =
    `memory:${profileId}:${normalizedQuery}`;

  const cached =
    await redis.get(cacheKey);

  if(cached){

    console.log(
      "MEMORY REDIS HIT:",
      cacheKey
    );

    return cached;
  }

  console.log(
    "MEMORY REDIS MISS:",
    cacheKey
  );

  return null;
}

export async function setMemoryCache(
  profileId: string,
  query: string,
  results: any
) {

  const normalizedQuery=query.trim().toLowerCase();

  if(normalizedQuery.length===0){
    return;
  }

  const cacheKey =
    `memory:${profileId}:${normalizedQuery}`;

  await redis.set(
    cacheKey,
    results,
    {
      ex: 60 * 10
    }
  );

  console.log(
    "MEMORY CACHE STORED:",
    cacheKey
  );
}

export async function clearMemoryCache(
  profileId: string
) {

  const keys =
    await redis.keys(
      `memory:${profileId}:*`
    );

  if(keys.length){

    await redis.del(...keys);

    console.log(
      "MEMORY CACHE CLEARED:",
      profileId
    );
  }
}

export async function clearAllMemoryCache() {

  const keys =
    await redis.keys(
      "memory:*"
    );

  if(keys.length){

    await redis.del(...keys);

  }
}