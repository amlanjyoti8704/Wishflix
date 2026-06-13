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
console.log("PROFILE QUERY RESULT:", data);
console.log("PROFILE QUERY ERROR:", error);

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

export const getMediaByUser = async (
  userId: string
) => {

  // Step 1: Get all profiles belonging to user
  const {
    data: profiles,
    error: profilesError
  } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId);

  if (profilesError) {
    console.log(profilesError);
    return [];
  }

  if (!profiles?.length) {
    return [];
  }

  const profileIds =
    profiles.map(
      (profile) => profile.id
    );

    console.log("Profiles:", profiles);
console.log("Profile IDs:", profileIds);

  // Step 2: Get media assigned to those profiles
  const {
    data,
    error
  } = await supabase
    .from("media_profiles")
    .select(`
      media (
        *,
        media_categories (
          category
        )
      )
    `)
    .in(
      "profile_id",
      profileIds
    );
    console.log("Media Profiles Query:", data);
console.log("Media Profiles Error:", error);

  if (error) {
    console.log(error);
    return [];
  }

  // Step 3: Deduplicate and return plain media array
  const mediaMap = new Map();
  data.forEach((item: any) => {
    if (item.media && !mediaMap.has(item.media.id)) {
      mediaMap.set(item.media.id, item.media);
    }
  });
  return Array.from(mediaMap.values());
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

  const recentRes =
    await supabase
      .from("recently_viewed")
      .delete()
      .eq("media_id", mediaId);

  console.log("RECENT DELETE", recentRes.error);

  const continueRes =
    await supabase
      .from("continue_watching")
      .delete()
      .eq("media_id", mediaId);

  console.log("CONTINUE DELETE", continueRes.error);

  const memoryRes =
    await supabase
      .from("memory_embeddings")
      .delete()
      .eq("media_id", mediaId);

  console.log("MEMORY DELETE", memoryRes.error);

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