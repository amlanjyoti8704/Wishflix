"use client";

import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import { profiles } from "@/lib/mockData";

export default function ProfilesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary px-4">
      {/* Minimal Navbar */}
      <nav className="absolute top-4  left-5 z-20 px-6 lg:px-2 py-6">
        <Link href="/login" className="inline-block">
          <span className="text-3xl font-black tracking-tight text-accent">
            WISHFLIX
          </span>
        </Link>
      </nav>

      {/* Content */}
      <div className="text-center flex flex-col items-center  justify-center gap-6 animate-fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Who&apos;s watching?
          </h1>
          <p className="text-text-muted text-sm sm:text-base mb-10 sm:mb-14">
            Select your profile to get started
          </p>
        </div>

        {/* Profile Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10 mb-12">
          {profiles.map((profile, index) => (
            <Link href="/browse" key={profile.id}>
              <ProfileCard profile={profile} index={index} />
            </Link>
          ))}

          {/* Add Profile Button */}
          <button
            className="group flex flex-col items-center gap-3 sm:gap-4 animate-fade-in"
            style={{ animationDelay: `${profiles.length * 100}ms` }}
            id="add-profile-btn"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl border-2 border-dashed border-border flex items-center justify-center transition-all duration-500 group-hover:border-accent/50 group-hover:scale-110 group-hover:bg-accent/5">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted transition-colors duration-300 group-hover:text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-sm sm:text-base font-medium text-text-muted group-hover:text-text-secondary transition-colors duration-300">
              Add Profile
            </span>
          </button>
        </div>

        {/* Manage Profiles */}
        <button
          className="px-8 py-2.5 w-[35vw] sm:w-[20vw] xl:w-[15vw] h-[5vh] border border-text-muted/30 rounded text-sm text-text-muted hover:text-white hover:border-white/50 transition-all duration-300"
          id="manage-profiles-btn"
        >
          Manage Profiles
        </button>
      </div>
    </div>
  );
}
