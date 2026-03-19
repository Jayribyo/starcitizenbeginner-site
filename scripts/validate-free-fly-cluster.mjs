import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HUB = path.join(ROOT, "src", "pages", "free-fly", "index.astro");

const SATELLITES = [
  {
    rel: "src/pages/free-fly-download-install-checklist/index.astro",
    requiredLinks: ["/free-fly/"],
    mustIncludeOneOf: ["/free-fly-first-session/", "/star-citizen-performance-guide/"],
  },
  {
    rel: "src/pages/best-time-to-play-free-fly/index.astro",
    requiredLinks: ["/free-fly/"],
    mustIncludeOneOf: ["/free-fly-queues-and-server-lag-fix/", "/free-fly-first-session/"],
  },
  {
    rel: "src/pages/free-fly-first-session/index.astro",
    requiredLinks: ["/free-fly/"],
    mustIncludeOneOf: ["/first-session/", "/how-to-buy-star-citizen/", "/free-fly-what-do-i-keep/"],
  },
  {
    rel: "src/pages/free-fly-queues-and-server-lag-fix/index.astro",
    requiredLinks: ["/free-fly/", "/star-citizen-performance-guide/"],
    mustIncludeOneOf: ["/best-time-to-play-free-fly/"],
  },
  {
    rel: "src/pages/free-fly-what-do-i-keep/index.astro",
    requiredLinks: ["/free-fly/"],
    mustIncludeOneOf: ["/star-citizen-starter-packs/", "/how-to-buy-star-citizen/"],
  },
  {
    rel: "src/pages/try-star-citizen-without-buying/index.astro",
    requiredLinks: ["/free-fly/", "/star-citizen-performance-guide/", "/should-you-buy-star-citizen/"],
    mustIncludeOneOf: ["/free-fly-first-session/", "/how-to-buy-star-citizen/"],
  },
];

let failed = false;

function readFile(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.error(`[validate-free-fly-cluster] Missing file: ${rel}`);
    failed = true;
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

const hubText = readFile("src/pages/free-fly/index.astro");
for (const token of [
  "free-fly-next-first-session",
  "free-fly-next-buy-test",
  "free-fly-next-performance",
]) {
  if (hubText && !hubText.includes(token)) {
    console.error(`[validate-free-fly-cluster] Missing token "${token}" in src/pages/free-fly/index.astro`);
    failed = true;
  }
}

for (const page of SATELLITES) {
  const text = readFile(page.rel);
  if (!text) continue;

  if (text.includes("/satellites/")) {
    console.error(`[validate-free-fly-cluster] Legacy /satellites/ link found in ${page.rel}`);
    failed = true;
  }

  for (const token of page.requiredLinks) {
    if (!text.includes(token)) {
      console.error(`[validate-free-fly-cluster] Missing required cluster link (${token}) in ${page.rel}`);
      failed = true;
    }
  }

  if (!page.mustIncludeOneOf.some((token) => text.includes(token))) {
    console.error(
      `[validate-free-fly-cluster] Missing any acceptable continuation link (${page.mustIncludeOneOf.join(", ")}) in ${page.rel}`,
    );
    failed = true;
  }

  const canonicalMatch = text.match(/canonicalPath\s*=\s*"([^"]+)"/);
  if (!canonicalMatch) {
    console.error(`[validate-free-fly-cluster] Missing canonicalPath in ${page.rel}`);
    failed = true;
  } else if (canonicalMatch[1].startsWith("/satellites/")) {
    console.error(`[validate-free-fly-cluster] Legacy canonicalPath ${canonicalMatch[1]} in ${page.rel}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("[validate-free-fly-cluster] OK");
