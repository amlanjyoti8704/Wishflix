"use client";

import Image from "next/image";
import { ContentItem } from "@/lib/mockData";

interface HeroBannerProps {
  content: ContentItem;
}

export default function HeroBanner({ content }: HeroBannerProps) {
  return (
    <section
      className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden"
      id="hero-banner"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.image}
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
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
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              {content.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-bg-primary font-bold rounded-lg text-sm sm:text-base transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-xl hover:shadow-white/10 active:scale-95"
                id="hero-play-btn"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>
              <button
                className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-lg text-sm sm:text-base transition-all duration-300 hover:bg-white/25 hover:scale-105 border border-white/10 hover:border-white/20 active:scale-95"
                id="hero-info-btn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
