"use server";

import { redis } from "@/lib/redis";

export async function clearContinueWatchingCache(
  profileId:string
) {

  console.log(
    "DELETING CONTINUE CACHE",
    profileId
  );

  await redis.del(
    `continue:${profileId}`
  );
}