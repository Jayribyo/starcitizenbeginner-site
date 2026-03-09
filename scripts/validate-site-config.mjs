import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_CONFIG = path.join(ROOT, 'src', 'config', 'site.ts');
const BASE_LAYOUT = path.join(ROOT, 'src', 'layouts', 'BaseLayout.astro');
const HEADER = path.join(ROOT, 'src', 'components', 'SiteHeader.astro');

const checks = [
  {
    file: SITE_CONFIG,
    mustInclude: ['REFERRAL_CODE', 'REFERRAL_LINK', 'LANGUAGE_PATHS'],
  },
  {
    file: BASE_LAYOUT,
    mustInclude: ['data-referral-code', 'data-scb-page-type', 'scb_page_view'],
  },
  {
    file: HEADER,
    mustInclude: ['lang=', 'paths='],
  },
];

let failed = false;
for (const check of checks) {
  const text = fs.readFileSync(check.file, 'utf8');
  for (const token of check.mustInclude) {
    if (!text.includes(token)) {
      console.error(`[validate-site-config] Missing token "${token}" in ${path.relative(ROOT, check.file)}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('[validate-site-config] OK');
