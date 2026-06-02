"use client"  
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Row from "@/components/Row";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import {getMovies} from "@/services/movieService";
import { getFavorites } from "@/services/favoriteService";
import { getCurrentProfile } from "@/lib/getCurrentProfile";
import { getProfileMedia} from "@/services/mediaService";

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
  const [profileMedia, setProfileMedia] =
  useState<any[]>([]);

  useEffect(() => {

    const loadMedia =
      async () => {

        const profileId = getCurrentProfile();
        console.log("CURRENT PROFILE", profileId);
        console.log("PROFILE ID", profileId?.id);

        if (!profileId) return;

        const data =
          await getProfileMedia(
            profileId.id
          );

        setProfileMedia(data);

      };

    loadMedia();
    

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
  

  const mediaItems=profileMedia.map((item:any)=>item.media);


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

  const categorizedMedia = categories.reduce(
    (med: any, category) => {
      med[category] = mediaItems.filter(
        (m: any) =>
          m.media_categories?.some(
            (c: any) =>
              c.category === category
          )
      );

      return med;
    },
    {}
  );

  const memories =
    mediaItems.filter(
      (m:any) =>
        m.media_type === "photo"
    );


  const videos =
    mediaItems.filter(
      (m:any) =>
        m.media_type === "video"
    );

  const movies =
    mediaItems.filter(
      (m:any) =>
        m.media_type === "movie"
    );

  console.log(
    "THUMBNAIL:",
    mediaItems[0]?.thumbnail_url
  );
  console.log(
  JSON.stringify(
    mediaItems[0],
    null,
    2
  )
);

  const [currentIndex, setCurrentIndex]=useState(0);

  useEffect(()=>{
    if(mediaItems.length===0) return;
    const interval=setInterval(()=>{
      setCurrentIndex((prev)=>(prev+1)%mediaItems.length);
    },10000); //10seconds
    return ()=>clearInterval(interval);
  },[mediaItems.length]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />

        <div className="flex-1 flex flex-col">
          {/* Hero Section */}
          {mediaItems.length>0 && (
            <HeroBanner  content={mediaItems[currentIndex]} />  
          )}

          {/* Content Rws */}
          <div className="-mt-16 sm:-mt-24 relative z-10 pb-16 flex flex-col gap-4 sm:gap-6">
          {/* <Row title="Top Picks for You" items={movies} id="top-picks" />
          <Row title="Memories" items={movies} id="memories" />
          <Row
            title="✨ Special Moments"
            items={movies}
            id="special-moments"
            accent
          />
          <Row title="Favorites" items={favorites.map((f:any)=>f.movies)} id="my-list" />
          <Row title="Continue Watching" items={[...movies].reverse()} id="continue-watching" />
          <Row title="Recently Added" items={[...movies].reverse()} id="recently-added" /> */}

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

          {movies.length > 0 && (
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
          )}

          {memories.length > 0 && (
            <Row
              title="📸 Memories"
              items={memories}
              id="memories"
            />
          )}

          {favorites.length > 0 && (
            <Row
              title="❤️ Favorites"
              items={favorites.map(
                (f:any)=>f.media
              )}
              id="favorites"
            />
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
