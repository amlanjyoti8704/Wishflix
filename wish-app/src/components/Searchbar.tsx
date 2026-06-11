"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { searchMemories, getSuggestions } from "@/services/aiSearchService";
import { saveSearch,getSearchHistory,clearSearchHistory, removeFromHistory } from "@/services/searchHistoryService";
import { semanticSearch } from "@/services/semanticSearchService";
import { getCurrentProfile } from "@/lib/getCurrentProfile";
import { supabase } from "../../lib/supabaseClient";

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
  const [history, setHistory]= useState<string[]>([])
  const [suggestions, setSuggestions]= useState<string[]>([])
  

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // save history for search
  useEffect(() => {

    setHistory(
      getSearchHistory()
    );

  }, []);

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

  // get AI Suggestions based on query
  useEffect(() => {
    setSuggestions(
      getSuggestions(
        searchQuery
      )
    );

  }, [searchQuery]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and emit results
  useEffect(() => {

    const runSearch=async()=>{
        if (debouncedQuery.length < 3) {
        setHistory(getSearchHistory());
        onSearchResults?.([], "");
        return;
        }

        // const filtered =
        //     aiMode
        //         ? await semanticSearch(
        //             debouncedQuery,
        //             getCurrentProfile().id
        //         )
        //         : mediaItems.filter((media:any) => {

        //             const query =
        //             debouncedQuery
        //                 .toLowerCase();

        //             const titleMatch =
        //             media.title
        //                 ?.toLowerCase()
        //                 .includes(query);

        //             const descriptionMatch =
        //             media.description
        //                 ?.toLowerCase()
        //                 .includes(query);

        //             const categoryMatch =
        //             media.media_categories
        //                 ?.some(
        //                 (c:any) =>
        //                     c.category
        //                     .toLowerCase()
        //                     .includes(query)
        //                 );

        //             const typeMatch =
        //             media.media_type
        //                 ?.toLowerCase()
        //                 .includes(query);

        //             return (
        //             titleMatch ||
        //             descriptionMatch ||
        //             categoryMatch ||
        //             typeMatch
        //             );
        //         });

        let filtered;
        const profile=getCurrentProfile();
        if (!profile) return;
        const { data:{ session } } = await supabase.auth.getSession();
        
        if (aiMode) {

          // filtered =
          //   await semanticSearch(
          //     debouncedQuery,
          //     profile.id
          //   );

          const response =
            await fetch(
              "/api/semantic-search",
              {
                method:"POST",
                headers:{
                  "Content-Type":
                    "application/json"
                },
                body:JSON.stringify({
                  profileId:
                    profile.id,
                  query:
                    debouncedQuery
                })
              }
            );

          const data =
            await response.json();

          console.log(
            "AI SEARCH SOURCE:",
            data.source
          );

          filtered =
            data.results;

        } else {

          const response =
            await fetch(
              "/api/search",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                  Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                  profileId: profile.id,
                  query: debouncedQuery,
                  // accessToken: session?.access_token
                }),
              }
            );

          const data =
            await response.json();

          console.log(
            "SEARCH SOURCE:",
            data.source
          );

          filtered =
            data.results || [];
        }

        setResultCount(filtered.length);

        onSearchResults?.(filtered, debouncedQuery);
    }
    runSearch();

  }, [debouncedQuery, onSearchResults, aiMode]);

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
      if (e.key === "Enter" && searchQuery.trim()) {
        saveSearch(searchQuery);
        setHistory(getSearchHistory());
      }
    },
    [searchQuery]
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
          {/* Recent searches dropdown */}
          {isOpen && searchQuery.length === 0 && history.length > 0 && (
            <div
              className="
                absolute left-0 top-[calc(100%+6px)] w-full
                bg-black/30 
                border border-white/[0.08]
                rounded-md
                p-1.5
                z-50
                shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                animate-fade-in
              "
              style={{padding:"8px"}}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <span className="text-[11px] font-medium tracking-wide uppercase text-white/35">
                  Recent
                </span>
                <button
                  onClick={() => {
                    clearSearchHistory();
                    setHistory([]);
                  }}
                  className="
                    text-[10px] font-medium tracking-wide
                    text-white/30 hover:text-red-400
                    px-2 py-0.5 rounded-md
                    hover:bg-white/[0.06]
                    transition-all duration-200
                    cursor-pointer
                  "
                >
                  Clear all
                </button>
              </div>

              {/* Divider */}
              <div className="mx-2 mb-1 border-t border-white/[0.06]" />

              {/* History items */}
              <div className="flex flex-col gap-1.5">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSearchQuery(item)}
                    className="
                      group flex items-center justify-between gap-2.5
                      w-full text-left
                      px-2.5 py-2 rounded-lg
                      text-sm text-white/60
                      hover:text-white/90
                      hover:bg-white/[0.07]
                      active:bg-white/[0.1]
                      transition-all duration-200
                    
                    "
                    style={{padding:"6px"}}
                  >
                    {/* Clock icon */}
                    <div
                      className="flex items-center gap-2.5"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors duration-200 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="truncate">{item}</span>
                    </div>
                    <div className="z-50">
                      <button
                        className="w-3.5 h-3.5 cursor-pointer text-white/25 group-hover:text-white/50 transition-colors duration-200 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item);
                          setHistory(getSearchHistory());
                        }}
                      >
                       <svg
                        className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors duration-200 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                       >
                         <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                       </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {
            isOpen &&
            searchQuery.length!==0 &&
            suggestions.length > 0 && (
              <div
                className="
                  absolute
                  top-full
                  mt-2
                  left-0
                  w-full
                  bg-black/90
                  rounded-xl
                  border
                  border-white/10
                  p-2
                "
              >

                <div
                  className="
                    text-xs
                    text-white/50
                    mb-2
                  "
                >
                  Suggestions
                </div>

                {
                  suggestions.map(
                    (item, idx) => (
                      <button
                        key={idx}
                        onClick={() =>{
                          setSearchQuery(item)
                          saveSearch(item)
                          setHistory(getSearchHistory())
                        }
                        }
                        className="
                          block
                          w-full
                          text-left
                          px-2
                          py-2
                          rounded-lg
                          hover:bg-white/10
                          text-sm
                          text-white/70
                        "
                      >
                        ✨ {item}
                      </button>
                    )
                  )
                }

              </div>
            )
          }
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