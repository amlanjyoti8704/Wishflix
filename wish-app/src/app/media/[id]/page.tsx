"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getMediaById, getProfileMedia } from "@/services/mediaService";
import { useParams, useRouter } from "next/navigation";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/services/favoriteService";
import { getCurrentProfile } from "@/lib/getCurrentProfile";

export default function MediaPage() {
  const router = useRouter();
  const params = useParams();
  const [media, setMedia] = useState<any>(null);
  const [allMedia, setAllMedia]=useState<any[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [favorite, setFavorite]=useState(false);

  const currentIndex =
    allMedia.findIndex(
      m => m.id === media?.id
    );

  const goNext = () => {
    if (
        currentIndex === -1 ||
        currentIndex ===
        allMedia.length - 1
    ) return;

    router.push(
        `/media/${
        allMedia[
            currentIndex + 1
        ].id
        }`
    );
    };

  const goPrevious = () => {
    if (
        currentIndex <= 0
    ) return;

    router.push(
        `/media/${
        allMedia[
            currentIndex - 1
        ].id
        }`
    );
  };

  useEffect(() => {
    const handleKeyDown =
        (
        e: KeyboardEvent
        ) => {

        if (
            e.key ===
            "ArrowRight"
        ) {
            goNext();
        }

        if (
            e.key ===
            "ArrowLeft"
        ) {
            goPrevious();
        }

        if (
            e.key ===
            "Escape"
        ) {
            router.push(
            "/browse"
            );
        }
        };

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    return () =>
        window.removeEventListener(
        "keydown",
        handleKeyDown
    );
    }, [currentIndex, allMedia]);

  useEffect(() => {
    const loadFavorite =
        async () => {

        const profile =
            getCurrentProfile();

        if (!profile || !media)
            return;

        const result =
            await isFavorite(
            profile.id,
            media.id
            );

        setFavorite(result);
        };

    loadFavorite();

  }, [media]);

    useEffect(() => {

    const loadData =
        async () => {

        const mediaData =
            await getMediaById(
            params.id as string
            );

        setMedia(mediaData);

        const profile =
            getCurrentProfile();

        if (!profile) return;

        const profileMedia =
            await getProfileMedia(
            profile.id
            );

        const mediaList =
            profileMedia.map(
            (item:any) => item.media
            );

        setAllMedia(mediaList);
        };

    loadData();

    }, [params.id]);

  const resetInactivityTimer = useCallback(() => {
    setShowOverlay(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 3500);
  }, []);

  useEffect(() => {
    resetInactivityTimer();

    const handleActivity = () => resetInactivityTimer();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer]);

  if (!media) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-accent animate-spin mb-4" />
        <p className="text-xs text-text-muted uppercase tracking-[0.3em] animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  const isVideo = media.media_type === "video" || media.media_type === "movie";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 select-none"
      style={{ cursor: showOverlay ? "default" : "none" }}
    >
      {/* Fullscreen Media */}
      {isVideo ? (
        <video
          controls={showOverlay}
          autoPlay
          className="absolute inset-0 w-full h-full object-contain bg-black"
        >
          <source src={media.media_url} />
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
          <img
            src={media.media_url}
            alt={media.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Top Gradient Overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{ opacity: showOverlay ? 1 : 0 }}
      />

      {/* Bottom Gradient Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{ opacity: showOverlay ? 1 : 0 }}
      />

      {/* Navigation Buttons */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{ opacity: showOverlay ? 1 : 0 }}
      >
        <button
          onClick={goPrevious}
          disabled={currentIndex <= 0}
          className="pointer-events-auto absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-90 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === allMedia.length - 1}
          className="pointer-events-auto absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-90 disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Top Bar: Back Button + Mode Badge */}
      <div
        className="absolute top-5 left-3 right-0 z-20 flex items-center justify-between p-5 sm:p-8 transition-all duration-700 ease-in-out"
        style={{
          opacity: showOverlay ? 1 : 0,
          transform: showOverlay ? "translateY(0)" : "translateY(-20px)",
          pointerEvents: showOverlay ? "auto" : "none",
        }}
      >
        <button
          onClick={() => router.push("/browse")}
          className="flex items-center gap-2 px-4 py-2.5 text-white text-xl font-semibold transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-semibold tracking-wider uppercase backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {media.media_type === "movie" ? "Theater" : media.media_type === "video" ? "Stream" : "Gallery"}
        </div>
      </div>

      {/* Top Center Info Overlay */}
      <div
        className="absolute top-0 left-0 right-0 p-6 sm:p-10 flex justify-center transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: showOverlay ? 1 : 0,
          transform: showOverlay ? "translateY(0)" : "translateY(-30px)",
        }}
      >
        <div 
          className="w-full text-center mt-16 sm:mt-12 bg-black/20 p-5 sm:p-6 rounded-2xl shadow-2xl"
          style={{
            pointerEvents: showOverlay ? "auto" : "none",
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-2.5">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-accent text-white rounded">
              {media.media_type}
            </span>
            {media.created_at && (
              <span className="text-xs text-white/50">
                {new Date(media.created_at).toLocaleDateString()}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
            {media.title}
          </h1>

          <button
            onClick={async () => {
                const profile = getCurrentProfile();
                console.log("MEDIA ID", media?.id);
                console.log("PROFILE ID", profile?.id);

                if (!profile) return;

                if (favorite) {
                  await removeFavorite(profile.id, media.id);
                  setFavorite(false);
                  window.dispatchEvent(new CustomEvent("favoriteToggle", { 
                    detail: { mediaId: media.id, isFavorite: false } 
                  }));
                } else {
                  const { error } = await addFavorite(profile.id, media.id);
                  if (!error) {
                    setFavorite(true);
                    window.dispatchEvent(new CustomEvent("favoriteToggle", { 
                      detail: { mediaId: media.id, isFavorite: true } 
                    }));
                  }
                }
            }}
            className="px-4 py-2 mb-4 text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-colors"
            >
            {favorite
                ? "❤️"
                : "♡"}
            </button>

          {media.description && (
            <p style={{margin:"auto"}} className="text-xs text-center sm:text-sm text-white/70 leading-relaxed max-w-xl mx-auto line-clamp-3">
              {media.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}