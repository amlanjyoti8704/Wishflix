export const getCurrentProfile =
() => {

  if (
    typeof window ===
    "undefined"
  ) return null;

  return localStorage.getItem(
    "selectedProfile"
  );
};