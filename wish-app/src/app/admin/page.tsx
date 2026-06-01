"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { adminContent, categories } from "@/lib/mockData";
import { supabase } from "../../../lib/supabaseClient";
import { useEffect } from "react";
import {useRef} from "react";

export default function AdminPage() {

  const mediaInputRef =
    useRef<HTMLInputElement>(null);

  const thumbnailInputRef =
    useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileTab, setMobileTab] = useState("dashboard");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  // const [formCategory, setFormCategory] = useState("");

  const [mediaFile, setMediaFile] =
  useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [selectedProfiles, setSelectedProfiles] =
    useState<string[]>([]);

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const [profiles, setProfiles] =
    useState<any[]>([]);

  const [mediaType, setMediaType] =
    useState("");

  const currentTab = activeTab;

  useEffect(() => {

    const loadProfiles = async () => {

      const { data: sessionData } =
        await supabase.auth.getSession();

      const user =
        sessionData.session?.user;

      if (!user) return;

      const { data } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id);

      if (data) {
        setProfiles(data);
      }
    };

    loadProfiles();

  }, []);

  const handleUpload = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const { data: sessionData } =
        await supabase.auth.getSession();

      const user =
        sessionData.session?.user;

      if (!user) {
        alert("Login required");
        return;
      }

      if (!mediaFile) {
        alert("Select media file");
        return;
      }

      if (!thumbnailFile) {
        alert("Select thumbnail");
        return;
      }

      // =========================
      // Upload Thumbnail
      // =========================

      const thumbnailName =
        `${Date.now()}-${thumbnailFile.name}`;

      const {
        error: thumbnailError,
      } =
        await supabase.storage
          .from("thumbnails")
          .upload(
            thumbnailName,
            thumbnailFile
          );

      if (thumbnailError) {
        console.log(thumbnailError);
        return;
      }

      const {
        data: thumbnailData,
      } =
        supabase.storage
          .from("thumbnails")
          .getPublicUrl(
            thumbnailName
          );

      // =========================
      // Upload Media
      // =========================

      const mediaName =
        `${Date.now()}-${mediaFile.name}`;

      const {
        error: mediaError,
      } =
        await supabase.storage
          .from("media")
          .upload(
            mediaName,
            mediaFile
          );

      if (mediaError) {
        console.log(mediaError);
        return;
      }

      const {
        data: mediaData,
      } =
        supabase.storage
          .from("media")
          .getPublicUrl(
            mediaName
          );

      // =========================
      // Create Media Record
      // =========================

      const {
        data: mediaRow,
        error: mediaInsertError,
      } =
        await supabase
          .from("media")
          .insert({
            title: formTitle,
            description: formDesc,
            media_type: mediaType,
            thumbnail_url:
              thumbnailData.publicUrl,
            media_url:
              mediaData.publicUrl,
            uploaded_by: user.id,
          })
          .select()
          .single();

      if (
        mediaInsertError ||
        !mediaRow
      ) {
        console.log(
          mediaInsertError
        );
        return;
      }

      // =========================
      // Assign Profiles
      // =========================

      if (
        selectedProfiles.length > 0
      ) {

        const profileRows =
          selectedProfiles.map(
            (profileId) => ({
              media_id:
                mediaRow.id,
              profile_id:
                profileId,
            })
          );

        const { error: profileError } =
          await supabase
            .from("media_profiles")
            .insert(profileRows);

        console.log(profileError); 
      }

      // =========================
      // Categories
      // =========================

      if (
        selectedCategories.length > 0
      ) {

        const categoryRows =
          selectedCategories.map(
            (category) => ({
              media_id:
                mediaRow.id,
              category,
            })
          );

        const { error: categoryError } =
          await supabase
            .from("media_categories")
            .insert(categoryRows);

        console.log(categoryError);
      }

      alert(
        "Content uploaded successfully"
      );

      setFormTitle("");
      setFormDesc("");
      setMediaType("");
      setMediaFile(null);
      setThumbnailFile(null);
      setSelectedProfiles([]);
      setSelectedCategories([]);

      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }

      if (mediaInputRef.current) {
        mediaInputRef.current.value = "";
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <div style={{paddingTop: "60px", marginLeft: "16px", marginRight: "16px"}} className="pt-16 lg:pt-20 flex gap-10">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Mobile Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary/95 backdrop-blur-md border-t border-border">
          <div className="flex">
            {[
              { key: "dashboard", label: "Dashboard", icon: "📊" },
              { key: "add", label: "Add", icon: "➕" },
              { key: "manage", label: "Manage", icon: "📦" },
              { key: "analytics", label: "Stats", icon: "📈" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMobileTab(tab.key);
                }}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                  activeTab === tab.key
                    ? "text-accent"
                    : "text-text-muted"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 animate-fade-in">
          <div className="max-w-6xl mx-auto">

            {/* Dashboard Tab */}
            {currentTab === "dashboard" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    Dashboard
                  </h1>
                  <p className="text-text-muted text-sm">
                    Overview of your content library
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Content", value: "24", icon: "🎬", change: "+3 this week" },
                    { label: "Categories", value: "8", icon: "📂", change: "+1 new" },
                    { label: "Special Moments", value: "6", icon: "✨", change: "2 pending" },
                    { label: "Total Views", value: "1.2K", icon: "👁️", change: "+15% growth" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-bg-secondary rounded-xl border border-border p-5 hover:border-border-hover transition-all duration-300 group hover:shadow-lg hover:shadow-black/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{stat.icon}</span>
                        <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium">
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold mb-1 group-hover:text-accent transition-colors">
                        {stat.value}
                      </p>
                      <p className="text-xs text-text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Content */}
                <div>
                  <h2 className="text-lg font-bold mb-4">Recent Content</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminContent.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="bg-bg-secondary rounded-xl border border-border overflow-hidden group hover:border-border-hover transition-all duration-300"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                          <p className="text-xs text-text-muted line-clamp-2">{item.description}</p>
                          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Add Content Tab */}
            {currentTab === "add" && (
              <div className="flex flex-col gap-10 space-y-9">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    Add Content
                  </h1>
                  <p className="text-text-muted text-sm">
                    Upload new content to your library
                  </p>
                </div>

                <div className="max-w-2xl">
                  <form onSubmit={handleUpload} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="admin-title"
                        className="block text-lg font-medium text-text-secondary mb-2"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="admin-title"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Enter content title"
                        className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover placeholder:text-text-muted/50"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="admin-desc"
                        className="block text-lg font-medium text-text-secondary mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        id="admin-desc"
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Describe your content"
                        rows={4}
                        className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover placeholder:text-text-muted/50 resize-none"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-lg font-medium text-text-secondary mb-2">
                        Thumbnail Image
                      </label>
                      <div className="w-full h-10 flex items-center px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover placeholder:text-text-muted/50 resize-none">
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          className="text-center"
                          onChange={(e) =>
                            setThumbnailFile(
                              e.target.files?.[0] || null
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div>
                      <label className="block text-lg font-medium text-text-secondary mb-2">
                        Media Upload
                      </label>
                      <div className="w-full h-10 flex items-center px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover placeholder:text-text-muted/50 resize-none">
                        <input
                          ref={mediaInputRef}
                          type="file"
                          accept="video/*,image/*"
                          onChange={(e)=>
                            setMediaFile(
                              e.target.files?.[0] || null
                            )
                          }
                        />  
                      </div>
                    </div>

                    {/* Media Type */}
                    <div className="">
                      <label className="block text-lg font-medium text-text-secondary mb-2">
                        Media Type
                      </label>
                      <div className="w-full h-10 flex items-center px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover placeholder:text-text-muted/50 resize-none">
                        <select
                          value={mediaType}
                          className="w-full"
                          onChange={(e)=> 
                            setMediaType(e.target.value)
                          }
                        >
                          <option value="">
                            Select Type
                          </option>

                          <option value="movie">
                            Movie
                          </option>

                          <option value="video">
                            Video
                          </option>

                          <option value="photo">
                            Photo
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Profiles */}
                    <div className="max-w-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-lg font-medium text-text-secondary">
                          Select Profiles
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const allSelected = selectedProfiles.length === profiles.length;
                            if (allSelected) {
                              setSelectedProfiles([]);
                            } else {
                              setSelectedProfiles(profiles.map((p) => p.id));
                            }
                          }}
                          className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {selectedProfiles.length === profiles.length ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Deselect All
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Select All
                            </>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-bg-tertiary border border-border rounded-xl">
                        {profiles.map((p) => {
                          const isChecked = selectedProfiles.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 select-none group ${
                                isChecked
                                  ? "bg-accent/10 border-accent text-white focus-within:ring-2 focus-within:ring-accent/20"
                                  : "bg-bg-primary/40 border-border/60 text-text-muted hover:border-border-hover hover:text-white focus-within:ring-2 focus-within:ring-accent/20"
                              }`}
                            >
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  value={p.id}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedProfiles((prev) => [...prev, p.id]);
                                    } else {
                                      setSelectedProfiles((prev) => prev.filter((id) => id !== p.id));
                                    }
                                  }}
                                  className="peer sr-only"
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                                  isChecked
                                    ? "bg-accent border-accent text-white"
                                    : "border-border-hover bg-bg-tertiary group-hover:border-text-muted"
                                }`}>
                                  {isChecked && (
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-medium truncate">
                                {p.display_name || p.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="max-w-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-lg font-medium text-text-secondary">
                          Select Categories
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const selectable = categories.filter((c) => c !== "All");
                            const allSelected = selectedCategories.length === selectable.length;
                            if (allSelected) {
                              setSelectedCategories([]);
                            } else {
                              setSelectedCategories(selectable);
                            }
                          }}
                          className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {selectedCategories.length === categories.filter((c) => c !== "All").length ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Deselect All
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Select All
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-bg-tertiary border border-border rounded-xl">
                        {categories
                          .filter((c) => c !== "All")
                          .map((cat) => {
                            const isChecked = selectedCategories.includes(cat);
                            return (
                              <label
                                key={cat}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 select-none group ${
                                  isChecked
                                    ? "bg-accent/10 border-accent text-white focus-within:ring-2 focus-within:ring-accent/20"
                                    : "bg-bg-primary/40 border-border/60 text-text-muted hover:border-border-hover hover:text-white focus-within:ring-2 focus-within:ring-accent/20"
                                }`}
                              >
                                <div className="relative flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCategories((prev) => [...prev, cat]);
                                      } else {
                                        setSelectedCategories((prev) =>
                                          prev.filter((x) => x !== cat)
                                        );
                                      }
                                    }}
                                    className="peer sr-only"
                                  />
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                                    isChecked
                                      ? "bg-accent border-accent text-white"
                                      : "border-border-hover bg-bg-tertiary group-hover:border-text-muted"
                                  }`}>
                                    {isChecked && (
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-medium truncate">{cat}</span>
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      id="admin-submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Publish Content
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Manage Content Tab */}
            {currentTab === "manage" && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                      Manage Content
                    </h1>
                    <p className="text-text-muted text-sm">
                      Edit or remove existing content
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("add")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 w-fit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                  </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminContent.map((item) => (
                    <div
                      key={item.id}
                      className="bg-bg-secondary rounded-xl border border-border overflow-hidden group hover:border-border-hover transition-all duration-300"
                      id={`admin-card-${item.id}`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                          <button className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button className="p-2 rounded-lg bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 transition-colors">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm mb-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-text-muted line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {currentTab === "analytics" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    Analytics
                  </h1>
                  <p className="text-text-muted text-sm">
                    Track performance and engagement
                  </p>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h3 className="text-sm font-semibold mb-6">Views Over Time</h3>
                  <div className="flex items-end gap-2 h-48">
                    {[35, 55, 40, 70, 60, 85, 75, 90, 65, 80, 95, 88].map(
                      (val, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-accent/60 to-accent transition-all duration-500 hover:from-accent hover:to-accent-hover cursor-pointer"
                          style={{ height: `${val}%` }}
                          title={`Month ${i + 1}: ${val}%`}
                        />
                      )
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-text-muted">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Avg. Watch Time", value: "45m", sub: "Per session" },
                    { label: "Most Popular", value: "Neon Dreams", sub: "342 views" },
                    { label: "Engagement Rate", value: "78%", sub: "+12% vs last month" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-bg-secondary rounded-xl border border-border p-5"
                    >
                      <p className="text-xs text-text-muted mb-1">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-accent mt-1">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {currentTab === "settings" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                    Settings
                  </h1>
                  <p className="text-text-muted text-sm">
                    Configure your platform preferences
                  </p>
                </div>

                <div className="max-w-2xl space-y-6">
                  {[
                    { label: "Platform Name", value: "Wish Stream", type: "text" },
                    { label: "Contact Email", value: "admin@wish.stream", type: "email" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Notifications
                    </label>
                    <div className="space-y-3">
                      {["Email notifications", "New content alerts", "Weekly digest"].map(
                        (pref) => (
                          <label
                            key={pref}
                            className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 rounded accent-accent"
                            />
                            <span className="group-hover:text-white transition-colors">
                              {pref}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
