"use server";

// import { getCurrentProfile } from "@/lib/getCurrentProfile";
import { redis } from "@/lib/redis";

export async function getSearchCached(
  profileId: string,
  query: string
) {
  const normalizedQuery =
    query.trim().toLowerCase();
  
  // const profileId = getCurrentProfile().id;

  const cacheKey =
    `search:${profileId}:${normalizedQuery}`;

  const cached =
    await redis.get(cacheKey);

  if (cached) {
    console.log(
      "SEARCH REDIS HIT:",
      normalizedQuery
    );

    return cached;
  }

  console.log(
    "SEARCH REDIS MISS:",
    normalizedQuery
  );

  return null;
}

export async function setSearchCache(
  profileId: string,
  query: string,
  results: any[]
) {
  const normalizedQuery =
    query.trim().toLowerCase();

  const cacheKey =
    `search:${profileId}:${normalizedQuery}`;

  console.log(
    "SETTING SEARCH CACHE:",
    cacheKey
  );

  await redis.set(
    cacheKey,
    results,
    {
      ex: 60 * 10, // 10 minutes
    }
  );
}

// export async function clearSearchCache() {

//   const keys =
//     await redis.keys(
//       "search:*"
//     );

//   if(keys.length){

//     await redis.del(...keys);

//   }
// }