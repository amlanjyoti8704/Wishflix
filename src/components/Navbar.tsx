"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Searchbar from "@/components/Searchbar";
import { isAdmin } from "@/lib/isAdmin";

export default function Navbar({ mediaItems, onSearchResults }: any) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [adminAccess, setAdminAccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); 

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.push("/login"); 
  };  

  useEffect(()=>{
    const checkAdminAccess=async()=>{
      const access=await isAdmin();
      setAdminAccess(access);
    }
    checkAdminAccess();
  },[pathname]);

  useEffect(() => {
    const getCurrentProfile=async()=>{
      const selectedProfile=localStorage.getItem("selectedProfile");
      if(!selectedProfile) return;

      try {
        const parsedProfile = JSON.parse(selectedProfile);
        const selectedProfileId = parsedProfile?.id;
        if(!selectedProfileId) return;

        // const {data,error}=await supabase.from("profiles").select("*").eq("id",selectedProfileId).single();

        // console.log(data);
        // console.log(error);

        // if(data) setProfile(data);  
        setProfile(parsedProfile);  //this line was added in place of the above database call

      } catch (err) {
        console.error("Error parsing selected profile from localStorage", err);
      }
    };
    getCurrentProfile();
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/browse", label: "Home" },
    { href: "/browse#my-list", label: "My List" },
    { href: "/profiles", label: "Profiles" },
    // { href: "/admin", label: "Admin" },
  ];

  // console.log("PROFILE STATE", profile);
  return (
    <nav
      style={{paddingLeft:'16px', paddingRight:'16px'}}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 w-full">

          {/* 🔥 Logo */}
          <Link
            href="/browse"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold tracking-wide text-white group-hover:text-red-400 transition">
              WISHFLIX
            </span>
          </Link>

          {/* 🔥 Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/browse" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-white/70 hover:text-white transition"
                >
                  {link.label}

                  {/* Active underline glow */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-red-500 to-purple-500 transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
              
            })}
            {adminAccess && (
                <Link
                  href="/admin"
                  className="relative text-sm font-medium text-white/70 hover:text-white transition"
                >
                  Admin
                </Link>
              )}
          </div>

          {/* 🔥 Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {pathname === "/browse" && <Searchbar mediaItems={mediaItems} onSearchResults={onSearchResults} />}

            {/* Profile */}
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center font-bold text-sm transition-all duration-300 hover:ring-2 hover:ring-red-500/50 hover:scale-110 focus:outline-none"
              >
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-white text-lg">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </span>
                )}  
              </button>
              <ul className={`absolute right-0 top-full mt-2 w-40 py-2 bg-zinc-900 border border-white/10 rounded-lg shadow-xl transition-all duration-200 z-50 ${
                dropdownOpen 
                  ? "opacity-100 visible translate-y-0" 
                  : "opacity-0 invisible translate-y-1"
              }`}>
                <li className="py-1 px-2 text-center">
                  <Link href="/profiles" onClick={() => setDropdownOpen(false)} className="text-sm font-medium text-white/70 hover:text-white transition">Manage Profiles</Link>  
                </li>
                <li className="py-1 px-2 text-center">
                    <button className="text-sm font-medium text-white/70 hover:text-white transition" onClick={() => { setDropdownOpen(false); handleLogout(); }}>Logout</button>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 🔥 Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            mobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/10 p-2 flex flex-col gap-1">

            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {adminAccess && (
                <Link
                  href="/admin"
                  className="relative text-sm font-medium text-white/70 hover:text-white transition"
                >
                  Admin
                </Link>
              )}

          </div>
        </div>
      </div>
    </nav>
  );
}