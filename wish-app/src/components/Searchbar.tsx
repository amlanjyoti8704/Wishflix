"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { searchMemories } from "@/services/aiSearchService";

interface SearchbarProps {
  mediaItems: any[];
  onSearchResults?: (results: any[], query: string) => void;
}

export default function Searchbar({ mediaItems, onSearchResults }: SearchbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [resultCount, setResultCount]=useState(0);
  const [aiMode, setAiMode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and emit results
  useEffect(() => {

    const runSearch=async()=>{
        if (debouncedQuery.length < 2) {
        onSearchResults?.([], "");
        return;
        }

    const filtered =
        aiMode
            ? searchMemories(
                debouncedQuery,
                mediaItems
            )
            : mediaItems.filter((media:any) => {

                const query =
                debouncedQuery
                    .toLowerCase();

                const titleMatch =
                media.title
                    ?.toLowerCase()
                    .includes(query);

                const descriptionMatch =
                media.description
                    ?.toLowerCase()
                    .includes(query);

                const categoryMatch =
                media.media_categories
                    ?.some(
                    (c:any) =>
                        c.category
                        .toLowerCase()
                        .includes(query)
                    );

                const typeMatch =
                media.media_type
                    ?.toLowerCase()
                    .includes(query);

                return (
                titleMatch ||
                descriptionMatch ||
                categoryMatch ||
                typeMatch
                );
            });

    setResultCount(filtered.length);

    onSearchResults?.(filtered, debouncedQuery);
    }
    runSearch();

  }, [debouncedQuery, mediaItems, onSearchResults, aiMode]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    },
    []
  );

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Search Toggle Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isOpen) {
            setSearchQuery("");
          }
        }}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
        aria-label="Toggle search"
      >
        <svg
          className="w-[18px] h-[18px] text-white/80 hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>

      {/* Expandable Search Input */}
      <div
        className={`
          overflow-hidden transition-all duration-400 ease-out
          ${isOpen ? "w-52 sm:w-64 md:w-72 opacity-100 ml-1" : "w-0 opacity-0 ml-0"}
        `}
      >
        <div className="relative flex items-center gap-1">
            <button
                onClick={() =>
                    setAiMode(!aiMode)
                }
                style={{padding:"10px"}}
                className="
                    text-md
                    px-2
                    py-1
                    rounded-md
                    transition-all
                    duration-300
                    bg-transparent
                    cursor-pointer
                    hover:border-white/60
                    hover:bg-white/20
                "
            >
                {aiMode
                    ? "✨"
                    : "N"}
            </button>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="  Titles, genres, descriptions…"
            className="
              w-full pl-3 pr-8 py-[7px]
              bg-black/10 backdrop-blur-sm
              border border-white/20 rounded-lg
              text-sm text-white placeholder:text-white/40
              focus:outline-none focus:border-gray-500/60 focus:ring-1 focus:ring-gray-500/20
              transition-all duration-300
            "
            style={{
                padding:"10px"
            }}
          />
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg
                className="w-3 h-3 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Inline result count badge */}
      {isOpen && debouncedQuery.length >= 2 && (
        <span className="ml-2 text-[11px] font-medium text-white/40 whitespace-nowrap animate-fade-in">
          {resultCount}{" "}
          found
        </span>
      )}
    </div>
  );
}