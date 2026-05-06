"use client";

import Image from "next/image";
import { ContentItem } from "@/lib/mockData";

interface CardProps {
  content: ContentItem;
  index?: number;
}

export default function Card({ content, index = 0 }: CardProps) {
  return (
    <div
      className="group relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 75}ms` }}
      id={`card-${content.id}`}
    >
      {/* Card Container */}
      <div className="absolute left-3 right-3 h-full overflow-hidden rounded-lg sm:rounded-xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:z-20 group-hover:shadow-2xl group-hover:shadow-accent/10">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px, 280px"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Rating Badge */}
          {content.rating && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {content.rating}
            </div>
          )}

          {/* Play icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-500">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Content Info (appears on hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate">
              {content.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {content.year && (
                <span className="text-[11px] text-text-muted">{content.year}</span>
              )}
              {content.duration && (
                <span className="text-[11px] text-text-muted">
                  {content.duration}
                </span>
              )}
              {content.category && (
                <span className="text-[11px] text-accent font-medium">
                  {content.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
