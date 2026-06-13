"use client"
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Row from "@/components/Row";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getMovies } from "@/services/movieService";
import { getFavorites } from "@/services/favoriteService";
import { getCurrentProfile } from "@/lib/getCurrentProfile";
import { getProfileMedia } from "@/services/mediaService";
import { getRecentlyViewed } from "@/services/recentlyViewedService";
import { getContinueWatching } from "@/services/continueWatchingService";
import {supabase} from "../../../lib/supabaseClient";


// import {
//   heroContent,
//   topPicks,
//   memories,
//   favorites,
//   specialMoments,
// } from "@/lib/mockData";

export default function BrowsePage() {


  // const [movies, setMovies]=useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [profileMedia, setProfileMedia] = useState<any[]>([]);
  const [recommendations, setRecommendations]=useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [selectedType, setSelectedType] =
    useState("All");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("Newest");

  const handleSearchResults = useCallback((results: any[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
    if (query.length >= 2) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(()=>{
    const loadRecommendations =
      async () => {

        const profile =
          getCurrentProfile();

        if(!profile) return;

        const response =
          await fetch(
            "/api/recommendations",
            {
              method:"POST",
              headers:{
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({
                profileId: profile.id
              })
            }
          );

        const data =
          await response.json();

        // console.log(
        //   "RECOMMEND SOURCE:",
        //   data.source
        // );

        setRecommendations(
          data.results || []
        );
      };

    loadRecommendations();
  },[])

//   useEffect(() => {

//   const testRecommendations = async () => {

//     const profile = getCurrentProfile();

//     if (!profile) return;

//     const response =
//       await fetch(
//         "/api/recommendations",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             profileId: profile.id,
//           }),
//         }
//       );

//     const data =
//       await response.json();

//     console.log(
//       "RECOMMENDATIONS:",
//       data
//     );
//   };

//   testRecommendations();

// }, []);

  useEffect(() => {

    const loadMedia =
      async () => {

        const profileId = getCurrentProfile();

        if (!profileId) return;

        const { data: { session } } =
          await supabase.auth.getSession();

        const [data, response] = await Promise.all([
          getProfileMedia(profileId.id),
          fetch(
            "/api/recently-viewed",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                profileId: profileId.id,
                accessToken: session?.access_token,
              }),
            }
          )
        ]);

        const recentData = await response.json();

        setRecentlyViewed(recentData);
        setProfileMedia(data);

      };


    loadMedia();

  }, []);

  useEffect(() => {
    const loadContinueWatching =
      async () => {

        const profile =
          getCurrentProfile();

        if (!profile) return;

        const { data:{ session } } = await supabase.auth.getSession();

        const response = await fetch(
            "/api/continue-watching",
            {
              method:"POST",
              headers:{
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({
                profileId: profile.id,
                accessToken:
                  session?.access_token
              })
            }
          );

        const data =
          await response.json();

        setContinueWatching(data);
      };

    loadContinueWatching();

  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const profileId = getCurrentProfile();
      if (!profileId) return;
      const data = await getFavorites(profileId.id);
      setFavorites(data);
    };

    fetchFavorites();

    const handleFavoriteToggle = () => {
      fetchFavorites();
    };

    window.addEventListener("favoriteToggle", handleFavoriteToggle);
    return () => window.removeEventListener("favoriteToggle", handleFavoriteToggle);
  }, []);


  const mediaItems = useMemo(() => {
    return profileMedia.map((item: any) => item.media);
  }, [profileMedia])

  const filteredMedia = useMemo(() => {

    let filtered = [...mediaItems];

    // Media Type Filter
    if (selectedType !== "All") {
      filtered = filtered.filter(
        (item: any) =>
          item.media_type.toLowerCase() ===
          selectedType.toLowerCase()
      );
    }

    // Category Filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (item: any) =>
          item.media_categories?.some(
            (c: any) =>
              c.category?.toLowerCase() === selectedCategory.toLowerCase()
          )
      );
    }

    // Sorting
    switch (sortBy) {

      case "Newest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime()
            -
            new Date(a.created_at).getTime()
        );
        break;

      case "Oldest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime()
            -
            new Date(b.created_at).getTime()
        );
        break;

      case "A-Z":
        filtered.sort(
          (a: any, b: any) =>
            a.title.localeCompare(b.title)
        );
        break;

      case "Z-A":
        filtered.sort(
          (a: any, b: any) =>
            b.title.localeCompare(a.title)
        );
        break;
    }

    return filtered;

  }, [
    mediaItems,
    selectedType,
    selectedCategory,
    sortBy
  ]);

  // console.log(
  //   "Total:",
  //   mediaItems.length,
  //   "Filtered:",
  //   filteredMedia.length,
  //   selectedType,
  //   selectedCategory
  // );

  // console.log(mediaItems[0]);

  const recentMedia = recentlyViewed.map((item: any) => item.media);


  const categories = [
    "Documentary",
    "Sci-Fi",
    "Fantasy",
    "Nature",
    "Adventure",
    "Romance",
    "Thriller",
    "Action",
    "Personal",
    "Special",
  ];

  const categorizedMedia = useMemo(() => {
    return categories.reduce(
      (med: any, category) => {
        med[category] = filteredMedia.filter(
          (m: any) =>
            m.media_categories?.some(
              (c: any) =>
                c.category === category
            )
        );

        return med;
      },
      {}
    )
  }, [filteredMedia]);

  const memories = useMemo(() => {
    return filteredMedia.filter(
      (m: any) =>
        m.media_type === "photo"
    );
  }, [filteredMedia]);


  const videos = useMemo(() => {
    return filteredMedia.filter(
      (m: any) =>
        m.media_type === "video"
    );
  }, [filteredMedia]);

  const movies = useMemo(() => {
    return filteredMedia.filter(
      (m: any) =>
        m.media_type === "movie"
    );
  }, [filteredMedia]);


  // console.log(
  //   "THUMBNAIL:",
  //   mediaItems[0]?.thumbnail_url
  // );
  // console.log(
  // JSON.stringify(
  //   mediaItems[0],
  //   null,
  //   2
  // )

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (mediaItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, 10000); //10seconds
    return () => clearInterval(interval);
  }, [mediaItems.length]);

  useEffect(() => {

    const reload =
      async () => {

        const profile =
          getCurrentProfile();

        if (!profile) return;

        const data =
          await getContinueWatching(
            profile.id
          );

        setContinueWatching(data);
      };

    window.addEventListener(
      "continueWatchingUpdated",
      reload
    );

    return () =>
      window.removeEventListener(
        "continueWatchingUpdated",
        reload
      );

  }, []);

  console.log("PROFILE MEDIA:", profileMedia);
