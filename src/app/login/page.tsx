"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        window.location.href = "/profiles";
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    setIsLoading(true);
    const {data,error}=await supabase.auth.signInWithPassword({
      email,
      password
    });
    if(error){
      alert(error.message);
      setIsLoading(false);
      return;
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
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />

      {/* Login Card */}
      <div className="relative w-[70vw] max-w-xl px-6">

        <div className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

          {/* subtle border glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

          {/* Content */}
          <div className="px-10 py-12">

            {/* Inner constraint */}
            <div className="max-w-full mx-auto flex flex-col items-center justify-center gap-2.5 w-full h-[55vh]">

              {/* Heading */}
              <div className="flex flex-col justify-center items-center gap-2">
                {/* Logo */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">W</span>
                  </div>
                </div>
                <h1 className="text-3xl font-semibold text-white text-center mb-2">
                  Welcome back
                </h1>
                <p className="text-sm text-white/60 text-center mb-8">
                  Continue your journey
                </p>
              </div>

              <div className="border-b-white border-1 w-90 rounded-lg my-10"/>

              {/* Direct Login */}
              <div className="flex flex-col sm:flex-row justify-center items-center w-[50vw] md:w-[40vw] xl:w-[30vw] gap-1 sm:gap-3">
                <div 
                  onClick={async()=>{
                    await supabase.auth.signInWithOAuth({
                      provider:"google",
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      },
                    })
                  }}
                  className="text-center cursor-pointer w-full py-3 rounded-xl bg-white/5 text-white font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                  Google
                </div>
                <div 
                  onClick={async()=>{
                    await supabase.auth.signInWithOAuth({
                      provider:"github",
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                      },
                    })
                  }}
                  className="text-center cursor-pointer w-full py-3 rounded-xl bg-white/5 text-white font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                  Github
                </div>
              </div>

              <div className="flex justify-center items-center gap-2">
                <div className="border-b-white border-1 w-full rounded-lg my-10"/>
                <p>Or</p>
                <div className="border-b-white border-1 w-full rounded-lg my-10"/>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="m-3 flex flex-col gap-2 w-[50vw] md:w-[40vw] xl:w-[30vw] ">

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    // onFocus={() => setFocused("email")}
                    // onBlur={() => setFocused(null)}
                    required
                    className="w-full px-4 pt-4 pb-2 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    // onFocus={() => setFocused("password")}
                    // onBlur={() => setFocused(null)}
                    required
                    className="w-full px-4 pt-4 pb-2 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:border-red-500 focus:outline-none transition"
                  />

                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-between text-xs text-white/60">
                  <span className="cursor-pointer hover:text-white">
                    Remember me
                  </span>
                  <span className="cursor-pointer hover:text-red-400">
                    Forgot?
                  </span>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold transition hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-white/60 mt-6">
                New here?{" "}
                <Link href="/signup" className="text-red-400 hover:underline">
                  Create account
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}