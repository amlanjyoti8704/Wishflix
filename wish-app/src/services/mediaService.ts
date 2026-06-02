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

