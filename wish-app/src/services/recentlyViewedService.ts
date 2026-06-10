import { supabase }
from "../../lib/supabaseClient";

export const addRecentlyViewed =
async (
  profileId: string,
  mediaId: string
) => {

  const { error } =
    await supabase
      .from("recently_viewed")
      .upsert(
        {
          profile_id: profileId,
          media_id: mediaId,
          viewed_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "profile_id,media_id",
        }
      );
    

  if(error){
    console.log(error);
    return false;
  }

  return true;
};

export const getRecentlyViewed =
async (
  profileId:string
) => {

  const { data, error } =
    await supabase
      .from("recently_viewed")
      .select(`
        viewed_at,
        media (*,
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
        "viewed_at",
        {
          ascending:false
        }
      )
      .limit(20);

  if(error){
    console.log(error);
    return [];
  }

  return data;
};