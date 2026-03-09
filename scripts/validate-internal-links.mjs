import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const REDIRECTS_FILE = path.join(ROOT, 'public', '_redirects');
const FILE_EXTS = ['.astro', '.md', '.mdx'];
const SKIP_PREFIXES = ['http://', 'https://', 'mailto:', 'tel:', '#'];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (FILE_EXTS.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

function parseRedirectSources(file) {
  if (!fs.existsSync(file)) return new Set();
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const sources = new Set();
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [src] = line.split(/\s+/);
    if (src?.startsWith('/')) sources.add(src);
  }
  return sources;
}

function routeCandidates(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0].replace(/\/$/, '');
  if (!clean || clean === '/') {
    return [path.join(PAGES_DIR, 'index.astro')];
  }

  const rel = clean.replace(/^\//, '');
  return [
    path.join(PAGES_DIR, rel, 'index.astro'),
    path.join(PAGES_DIR, `${rel}.astro`),
    path.join(PAGES_DIR, `${rel}.md`),
    path.join(PAGES_DIR, `${rel}.mdx`),
  ];
}

const redirects = parseRedirectSources(REDIRECTS_FILE);
const hrefRegex = /href\s*=\s*["'`]([^"'`]+)["'`]/g;
const files = walk(SRC_DIR);
const issues = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(hrefRegex)) {
    const href = match[1]?.trim();
    if (!href || SKIP_PREFIXES.some((prefix) => href.startsWith(prefix))) continue;
    if (!href.startsWith('/')) continue;

    const normalized = href.split('#')[0].split('?')[0] || '/';
    const exists = routeCandidates(normalized).some((candidate) => fs.existsSync(candidate));
    const redirected = redirects.has(normalized) || redirects.has(`${normalized}/`) || redirects.has(normalized.replace(/\/$/, ''));

    if (!exists && !redirected) {
      issues.push({ file: path.relative(ROOT, file), href: normalized });
    }
  }
}

if (issues.length) {
  console.error('[validate-internal-links] Broken local href targets found:');
  issues.forEach((issue) => console.error(`- ${issue.file} -> ${issue.href}`));
  process.exit(1);
}

console.log('[validate-internal-links] OK');
