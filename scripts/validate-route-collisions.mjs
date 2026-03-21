import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const pagesDir = path.join(repoRoot, 'src', 'pages');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      out.push(full);
    }
  }
  return out;
}

function routeKey(file) {
  const rel = path.relative(pagesDir, file).replace(/\\/g, '/');
  const noExt = rel.replace(/\.astro$/, '');
  let route = '/' + noExt;
  route = route.replace(/\/index$/, '/');
  route = route.replace(/\/+/g, '/');
  if (route !== '/' && route.endsWith('/')) route = route.slice(0, -1);
  return route;
}

const files = walk(pagesDir);
const byRoute = new Map();
for (const file of files) {
  const key = routeKey(file);
  const rel = path.relative(repoRoot, file).replace(/\\/g, '/');
  const list = byRoute.get(key) ?? [];
  list.push(rel);
  byRoute.set(key, list);
}

const collisions = [...byRoute.entries()].filter(([, list]) => list.length > 1);
if (collisions.length) {
  console.error('Route collisions detected in src/pages:');
  for (const [route, list] of collisions) {
    console.error(`\n  ${route}`);
    for (const file of list) console.error(`    - ${file}`);
  }
  process.exit(1);
}

console.log(`Route collision check passed (${files.length} Astro pages scanned).`);
