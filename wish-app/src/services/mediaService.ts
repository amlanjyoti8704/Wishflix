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
        media (*)
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