"use server";

import { redis } from "@/lib/redis";

export async function invalidateRecentlyViewed(
  profileId:string
){
  await redis.del(
    `recent:${profileId}`
  );
}