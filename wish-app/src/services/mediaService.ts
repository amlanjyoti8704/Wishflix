import { supabase } from "../../lib/supabaseClient";

export const getProfileMedia = async (
  profileId: string
) => {

  console.log(
    "FETCHING MEDIA FOR",
    profileId
  );

  const { data, error } =
    await supabase
      .from("media_profiles")
      .select(`
        media (*,
          media_categories (
            category
          ) 
        )
      `)
      .eq(
        "profile_id",
        profileId
      );

  console.log("DATA", data);
  console.log("ERROR", error);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const getMediaById = async (mediaId: string) => {

  const { data, error } =
    await supabase
      .from("media")
      .select("*")
      .eq("id", mediaId)
      .single();

  if(error){
    console.log(error);
    return null;
  }

  return data;
};


export const getAllMedia =
async () => {

  const { data, error } =
    await supabase
      .from("media")
      .select("*")
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const deleteMedia = async (
  mediaId: string
) => {

  console.log("DELETING", mediaId);

  const favRes =
    await supabase
      .from("favorites")
      .delete()
      .eq("media_id", mediaId);

  console.log("FAV DELETE", favRes.error);

  const profileRes =
    await supabase
      .from("media_profiles")
      .delete()
      .eq("media_id", mediaId);

  console.log("PROFILE DELETE", profileRes.error);

  const categoryRes =
    await supabase
      .from("media_categories")
      .delete()
      .eq("media_id", mediaId);

  console.log("CATEGORY DELETE", categoryRes.error);

  const mediaRes =
    await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

  console.log("MEDIA DELETE", mediaRes.error);

  return mediaRes.error;
};


export const updateMedia =
async (
  mediaId: string,
  updates: any
) => {

  const { data, error } =
    await supabase
      .from("media")
      .update(updates)
      .eq("id", mediaId)
      .select()
      .single();

  return {
    data,
    error,
  };
};