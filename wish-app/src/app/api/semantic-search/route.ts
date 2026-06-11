import {
  getSemanticCache,
  setSemanticCache
}
from "@/services/semanticCacheService";

import {
  semanticSearch
}
from "@/services/semanticSearchService";

import { NextResponse }
from "next/server";

export async function POST(
  request: Request
){

  const {
    profileId,
    query
  } = await request.json();

  const cached =
    await getSemanticCache(
      profileId,
      query
    );

  if(cached){

    return NextResponse.json({
      source:"cache",
      results:cached
    });
  }

  const results =
    await semanticSearch(
      query,
      profileId
    );

  await setSemanticCache(
    profileId,
    query,
    results
  );

  return NextResponse.json({
    source:"vector",
    results
  });
}