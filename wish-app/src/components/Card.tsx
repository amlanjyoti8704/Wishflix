"use client";

import Image from "next/image";
import { ContentItem } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentProfile } from "@/lib/getCurrentProfile";
import { addFavorite, removeFavorite, isFavorite } from "@/services/favoriteService";


interface CardProps {
  content: any;
  index?: number;
}

export default function Card({ content, index = 0 }: CardProps) {
  const [liked, setLiked] = useState(false);
  const router=useRouter();

  useEffect(() => {
    const checkFavorite = async () => {
      const profile = getCurrentProfile();
      if (!profile || !content?.id) return;
      const favoriteStatus = await isFavorite(profile.id, content.id);
      setLiked(favoriteStatus);
    };
    checkFavorite();
  }, [content.id]);

  useEffect(() => {
    const handleFavoriteToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.mediaId === content.id) {
        setLiked(customEvent.detail.isFavorite);
      }
    };
    window.addEventListener("favoriteToggle", handleFavoriteToggle);
    return () => window.removeEventListener("favoriteToggle", handleFavoriteToggle);
  }, [content.id]);

  console.log(content.thumbnail_url);
  return (
    <div
      className="group relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 75}ms` }}
      id={`card-${content.id}`}
      onClick={() =>
        router.push(`/media/${content.id}`)
      }
    >
      {/* Card Container */}
      <div className="absolute left-3 right-3 h-full overflow-hidden rounded-lg sm:rounded-xl transition-all duration-500 ease-out group-hover:scale-105 group-hover:z-20 group-hover:shadow-2xl group-hover:shadow-accent/10">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 240px, 280px"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          <button
            className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-black/45 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90"
            onClick={async (e) => {
              e.stopPropagation();

              const profile = getCurrentProfile();
              if (!profile) return;

              if (liked) {
                await removeFavorite(profile.id, content.id);
                setLiked(false);
                window.dispatchEvent(new CustomEvent("favoriteToggle", { 
                  detail: { mediaId: content.id, isFavorite: false } 
                }));
              } else {
                await addFavorite(profile.id, content.id);
                setLiked(true);
                window.dispatchEvent(new CustomEvent("favoriteToggle", { 
                  detail: { mediaId: content.id, isFavorite: true } 
                }));
              }
            }}
          >
            <svg 
              className={`w-4 h-4 transition-all duration-300 ${liked ? 'text-red-500 fill-red-500 scale-110' : 'text-white/70 hover:text-white fill-none'}`} 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {/* Rating Badge */}
          {/* {content.rating && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {content.rating}
            </div>
          )} */}

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
              {content.created_at && (
                <span className="text-[11px] text-text-muted">
                  {new Date(content.created_at)
                    .toLocaleDateString()}
                </span>
              )}
              {/* {content.duration && (
                <span className="text-[11px] text-text-muted">
                  {content.duration}
                </span>
              )} */}
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
