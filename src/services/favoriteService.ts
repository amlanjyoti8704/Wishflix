import { supabase } from "../../lib/supabaseClient";
import { deleteMemory, saveMemory } from "./memoryService";
import { clearRecommendationCache } from "./recommendationCacheService";

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
  mediaId: string,
  accessToken: string
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

  if(!error){
    const { data: media } =
    await supabase
      .from("media")
      .select("title,description")
      .eq("id", mediaId)
      .single();

    await saveMemory(
      profileId,
      "favorite",
      `
      User marked this as favorite:

      ${media?.title}

      ${media?.description}
      `,
      accessToken,
      mediaId
    );
  }

  return { data, error };
};

export const removeFavorite = async (
  profileId: string,
  mediaId: string,
  accessToken:string
) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("profile_id", profileId)
    .eq("media_id", mediaId);

  await deleteMemory(profileId,mediaId,accessToken);

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