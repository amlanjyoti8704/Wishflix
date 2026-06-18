import { NextResponse } from "next/server";
import { clearSemanticCache } from "@/services/semanticCacheService";

export async function POST(request:Request) {

  const { profileId } =
    await request.json();

  await clearSemanticCache(
    profileId
  );

  return NextResponse.json({
    success:true
  });

}