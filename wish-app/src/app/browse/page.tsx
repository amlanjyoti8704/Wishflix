"use client"  
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Row from "@/components/Row";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import {getMovies} from "@/services/movieService";
import { getFavorites } from "@/services/favoriteService";
import { getCurrentProfile } from "@/lib/getCurrentProfile";

  // import {
//   heroContent,
//   topPicks,
//   memories,
//   favorites,
//   specialMoments,
// } from "@/lib/mockData";

export default function BrowsePage() {

  const [movies, setMovies]=useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {

    const fetchFavorites =
    async () => {

      const profileId =
        getCurrentProfile();

      if (!profileId) return;

      const data = await getFavorites(profileId);

      setFavorites(data);
    };

    fetchFavorites();

  }, []);
  
  useEffect(()=>{
    const fetchMovies=async()=>{
      const data=await getMovies();
      setMovies(data);
    };
    fetchMovies();
  },[])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary">
        <Navbar />

        {/* Hero Section */}
        {movies.length>0 && (
        <HeroBanner content={movies[0]} />
        )}

        {/* Content Rows */}
        <div className="-mt-16 sm:-mt-24 relative z-10 pb-16 flex flex-col gap-4 sm:gap-6">
          <Row title="Top Picks for You" items={movies} id="top-picks" />
          <Row title="Memories" items={movies} id="memories" />
          <Row
            title="✨ Special Moments"
            items={movies}
            id="special-moments"
            accent
          />
          <Row title="Favorites" items={favorites.map((f:any)=>f.movies)} id="my-list" />
          <Row title="Continue Watching" items={[...movies].reverse()} id="continue-watching" />
          <Row title="Recently Added" items={[...movies].reverse()} id="recently-added" />
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-12">
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
