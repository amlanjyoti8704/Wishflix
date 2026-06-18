"use server";

import { redis } from "@/lib/redis";
import { generateEmbedding } from "./embeddingService";

export async function getQueryEmbedding(
  query: string
) {
  const normalized =
    query.trim().toLowerCase();

  const cacheKey =
    `query_embedding:${normalized}`;

  const cached =
    await redis.get<number[]>(
      cacheKey
    );

  if (cached) {
    console.log(
      "QUERY EMBEDDING CACHE HIT:",
      normalized
    );

    return cached;
  }

  console.log(
    "QUERY EMBEDDING CACHE MISS:",
    normalized
  );

  const embedding =
    await generateEmbedding(
      normalized
    );

  await redis.set(
    cacheKey,
    embedding,
    {
      ex: 60 * 60 * 24 * 30 // 30 days
    }
  );

  return embedding;
}