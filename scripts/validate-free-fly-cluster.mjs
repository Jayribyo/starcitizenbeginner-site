import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HUB = path.join(ROOT, "src", "pages", "free-fly", "index.astro");
const SATELLITES = [
  "src/pages/satellites/free-fly-download-install-checklist/index.astro",
  "src/pages/satellites/best-time-to-play-free-fly/index.astro",
  "src/pages/satellites/free-fly-first-session/index.astro",
  "src/pages/satellites/free-fly-queues-and-server-lag-fix/index.astro",
  "src/pages/satellites/free-fly-what-do-i-keep/index.astro",
  "src/pages/satellites/try-star-citizen-without-buying/index.astro",
].map((rel) => path.join(ROOT, rel));

let failed = false;

const hubText = fs.readFileSync(HUB, "utf8");
for (const token of ["free-fly-next-first-session", "free-fly-next-buy-test", "free-fly-next-referral-guide"]) {
  if (!hubText.includes(token)) {
    console.error(`[validate-free-fly-cluster] Missing token "${token}" in src/pages/free-fly/index.astro`);
    failed = true;
  }
}

for (const file of SATELLITES) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, "utf8");
  for (const token of ["free-fly-satellite-back-to-hub", "free-fly-satellite-buy-test", "free-fly-satellite-referral-guide"]) {
    if (!text.includes(token)) {
      console.error(`[validate-free-fly-cluster] Missing token "${token}" in ${rel}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("[validate-free-fly-cluster] OK");
