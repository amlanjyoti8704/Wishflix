export const getCurrentProfile = () => {
  if (typeof window === "undefined")
    return null;

  const profile =
    localStorage.getItem(
      "selectedProfile"
    );

  if (!profile)
    return null;

  return JSON.parse(profile);
};