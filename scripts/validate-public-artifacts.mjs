import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const forbiddenExts = new Set([".astro", ".md", ".mdx", ".ts", ".tsx", ".js", ".jsx"]);
const issues = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const ext = path.extname(entry.name);
      if (forbiddenExts.has(ext) && entry.name !== "_headers" && entry.name !== "_redirects") {
        issues.push(`Forbidden source-like file in public/: ${path.relative(ROOT, full)}`);
      }
      if (entry.name === "sitemap.xml") {
        issues.push(`Do not keep a static public/sitemap.xml: ${path.relative(ROOT, full)}`);
      }
    }
  }
}

if (fs.existsSync(PUBLIC_DIR)) walk(PUBLIC_DIR);

if (issues.length) {
  console.error("[validate-public-artifacts] Issues found:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("[validate-public-artifacts] OK");