console.log("MEDIA ITEMS:", mediaItems);
console.log("CURRENT INDEX:", currentIndex);


  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar mediaItems={mediaItems} onSearchResults={handleSearchResults} />
        <div className="flex-1 flex flex-col">
          {/* Hero Section */}
          {mediaItems[currentIndex] && searchQuery.length < 2 && (
            <HeroBanner content={mediaItems[currentIndex]} />
          )}

          {/* Content Rows */}
          <div className="-mt-16 sm:-mt-24 relative z-10 pb-16 flex flex-col gap-4 sm:gap-6">

            {/* Filter Bar — hidden during search */}
            {searchQuery.length < 2 && (
              <div className="sticky top-16 mt-20 w-full z-30 px-4 sm:px-6 lg:px-12 pt-2 pb-3">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-2.5 sm:p-3 bg-black/10 backdrop-blur-2xl shadow-xl shadow-black/30">

                  {/* Media Type Pills */}
                  <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-white/[0.04] rounded-md">
                    {["All", "Movie", "Video", "Photo"].map((type) => {
                      const isActive = selectedType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          style={{ padding: "10px" }}
                          className={`
                          px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-250 cursor-pointer whitespace-nowrap
                          ${isActive
                              ? "bg-accent text-white shadow-md shadow-accent/30"
                              : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                            }
                        `}
                        >
                          {type === "All" ? "All Types" : type}
                        </button>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-6 bg-white/10" />

                  {/* Category Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="
                      appearance-none cursor-pointer
                      bg-white/[0.06] hover:bg-white/[0.1]
                      border border-white/[0.08] rounded-md
                      text-xs
                      font-semibold text-white/70
                      focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20
                      transition-all duration-200
                    "
                      style={{
                        padding: "8px",
                        color: selectedCategory !== "All" ? "white" : undefined,
                        borderColor: selectedCategory !== "All" ? "rgba(220,38,38,0.4)" : undefined,
                      }}
                    >
                      <option value="All">Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative w-24">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="
                      appearance-none cursor-pointer w-25
                      bg-white/[0.06] hover:bg-white/[0.1]
                      border border-white/[0.08] rounded-lg
                      text-xs font-semibold text-white/70
                      focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20
                      transition-all duration-200
                    "
                      style={{
                        padding: "8px",
                        color: sortBy !== "Newest" ? "white" : undefined,
                        borderColor: sortBy !== "Newest" ? "rgba(220,38,38,0.4)" : undefined,
                      }}
                    >
                      <option value="Newest">↓ Newest</option>
                      <option value="Oldest">↑ Oldest</option>
                      <option value="A-Z">A → Z</option>
                      <option value="Z-A">Z → A</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>

                  {/* Active filter count + Clear */}
                  {(selectedType !== "All" || selectedCategory !== "All" || sortBy !== "Newest") && (
                    <>
                      <div className="hidden sm:block w-px h-6 bg-white/10" />
                      <button
                        onClick={() => {
                          setSelectedType("All");
                          setSelectedCategory("All");
                          setSortBy("Newest");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                        <span className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500/20 text-[9px] font-bold text-red-400">
                          {[selectedType !== "All", selectedCategory !== "All", sortBy !== "Newest"].filter(Boolean).length}
                        </span>
                      </button>
                    </>
                  )}

                </div>
              </div>
            )}

            {/* Search Results Row */}
            {searchQuery.length >= 2 ? (
              searchResults.length > 0 ? (
                <div style={{ marginTop: "100px" }} className="p-4 sm:p-6 lg:p-8">
                  <Row
                    title={`🔍 Search Results for "${searchQuery}"`}
                    items={searchResults}
                    id="search-results"
                  />
                </div>
              ) : (
                <div style={{ marginTop: "100px" }} className="px-4 sm:px-6 lg:px-12 py-6">
                  <h2 className="text-lg font-bold text-white/90 mb-3">
                    🔍 No results for &ldquo;<span className="text-accent">{searchQuery}</span>&rdquo;
                  </h2>
                  <p className="text-sm text-white/40">
                    Try searching with a different keyword
                  </p>
                </div>
              )
            ) : (
              <>
                {selectedType === "All" && selectedCategory === "All" && recommendations.length > 0 && (

                  <Row
                    title="✨ Recommended For You"
                    items={recommendations}
                    id="recommended"
                  />

                )}

                {selectedType === "All" && selectedCategory === "All" && continueWatching.length > 0 && (
                  <Row
                    title="▶ Continue Watching"
                    items={continueWatching.map(
                      (item: any) => ({
                        ...item.media,
                        progress_seconds: item.progress_seconds,
                        duration_seconds: item.duration_seconds
                      })
                    )}
                    id="continue-watching"
                  />
                )
                }

                {selectedType === "All" && selectedCategory === "All" && favorites.length > 0 && (
                  <Row
                    title="❤️ Favorites"
                    items={favorites.map(
                      (f: any) => f.media
                    )}
                    id="favorites"
                  />
                )}

                {categories.map((category) =>
                  categorizedMedia[category]?.length > 0 ? (
                    <Row
                      key={category}
                      title={`🎬 ${category}`}
                      items={categorizedMedia[category]}
                      id={category.toLowerCase()}
                    />
                  ) : null
                )}

                {/* {movies.length > 0 && (
                  <Row
                    title="🎬 Movies"
                    items={movies}
                    id="movies"
                  />
                )}

                {videos.length > 0 && (
                  <Row
                    title="🎥 Videos"
                    items={videos}
                    id="videos"
                  />
                )} */}

                {/* {memories.length > 0 && (
                  <Row
                    title="📸 Memories"
                    items={memories}
                    id="memories"
                  />
                )} */}

                {selectedType === "All" && selectedCategory === "All" && recentMedia.length > 0 && (
                  <Row
                    title="🕒 Recently Viewed"
                    items={recentMedia}
                    id="recently-viewed"
                  />
                )}

              </>
            )}

          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-12 mt-auto">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-4">
                  Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/browse" className="text-sm text-text-muted hover:text-white transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/profiles" className="text-sm text-text-muted hover:text-white transition-colors">
                      Profiles
                    </a>
                  </li>
                  <li>
                    <a href="/admin" className="text-sm text-text-muted hover:text-white transition-colors">
                      Admin
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-4">
                  Categories
                </h4>
                <ul className="space-y-2">
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Documentary
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Sci-Fi
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Fantasy
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-4">
                  Personal
                </h4>
                <ul className="space-y-2">
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Memories
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Special Moments
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Favorites
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-4">
                  Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Help Center
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Privacy
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer">
                      Terms
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-2xl font-black text-accent">WISH</span>
              <p className="text-xs text-text-muted">
                © 2025 Wish Stream. Your personal streaming universe.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}

