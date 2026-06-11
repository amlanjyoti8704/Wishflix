import { NextResponse } from "next/server";
import { clearAllSemanticCache } from "@/services/semanticCacheService";

export async function POST() {

  await clearAllSemanticCache();

  return NextResponse.json({
    success:true
  });

}