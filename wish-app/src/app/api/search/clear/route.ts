import { NextResponse } from "next/server";
import { clearSearchCache } from "../../../../services/searchCacheActions";

export async function POST(request: Request) {

  const { profileId } = await request.json();

  await clearSearchCache(profileId);

  return NextResponse.json({
    success: true
  });

}