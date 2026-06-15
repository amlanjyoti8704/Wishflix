"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupType, setSignupType] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");

useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      window.location.href = "/profiles";
    }
  };

  checkUser();
}, []);


const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (password !== retypePassword) return;

  setIsLoading(true);

  if (signupType === "admin") {
    try {
      const res = await fetch("/api/validate-admin-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode }),
      });
      const result = await res.json();
      if (!result.valid) {
        alert(result.message || "Invalid admin code");
        setIsLoading(false);
        return;
      }
    } catch {
      alert("Failed to verify admin code. Please try again.");
      setIsLoading(false);
      return;
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("SIGNUP:", data);
  console.log("SIGNUP ERROR:", error);

  if (error) {
    alert(error.message);
    setIsLoading(false);
    return;
  }

  if (!data.user) {
    alert("User not found");
    setIsLoading(false);
    return;
  }

  const { error: profileError } =
    await supabase
      .from("profiles")
      .update({
        name
      })
      .eq("user_id", data.user.id);

  console.log("PROFILE ERROR:", profileError);

  if (profileError) {
    alert(profileError.message);
    setIsLoading(false);
    return;
  }

  if (signupType === "admin") {

    const { error: roleError } = await supabase
        .from("user_roles")
        .update({
          role: "admin"
        })
        .eq(
          "user_id",
          data.user.id
        );

    if(roleError){
      console.log(roleError);
    }
  }

  window.location.href = "/profiles";
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/login-bg.png"
          alt="bg"
          fill
          className="object-cover scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-black/80" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative w-[70vw] max-w-xl px-6">

        <div className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

          <div className="px-10 py-12">

            <div className="max-w-full mx-auto flex flex-col items-center justify-center gap-2.5 w-full h-[65vh]">

              {/* Signup Type Tabs */}
              <div className="flex w-[50vw] md:w-[40vw] xl:w-[30vw] mb-4 rounded-xl overflow-hidden border border-white/10">

                <button
                  type="button"
                  onClick={() => setSignupType("user")}
                  className={`flex-1 py-3 ${
                    signupType === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-white/60"
                  }`}
                >
                  User Signup
                </button>

                <button
                  type="button"
                  onClick={() => setSignupType("admin")}
                  className={`flex-1 py-3 ${
                    signupType === "admin"
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-white/60"
                  }`}
                >
                  Admin Signup
                </button>

              </div>

              {/* Header */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">W</span>
                </div>

                <h1 className="text-3xl font-semibold text-white text-center">
                  Create account
                </h1>

                <p className="text-sm text-white/60 text-center">
                  Start your journey
                </p>
              </div>

              {/* Divider */}
              <div className="border-b border-white/20 w-80 my-8" />

              {/* Social */}
              <div className="flex flex-col sm:flex-row w-[50vw] md:w-[40vw] xl:w-[30vw] gap-3">
                <div 
                  onClick={async()=>{
                    await supabase.auth.signInWithOAuth({
                      provider: 'google',
                    })
                  }}
                  className="w-full text-center py-3 rounded-xl bg-white/5 text-white font-semibold hover:scale-[1.02] transition">
                  Google
                </div>
                <div 
                  onClick={async()=>{
                    await supabase.auth.signInWithOAuth({
                      provider: 'github',
                    })
                  }}
                  className="w-full text-center py-3 rounded-xl bg-white/5 text-white font-semibold hover:scale-[1.02] transition">
                  Github
                </div>
              </div>

              {/* OR */}
              <div className="flex items-center gap-3 w-[50vw] md:w-[40vw] xl:w-[30vw] my-6">
                <div className="flex-1 border-b border-white/20" />
                <span className="text-white/60 text-sm">Or</span>
                <div className="flex-1 border-b border-white/20" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-[50vw] md:w-[40vw] xl:w-[30vw]">
                
                {/* Full Name */}
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                  required
                />

                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                  required
                />

                {/* Admin Code */}
                {signupType === "admin" && (
                  <input
                    type="password"
                    placeholder="Admin Code"
                    value={adminCode}
                    onChange={(e) =>
                      setAdminCode(e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white"
                    required
                  />
                )}

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none"
                    required
                  />
                </div>

                {/* Retype Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Retype Password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-white outline-none transition
                      ${retypePassword && password !== retypePassword 
                        ? "border-red-500" 
                        : "border-white/10 focus:border-purple-500"}
                    `}
                    required
                  />

                  {/* Show/Hide */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Error Message */}
                {retypePassword && password !== retypePassword && (
                  <p className="text-red-400 text-xs">
                    Passwords do not match
                  </p>
                )}
                {retypePassword && password === retypePassword && (
                  <p className="text-emerald-400 text-xs">
                    Passwords match ✓
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || password !== retypePassword}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-red-500 text-white font-semibold 
                hover:scale-[1.02] transition shadow-lg 
                disabled:opacity-40 disabled:cursor-not-allowed"  
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </button>

              </form>

              {/* Footer */}
              <p className="text-sm text-white/60 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 hover:underline">
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}