import { NextRequest, NextResponse } from "next/server";
import { memorySearch } from "@/services/memorySearchService";
import { getMemoryCache, setMemoryCache } from "@/services/memoryCacheService";

export async function POST(
  request: NextRequest
) 
{
  const {
    profileId,
    query
  } = await request.json();

  const cached=await getMemoryCache(profileId, query);
  
  if(cached){
    return NextResponse.json({
     source: "redis",
     results: cached
    });
  }

  const results =
    await memorySearch(
      query,
      profileId
    );

  await setMemoryCache(profileId, query, results);

  return NextResponse.json({
    source: "supabase",
    results
  });
}