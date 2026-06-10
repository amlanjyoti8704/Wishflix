import { NextRequest, NextResponse } from "next/server";
import { getRecentlyViewedCached }
from "@/services/recentlyViewedCacheService";

export async function POST(
  request: NextRequest
) {

  const {
    profileId,
    accessToken
  } = await request.json();

  const data =
    await getRecentlyViewedCached(
      profileId,
      accessToken
    );

  return NextResponse.json(data);
}