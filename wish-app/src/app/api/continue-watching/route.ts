import {
  getContinueWatchingCached
}
from "@/services/continueWatchingCacheService";

import {
  NextRequest,
  NextResponse
}
from "next/server";

export async function POST(
  request: NextRequest
) {

  const {
    profileId,
    accessToken
  } = await request.json();

  const data =
    await getContinueWatchingCached(
      profileId,
      accessToken
    );

  return NextResponse.json(
    data
  );
}