import fs from "node:fs";
import path from "node:path";

const SITE = "https://starcitizenbeginner.com";
const DIST_DIR = path.resolve(process.cwd(), "dist");

// Recursively collect all HTML files in dist/
function collectHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Convert dist file path to URL
function filePathToUrl(filePath) {
  let rel = path.relative(DIST_DIR, filePath).replace(/\\/g, "/");

  // Ignore internal Astro artifacts if any (safe guard)
  if (rel.startsWith("_astro/")) return null;

  // index.html -> folder URL
  if (rel.endsWith("/index.html")) rel = rel.replace(/\/index\.html$/, "/");
  else if (rel === "index.html") rel = "/"; // root

  // other .html -> strip extension (rare)
  else rel = "/" + rel.replace(/\.html$/, "");

  // Ensure leading slash
  if (!rel.startsWith("/")) rel = "/" + rel;

  // Avoid double slashes
  rel = rel.replace(/\/{2,}/g, "/");

  return SITE.replace(/\/$/, "") + rel;
}

const htmlFiles = collectHtmlFiles(DIST_DIR);

const urls = htmlFiles
  .filter((filePath) => {
    const rel = path.relative(DIST_DIR, filePath).replace(/\/g, "/");
    if (rel === "404/index.html" || rel === "404.html") return false;

    try {
      const html = fs.readFileSync(filePath, "utf8");
      return !/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
    } catch {
      return true;
    }
  })
  .map(filePathToUrl)
  .filter(Boolean);

// Deduplicate + stable sort
const uniqueUrls = Array.from(new Set(urls)).sort();

// lastmod as YYYY-MM-DD
const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml, "utf8");

console.log(`[sitemap] Generated dist/sitemap.xml with ${uniqueUrls.length} URLs`);
