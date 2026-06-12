import { NextRequest, NextResponse } from "next/server";
import { memorySearch } from "@/services/memorySearchService";

export async function POST(
  request: NextRequest
) {

  const {
    profileId,
    query
  } = await request.json();

  const results =
    await memorySearch(
      query,
      profileId
    );

  return NextResponse.json({
    results
  });
}