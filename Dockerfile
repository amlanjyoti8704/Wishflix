# ──────────────────────────────────────────────────────────────
# Dockerfile for wish-app (Next.js 16 — standalone output)
#
# HOW IT WORKS (multi-stage build):
#   Stage 1 "deps"    → installs node_modules
#   Stage 2 "builder" → builds the Next.js production bundle
#   Stage 3 "runner"  → tiny final image that only runs the app
#
# WHY multi-stage?
#   The final image contains ONLY the compiled app (~100 MB)
#   instead of the full node_modules + source (~500+ MB).
# ──────────────────────────────────────────────────────────────

# ── Base image (shared by all stages) ────────────────────────
FROM node:22-alpine AS base


# ══════════════════════════════════════════════════════════════
# STAGE 1: Install dependencies
# ══════════════════════════════════════════════════════════════
FROM base AS deps
WORKDIR /app

# Copy only package files first.
# Docker caches this layer — if package.json hasn't changed,
# "npm install" won't run again on rebuilds.  ⚡ Fast rebuilds!
COPY package.json package-lock.json ./
RUN npm ci          
# "npm ci" is faster & more reliable than "npm install" in CI/Docker.
# It installs EXACTLY what's in package-lock.json.


# ══════════════════════════════════════════════════════════════
# STAGE 2: Build the Next.js app
# ══════════════════════════════════════════════════════════════
FROM base AS builder
WORKDIR /app

# ── Public env vars (baked into the JS bundle at build time) ──
# Next.js replaces NEXT_PUBLIC_* with their actual values during "next build".
# That's why we need them HERE, not at runtime.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Bring in dependencies from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Build!  (output: .next/standalone + .next/static)
RUN npm run build


# ══════════════════════════════════════════════════════════════
# STAGE 3: Production runner (the final, slim image)
# ══════════════════════════════════════════════════════════════
FROM base AS runner
WORKDIR /app

# Run as production
ENV NODE_ENV=production

# Next.js standalone server binds to the container hostname by default.
# Setting HOSTNAME=0.0.0.0 makes it listen on ALL interfaces,
# so it's reachable from your host machine via localhost:3000.
ENV HOSTNAME=0.0.0.0

# The Next.js standalone output includes its own minimal server.
# We only need three things from the build:
#   1. public/        → static assets (favicon, images, etc.)
#   2. .next/standalone/ → the self-contained Node.js server
#   3. .next/static/  → compiled CSS/JS chunks
COPY --from=builder /app/public           ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static     ./.next/static

# ── Security: run as non-root user ───────────────────────────
RUN addgroup --system --gid 1001 appgroup && \
    adduser  --system --uid 1001 appuser

# Next.js needs to write to .next/cache at runtime (image optimization, etc.)
# Create it and give ownership to appuser BEFORE switching users.
RUN mkdir -p .next/cache && chown -R appuser:appgroup .next

USER appuser

# The app listens on port 3000
EXPOSE 3000

# ── Server-only secrets (SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, etc.)
# are NOT baked into the image. Pass them at runtime via:
#   docker run -e GEMINI_API_KEY=xxx ...
#   or via docker-compose.yml → env_file
CMD ["node", "server.js"]