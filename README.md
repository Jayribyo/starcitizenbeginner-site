# Star Citizen Beginner (SCB)

Unofficial Star Citizen authority-style guide site focused on beginner decision journeys, Free Fly traffic, and referral-code conversion before the first game-package purchase.

## Stack
- Astro static site
- Cloudflare Pages deployment target
- Global stylesheet + Astro components
- `pnpm` package manager

## Core rules
- `src/` is source code; `public/` only contains deployable static assets and platform files.
- The repo is the source of truth. Documentation must follow repo reality.
- Referral constants live in `src/config/site.ts`.
- The canonical production domain is `starcitizenbeginner.com`.
- Tier-1 pages are: Home, Free Fly, How to Buy, Referral Code, Starter Packs, Should You Buy.

## Build
```bash
pnpm install
pnpm run build
```

## Validation
```bash
pnpm run check
pnpm run validate:links
pnpm run validate:site
pnpm run ci:check
```

`ci:check` is the pre-deploy quality gate. Run it before committing structural changes, route changes, or CTA updates.

## Deploy notes
- Cloudflare Pages is the primary deployment target.
- `.npmrc` disables frozen lockfile installs, which is safer for this repo than failing a deploy on a stale or missing lockfile.
- Keep the build command as:
  ```bash
  pnpm run build
  ```
- If you intentionally reintroduce a `pnpm-lock.yaml`, generate it from a clean local `pnpm install` and verify Cloudflare still deploys.

## Key files
- `src/config/site.ts` – site-wide constants and language paths
- `src/layouts/BaseLayout.astro` – global metadata, header, tracking, sticky CTA, copy toast
- `src/components/SiteHeader.astro` – primary navigation and language UI
- `src/components/ReferralBanner.astro` / `src/components/ReferralCTA.astro` – primary referral funnel components
- `public/_redirects` – Cloudflare Pages route redirects
- `scripts/generate-sitemap.mjs` – sitemap generation step
- `scripts/validate-internal-links.mjs` – route/href validation for local links
- `scripts/validate-site-config.mjs` – quick guardrail checks for referral/tracking/header wiring

## Operating rules
- Treat Free Fly as a Tier-1 funnel page, not a side page.
- Prefer global rules and shared components over page-specific patches.
- Any new internal link should either resolve to a real route or have a matching redirect.
- Any referral interaction should stay trustworthy, beginner-safe, and measurable.
