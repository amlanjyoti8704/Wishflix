"use client";

interface ProfileCardProps {
  profile: any;
  index?: number;
}

export default function ProfileCard({
  profile,
  index = 0,
}: ProfileCardProps) {

  const initial =
    profile.name?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className="group flex flex-col items-center gap-3 sm:gap-4 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >

      {/* Avatar */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36">

        {profile.avatar ? (

          <img
            src={profile.avatar}
            alt={profile.name}
            className="
              w-full
              h-full
              object-cover
              rounded-2xl
              border-2
              border-transparent
              transition-all
              duration-500
              group-hover:border-white
              group-hover:scale-105
            "
          />

        ) : (

          <div
            className="
              w-full
              h-full
              rounded-2xl
              bg-gradient-to-br
              from-purple-500
              to-red-500
              flex
              items-center
              justify-center
              text-4xl
              lg:text-5xl
              font-bold
              text-white
              transition-all
              duration-500
              group-hover:scale-105
              group-hover:ring-4
              group-hover:ring-white/20
            "
          >
            {initial}
          </div>

        )}

      </div>

      {/* Name */}
      <span
        className="
          text-sm
          sm:text-base
          text-text-muted
          group-hover:text-white
          transition-colors
          duration-300
        "
      >
        {profile.name}
      </span>

    </div>
  );
}