import { saveMemory } from "@/services/memoryService";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    const { 
        profileId,
        content,
        type,
        accessToken,
        mediaId
    } =
        await request.json();

    console.log("API MEMORY SAVE CALLED");

    const response=await saveMemory(
        profileId,
        type,
        content,
        accessToken,
        mediaId
    );

    return NextResponse.json({
        response
    })
}