import { NextResponse } from "next/server";
import { getRecommendations } from "@/services/recommendationService";
import { getRecommendationCache, setRecommendationCache } from "@/services/recommendationCacheService";

export async function POST(
  request: Request
){

  try{

    const {
      profileId
    } = await request.json();

    const cached =
      await getRecommendationCache(
        profileId
      );

    if(cached){
      return NextResponse.json({
        source:"redis",
        results:cached
      });
    }

const recommendations =
  await getRecommendations(profileId);

console.log(
  "TYPE:",
  typeof recommendations
);

console.log(
  "IS ARRAY:",
  Array.isArray(recommendations)
);

console.log(
  "VALUE:",
  recommendations
);

    await setRecommendationCache(
      profileId,
      recommendations
    );

    return NextResponse.json({
      source:"database",
      results:recommendations
    });

  }catch(error){

    console.log(error);

    return NextResponse.json(
      { error:"Failed" },
      { status:500 }
    );

  }

}