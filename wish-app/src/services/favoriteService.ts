import { supabase } from "../../lib/supabaseClient"

export const addFavorite =
async (
  profileId: string,
  movieId: string
) => {

  const { error } =
    await supabase
      .from("favorites")
      .insert({
        profile_id: profileId,
        movie_id: movieId,
      });

  console.log(error);
};

export const getFavorites =
async (
  profileId: string
) => {

  const { data, error } =
    await supabase
      .from("favorites")
      .select(`
        movie_id,
        movies (*)
      `)
      .eq(
        "profile_id",
        profileId
      );

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};