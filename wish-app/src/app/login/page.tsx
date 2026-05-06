"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/login-bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/50" />
      </div>

      {/* Minimal Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 lg:px-12 py-6">
        <Link href="/login" className="inline-block">
          <span className="text-3xl font-black tracking-tight text-accent">
            WISH
          </span>
        </Link>
      </nav>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border p-8 sm:p-10 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-text-muted text-sm">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/profiles";
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div className="relative">
              <label
                htmlFor="login-email"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focused === "email" || email
                    ? "top-2 text-[10px] text-accent font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm text-text-muted"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="w-full px-4 pt-6 pb-2 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="login-password"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focused === "password" || password
                    ? "top-2 text-[10px] text-accent font-medium"
                    : "top-1/2 -translate-y-1/2 text-sm text-text-muted"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                className="w-full px-4 pt-6 pb-2 bg-bg-tertiary border border-border rounded-xl text-white text-sm transition-all duration-300 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 hover:border-border-hover"
                required
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-bg-tertiary accent-accent"
                  id="remember-me"
                />
                <span className="group-hover:text-text-secondary transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-text-muted hover:text-accent transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              id="login-submit"
              className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-text-muted">
            New to Wish?{" "}
            <Link
              href="/signup"
              className="text-white font-semibold hover:text-accent transition-colors duration-300"
              id="login-signup-link"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-text-muted/60 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
