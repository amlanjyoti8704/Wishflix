"use client";

import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
// import { profiles } from "@/lib/mockData";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ProfilesPage() {

  const [profiles, setProfiles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [manageMode, setManageMode] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);


   useEffect(() => {  

    const getprofiles = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      const user = sessionData.session?.user;

      if (!user) return;

      // check if profile exists

      const { data: existingProfile, error } = await supabase

        .from("profiles")

        .select("*")

        .eq("user_id", user.id);

      // console.log(existingProfile);

      if(!existingProfile || existingProfile.length===0){
        const {error: insertError}=await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            name: 
                  user.user_metadata.full_name || 
                  user.user_metadata.name || 
                  "User",
            // avatar: "/avatar1.png",
          });

        console.log("PROFILE CREATED");

        console.log(insertError); 
        
        const {data: newProfiles}=await supabase.from("profiles").select('*').eq("user_id",user.id);

        if(newProfiles){
          setProfiles(newProfiles);
        }

      }else{
        setProfiles(existingProfile);  
      }
    }
    getprofiles()

  }, []);



  const handleCreateProfile = async () => {

    const { data: sessionData } =
      await supabase.auth.getSession();

    const user = sessionData.session?.user;

    if (!user) return;

    let avatarUrl = null;

    // upload image if exists
    if (avatarFile) {

      const fileExt =
        avatarFile.name.split(".").pop();

      const fileName =
        `${Date.now()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

      if (!uploadError) {

        const { data } =
          supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

        avatarUrl = data.publicUrl;
        // console.log("AVATAR URL:", avatarUrl);
      }
    }

    // create profile
    const { data: createdProfile, error } =
      await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          name: newProfileName,
          avatar: avatarUrl,
        })
        .select()
        .single();

    // console.log(createdProfile);
    console.log(error);

    if (createdProfile) {

      setProfiles((prev) => [
        ...prev,
        createdProfile,
      ]);

      setShowModal(false);

      setNewProfileName("");

      setAvatarFile(null);
    }
  };


  const handleUpdateProfile = async () => {

    if (!selectedProfile) return;

    // console.log(selectedProfile);

    let avatarUrl =
      selectedProfile.avatar;

    // upload new avatar

    if (editAvatarFile) {

      const fileExt =
        editAvatarFile.name
          .split(".")
          .pop();

      const fileName =
        `${Date.now()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, editAvatarFile);

      if (!uploadError) {

        const { data } =
          supabase.storage
            .from("avatars")
            .getPublicUrl(fileName);

        avatarUrl = data.publicUrl;
      }
    }

    const { data, error } =
      await supabase
        .from("profiles")
        .update({
          name: editName,
          avatar: avatarUrl,
        })
        .eq("id", selectedProfile.id)
        .select()
        .single();

    // console.log(data);
    console.log(error);

    if (data) {

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === selectedProfile.id
            ? data
            : p
        )
      );

      setSelectedProfile(null);
    }
  };

  const handleDeleteProfile = async () => {

    if (!selectedProfile) return;

    const { error } =
      await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedProfile.id);

    console.log(error);

    setProfiles((prev) =>
      prev.filter(
        (p) =>
          p.id !== selectedProfile.id
      )
    );

    setSelectedProfile(null);
  };

  return (
    <ProtectedRoute>
      {
        showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center p-10 justify-center z-50">

            <div style={{padding:"20px 40px 50px 40px"}} className="bg-zinc-900 p-5 sm:p-10 overflow-hidden  rounded-2xl w-[90%] h-[40vh] max-w-md">

              <h2 className="text-2xl text-center font-bold mb-6">
                Add Profile
              </h2>

              <input
                type="text"
                placeholder="Profile Name"
                value={newProfileName}
                onChange={(e) =>
                  setNewProfileName(e.target.value)
                }
                className="w-full p-3 rounded bg-zinc-800 mb-4"
                style={{marginTop:"40px"}}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAvatarFile(e.target.files?.[0] || null)
                }
                className="mb-6 border border-zinc-700 rounded p-1.5 w-full opacity-60"
              />

              <div className="flex flex-col items-center gap-3" style={{marginTop:"20px"}}>

                <button
                  onClick={handleCreateProfile}
                  className=" bg-red-600 py-3 rounded w-[20vw]"
                  
                >
                  Create
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className=" bg-zinc-700 py-3 rounded w-[20vw]"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )
      }

      {
        selectedProfile && (

          <div
            className="
              fixed inset-0
              bg-black/80
              z-50
              flex items-center justify-center
            "
          >

            <div
              className="
                bg-zinc-900
                p-8
                rounded-2xl
                w-[90%]
                max-w-md
              "
            >

              <h2 className="text-2xl font-bold mb-6">
                Edit Profile
              </h2>

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                className="
                  w-full
                  p-3
                  rounded
                  bg-zinc-800
                  mb-4
                "
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditAvatarFile(
                    e.target.files?.[0] || null
                  )
                }
                className="
                  mb-6
                  w-full
                "
              />

              <div className="flex flex-col gap-3">

                <button
                  onClick={handleUpdateProfile}
                  className="
                    bg-red-600
                    py-3
                    rounded
                  "
                >
                  Save Changes
                </button>

                <button
                  onClick={handleDeleteProfile}
                  className="
                    bg-zinc-700
                    py-3
                    rounded
                  "
                >
                  Delete Profile
                </button>

                <button
                  onClick={() =>
                    setSelectedProfile(null)
                  }
                  className="
                    border border-zinc-600
                    py-3
                    rounded
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )
      }

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
              <div onClick={()=>{
                if( manageMode){
                  setSelectedProfile(profile);
                  setEditName(profile.name);
                }else{
                  // localStorage.setItem("selectedProfileId",profile.id);
                  localStorage.setItem("selectedProfile",JSON.stringify(profile));
                  window.location.href="/browse";
                }
                }} className={!manageMode ? "cursor-pointer" : "cursor-not-allowed"}  key={profile.id}
                style={{
                  position: "relative",  // important
                }}
              >
                <ProfileCard profile={profile} index={index} />
                {
                  manageMode && (
                    <div
                      className="
                        absolute
                        bottom-16
                        right-2
                        bg-black/80
                        rounded-full
                        p-2
                        border border-white/20
                      "
                    >
                      ✏️
                    </div>
                  )
                }
              </div>
            ))}

            {/* Add Profile Button */}
            <button
              className="group flex flex-col items-center gap-3 sm:gap-4 animate-fade-in"
              style={{ animationDelay: `${profiles.length * 100}ms` }}
              id="add-profile-btn"
              onClick={()=>setShowModal(true)}
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
            onClick={() => setManageMode(!manageMode)}
            className="
              px-8 py-2.5
              w-[35vw] sm:w-[20vw] xl:w-[15vw]
              h-[5vh]
              border border-text-muted/30
              rounded
              text-sm
              text-text-muted
              hover:text-white
              hover:border-white/50
              transition-all duration-300
            "
          >
            {manageMode ? "Done" : "Manage Profiles"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
