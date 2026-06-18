const STORAGE_KEY = "wishflix_search_history";

export const saveSearch = (
  query: string
) => {

  if (!query.trim()) return;

  const existing =
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) || "[]"
    );

  const updated = [
    query,
    ...existing.filter(
      (item: string) =>
        item !== query
    )
  ].slice(0, 10);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};

export const getSearchHistory =
() => {

  return JSON.parse(
    localStorage.getItem(
      STORAGE_KEY
    ) || "[]"
  );
};

export const clearSearchHistory =
() => {

  localStorage.removeItem(
    STORAGE_KEY
  );
};

export const removeFromHistory =
  (query: string) => {

    const existing = getSearchHistory();
    const updated = existing.filter(
      (item: string) =>
        item !== query
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  };