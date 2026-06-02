import { supabase } from "../../lib/supabaseClient";

// export const addFavorite = async (
//   profileId: string,
//   mediaId: string
// ) => {
//   const { error } = await supabase
//     .from("favorites")
//     .insert({
//       profile_id: profileId,
//       media_id: mediaId,
//     });

//   if (error) {
//     console.log(error);
//   }
// };

export const addFavorite = async (
  profileId: string,
  mediaId: string
) => {

  const { data, error } =
    await supabase
      .from("favorites")
      .insert({
        profile_id: profileId,
        media_id: mediaId,
      })
      .select();

  console.log("ADD FAVORITE DATA:", data);
  console.log("ADD FAVORITE ERROR:", error);

  return { data, error };
};

export const removeFavorite = async (
  profileId: string,
  mediaId: string
) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("profile_id", profileId)
    .eq("media_id", mediaId);

  if (error) {
    console.log(error);
  }
};

export const getFavorites = async (
  profileId: string
) => {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      media_id,
      media (*)
    `)
    .eq("profile_id", profileId);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const isFavorite = async (
  profileId: string,
  mediaId: string
) => {

  const { data } =
    await supabase
      .from("favorites")
      .select("id")
      .eq("profile_id", profileId)
      .eq("media_id", mediaId)
      .maybeSingle();

  return !!data;
};