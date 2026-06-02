"use client";

import Image from "next/image";
import { ContentItem } from "@/lib/mockData";
import { useRouter } from "next/navigation";

interface HeroBannerProps {
  content: any;
}

export default function HeroBanner({ content }: HeroBannerProps) {
  const router=useRouter();
  console.log(content.thumbnail_url);
  return (
    <section
      className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden"
      id="hero-banner"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.thumbnail_url}
          alt={content.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/30" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg-primary to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="absolute max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full left-5 right-5">
          <div className="max-w-xl lg:max-w-2xl animate-slide-up">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content.category}
              </span>
              {content.year && (
                <span className="text-text-muted text-sm">{content.year}</span>
              )}
              {content.rating && (
                <span className="px-2 py-0.5 rounded border border-text-muted/30 text-text-muted text-xs">
                  {content.rating}
                </span>
              )}
              {content.duration && (
                <span className="text-text-muted text-sm">{content.duration}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
              {content.title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-4xl">
              {content.description}
            </p>

              <div className="h-10"></div>
            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/media/${content.id}`)}
                className="relative group flex items-center w-[10vw] h-8 gap-3 px-7 sm:px-9 py-3.5 sm:py-4 
                bg-white text-black font-semibold rounded text-sm sm:text-base 
                transition-all duration-300 
                hover:scale-105 active:scale-95
                shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-white/10
                overflow-hidden"
                id="hero-play-btn"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {/* Icon */}
                <div className="flex items-center justify-center w-6 h-6 rounded-r-full bg-black/10 group-hover:bg-black/20 transition">
                  <svg
                    className="w-full h-full translate-x-[1px] group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Text */}
                <span className="tracking-wide">Play Now</span>
              </button>

              <button
                className="relative group flex items-center w-[10vw] h-8 gap-3 px-7 sm:px-9 py-3.5 sm:py-4 
                bg-white/10 backdrop-blur-md text-white font-medium rounded text-sm sm:text-base 
                transition-all duration-300 
                hover:bg-white/20 hover:scale-105 active:scale-95
                border border-white/10 hover:border-white/20
                shadow-md shadow-black/20 hover:shadow-lg hover:shadow-white/10
                overflow-hidden"
                id="hero-info-btn"
              >
                {/* Subtle shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {/* Icon container */}
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 transition">
                  <svg
                    className="w-full h-full group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {/* Text */}
                <span className="relative tracking-wide">More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
