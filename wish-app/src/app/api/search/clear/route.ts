import { NextResponse } from "next/server";
import { clearAllSearchCache } from "../../../../services/searchCacheActions";

export async function POST() {

  await clearAllSearchCache();

  return NextResponse.json({
    success:true
  });

}