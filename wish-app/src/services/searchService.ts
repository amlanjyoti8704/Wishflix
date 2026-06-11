import { createAuthenticatedClient }from "../../lib/serverSupabase";

export async function searchMedia(
  profileId: string,
  query: string,
  accessToken: any
) {

  const supabase =
    createAuthenticatedClient(accessToken);

  const normalized =
    query.trim();

  const { data, error } =
    await supabase
      .from("media_profiles")
      .select(`
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
      );

  if(error){
    console.log(error);
    return [];
  }

  return data
    .map((item:any) => item.media)
    .filter((media:any) => {

      const q =
        normalized.toLowerCase();

      return (

        media.title
          ?.toLowerCase()
          .includes(q)

        ||

        media.description
          ?.toLowerCase()
          .includes(q)

        ||

        media.media_type
          ?.toLowerCase()
          .includes(q)

        ||

        media.media_categories?.some(
          (c:any) =>
            c.category
              .toLowerCase()
              .includes(q)
        )

      );

    });

}