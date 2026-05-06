import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Row from "@/components/Row";
import {
  heroContent,
  topPicks,
  memories,
  favorites,
  specialMoments,
} from "@/lib/mockData";

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero Section */}
      <HeroBanner content={heroContent} />

      {/* Content Rows */}
      <div className="-mt-16 sm:-mt-24 relative z-10 pb-16 flex flex-col gap-4 sm:gap-6">
        <Row title="Top Picks for You" items={topPicks} id="top-picks" />
        <Row title="Memories" items={memories} id="memories" />
        <Row
          title="✨ Special Moments"
          items={specialMoments}
          id="special-moments"
          accent
        />
        <Row title="Favorites" items={favorites} id="my-list" />
        <Row title="Continue Watching" items={[...topPicks].reverse()} id="continue-watching" />
        <Row title="Recently Added" items={[...favorites].reverse()} id="recently-added" />
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
  );
}
