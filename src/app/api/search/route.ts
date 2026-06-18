import { NextRequest, NextResponse } from "next/server";

import {
  getSearchCached,
  setSearchCache
} from "@/services/searchCacheService";

import {
  searchMedia
} from "@/services/searchService";

export async function POST(
  request: NextRequest
) {

  const accessToken = 
    request.headers
      .get("Authorization")
      ?.split(" ")[1];

  console.log("TOKEN:", accessToken);

  const {
    profileId, 
    query
  } =
    await request.json();

  console.log("SEARCH API CALLED");
  console.log({ profileId, query });

  const cached =
    await getSearchCached(
      profileId,
      query,
    );

  if(cached!==null){

    return NextResponse.json({
      source:"cache",
      results:cached
    });

  }

  const results =
    await searchMedia(
      profileId,
      query,
      accessToken
    );

  await setSearchCache(
    profileId,
    query,
    results
  );

  return NextResponse.json({
    source:"supabase",
    results
  });

}