"use server";

import { redis } from "@/lib/redis";

export async function clearSearchCache(
  profileId:string
) {

  const cacheKey =
    `search:${profileId}:*`;

  console.log(
    "DELETING SEARCH CACHE:",
    cacheKey
  );

  await redis.del(cacheKey);
}

export async function clearAllSearchCache() {

  const keys =
    await redis.keys(
      "search:*"
    );

  if(keys.length){

    await redis.del(...keys);

  }

}