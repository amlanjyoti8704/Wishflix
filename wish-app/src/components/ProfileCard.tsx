"use client";

import { Profile } from "@/lib/mockData";

interface ProfileCardProps {
  profile: Profile;
  index?: number;
}

export default function ProfileCard({ profile, index = 0 }: ProfileCardProps) {
  return (
    <button
      className="group flex flex-col items-center gap-3 sm:gap-4 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      id={`profile-${profile.id}`}
    >
      {/* Avatar */}
      <div
        className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-black transition-all duration-500 ease-out group-hover:scale-110 group-hover:rounded-xl overflow-hidden"
        style={{
          backgroundColor: `${profile.color}20`,
          border: `2px solid ${profile.color}40`,
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 30px ${profile.color}30, 0 0 40px ${profile.color}20`,
          }}
        />
        <span
          className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: profile.color }}
        >
          {profile.avatar}
        </span>
      </div>

      {/* Name */}
      <span className="text-sm sm:text-base font-medium text-text-secondary group-hover:text-white transition-colors duration-300">
        {profile.name}
      </span>
    </button>
  );
}
