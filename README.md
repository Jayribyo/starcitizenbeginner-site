# Star Citizen Beginner (SCB)

Unofficial Star Citizen authority-style guide site focused on beginner decision journeys, Free Fly traffic, and referral-code conversion before the first game-package purchase.

## Stack
- Astro static site
- Cloudflare Pages deployment target
- Global stylesheet + Astro components

## Core rules
- `src/` is source code; `public/` only contains deployable static assets and platform files.
- The repo is the source of truth. Documentation must follow repo reality.
- Referral constants live in `src/config/site.ts`.
- The canonical production domain is `starcitizenbeginner.com`.

## Build
```bash
pnpm install
pnpm run build
```

## Key files
- `src/config/site.ts` – site-wide constants and language paths
- `src/layouts/BaseLayout.astro` – global metadata, header, tracking, sticky CTA, copy toast
- `src/components/SiteHeader.astro` – primary navigation and language UI
- `public/_redirects` – Cloudflare Pages route redirects
- `scripts/generate-sitemap.mjs` – sitemap generation step
