"use server";

import { redis } from "@/lib/redis";

export async function testRedis() {
  await redis.set("test", "WishFlix");

  return await redis.get("test");
}