import { NextRequest, NextResponse }
from "next/server";

import { createClient, SupabaseClient }
from "@supabase/supabase-js";

import { generateEmbedding }
from "@/services/embeddingService";

let _supabase: SupabaseClient | null = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

export async function POST(
  request: NextRequest
) {

  try {

    const { mediaId } =
      await request.json();

    const supabase = getSupabase();

    const { data: media, error } =
      await supabase
        .from("media")
        .select("*")
        .eq("id", mediaId)
        .single();

    if(error || !media){

      return NextResponse.json(
        { error:"Media not found" },
        { status:404 }
      );

    }

    const { data: categories } =
      await supabase
        .from("media_categories")
        .select("category")
        .eq("media_id", mediaId);

    const categoryText =
      categories
        ?.map(
          c => c.category
        )
        .join(", ") || "";

    const text = `
      Title:
      ${media.title}

      Description:
      ${media.description}

      Type:
      ${media.media_type}

      Categories:
      ${categoryText}
    `;

    const embedding =
      await generateEmbedding(
        text
      );

    await supabase
      .from("media")
      .update({
        embedding
      })
      .eq(
        "id",
        mediaId
      );

    return NextResponse.json({
      success:true
    });

  } catch(err){

    console.error(err);

    return NextResponse.json(
      { error:"Failed" },
      { status:500 }
    );

  }

}