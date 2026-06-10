"use server";

import { redis } from "@/lib/redis";

export async function clearRecentlyViewedCache(
  profileId: string
) {

    console.log(
    "DELETING CACHE",
    profileId
    );

    await redis.del(
    `recent:${profileId}`
    );
}