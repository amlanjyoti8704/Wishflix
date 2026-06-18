"use server";

import { redis } from "@/lib/redis";

export async function testRedis() {
  await redis.set("test", "WishFlix");

  const value = await redis.get("test");

  console.log(value);

  return value;
}