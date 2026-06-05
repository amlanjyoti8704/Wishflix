const synonymMap: Record<string, string[]> = {
  birthday: ["cake", "party", "celebration"],
  family: ["parents", "mom", "dad", "brother", "sister"],
  vacation: ["trip", "travel", "journey"],
  memories: ["photo", "photos", "video", "videos"],
  college: ["campus", "university"],
  nature: ["forest", "mountain", "lake", "river"],
};



export const searchMemories = (
  query: string,
  mediaItems: any[]
) => {

    const searchTerms =
        query
            .toLowerCase()
            .split(" ")
            .filter(Boolean);

    const expandedTerms = new Set<string>();

    searchTerms.forEach(term => {
    expandedTerms.add(term);

    synonymMap[term]?.forEach(
        synonym => expandedTerms.add(synonym)
    );
    });

  return mediaItems
    .map((media) => {

      let score = 0;
      let reasons:string[] = [];

      const title =
        media.title?.toLowerCase() || "";

      const description =
        media.description?.toLowerCase() || "";

      const categories =
        media.media_categories
          ?.map((c: any) =>
            c.category.toLowerCase()
          )
          .join(" ") || "";

      expandedTerms.forEach(term => {

        if(title.includes(term)){
            score += 5;
            reasons.push(`Title matched "${term}"`);
        }

        if(description.includes(term)){
          score += 3;
          reasons.push(`Description matched "${term}"`);
        }

        if(categories.includes(term)){
          score += 4;
          reasons.push(`Category matched "${term}"`);
        }

      });

      return {
        ...media,
        score,
        reasons
      };

    })
    .filter(
      media => media.score > 0
    )
    .sort(
      (a,b) =>
        b.score - a.score
    );
};


export const getSuggestions = (
  query: string
) => {

  const suggestions = [
    "birthday celebration",
    "family vacation",
    "college memories",
    "nature videos",
    "trip with friends",
    "special moments",
    "romantic memories"
  ];

  if (!query) {
    return suggestions.slice(0, 5);
  }

  return suggestions.filter(
    item =>
      item
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
  );
};