"use client";

import { useRef, useState } from "react";
import Card from "./Card";
import { ContentItem } from "@/lib/mockData";

interface RowProps {
  title: string;
  items: ContentItem[];
  id?: string;
  accent?: boolean;
}

export default function Row({ title, items, id, accent = false }: RowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="relative py-4 flex flex-col gap-3 sm:py-6" id={id}>
      {/* Title */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          {accent && (
            <div className="w-1 h-6 rounded-full bg-accent" />
          )}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h2>
          <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-border to-transparent ml-4" />
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative group/row">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-14 bg-gradient-to-r from-bg-primary/90 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-14 bg-gradient-to-l from-bg-primary/90 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-12 pb-2 h-[21vh]"
        >
          {items.map((item, index) => (
            <Card key={item.id} content={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
