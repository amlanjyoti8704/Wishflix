import { supabase }
from "../../lib/supabaseClient";
import { saveMemory } from "./memoryService";

export const saveProgress =
async (
  profileId:string,
  mediaId:string,
  progress:number,
  duration:number,
  accessToken:string
) => {

  const { error } =
    await supabase
      .from("continue_watching")
      .upsert(
        {
          profile_id:
            profileId,

          media_id:
            mediaId,

          progress_seconds:
            Math.floor(progress),

          duration_seconds:
            Math.floor(duration),

          updated_at:
            new Date()
            .toISOString()
        },
        {
          onConflict:
            "profile_id,media_id"
        }
      );

  if(error){
    console.log(error);
  }
  const { data: media } =
    await supabase
      .from("media")
      .select("title,description")
      .eq("id", mediaId)
      .single();

  if(media){

    await saveMemory(
      profileId,
      "continue_watching",
      `
      User is currently watching:

      ${media.title}

      ${media.description}

      Progress:
      ${Math.round(
        progress / duration * 100
      )}% completed
      `,
      accessToken,
      mediaId
    );
  }
};

export const getContinueWatching =
async (
  profileId:string
) => {

  const { data, error } =
    await supabase
      .from(
        "continue_watching"
      )
      .select(`
        *,
        media (
          *,
          media_categories (
            category
          )
        )
      `)
      .eq(
        "profile_id",
        profileId
      )
      .order(
        "updated_at",
        {
          ascending:false
        }
      );

  if(error){
    console.log(error);
    return [];
  }

  return data;
};

export const getProgress =
async (
  profileId:string,
  mediaId:string
) => {

  const { data } =
    await supabase
      .from("continue_watching")
      .select("*")
      .eq("profile_id", profileId)
      .eq("media_id", mediaId)
      .single();

  return data;
};

export const removeContinueWatching =
async (
  profileId:string,
  mediaId:string
) => {

  await supabase
    .from("continue_watching")
    .delete()
    .eq("profile_id", profileId)
    .eq("media_id", mediaId);
};