import { supabase }from "../../lib/supabaseClient";

export const getMovies =
async () => {

  const { data, error } =
    await supabase
      .from("movies")
      .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};