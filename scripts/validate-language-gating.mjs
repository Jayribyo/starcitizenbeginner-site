import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const siteConfigPath = path.join(ROOT, "src", "config", "site.ts");
const envTypesPath = path.join(ROOT, "src", "env.d.ts");
const packageJsonPath = path.join(ROOT, "package.json");
const languagePages = ["de", "fr", "es", "zh"].map((lang) => path.join(ROOT, "src", "pages", lang, "index.astro"));

const mustContain = (filePath, snippets) => {
  const content = fs.readFileSync(filePath, "utf8");
  for (const snippet of snippets) {
    if (!content.includes(snippet)) {
      throw new Error(`${path.relative(ROOT, filePath)} is missing required snippet: ${snippet}`);
    }
  }
};

mustContain(siteConfigPath, [
  'LANGUAGE_PAGES_ENABLED',
  'PUBLIC_ENABLE_LANGUAGE_PAGES',
  'DEFAULT_LANGUAGE_PATHS = LANGUAGE_PAGES_ENABLED',
]);

mustContain(envTypesPath, ['PUBLIC_ENABLE_LANGUAGE_PAGES']);

for (const pagePath of languagePages) {
  mustContain(pagePath, [
    'LANGUAGE_PAGES_ENABLED',
    'robots={LANGUAGE_PAGES_ENABLED ? "index,follow" : "noindex,follow"}',
  ]);
}

mustContain(packageJsonPath, ['"validate:lang"', 'validate-language-gating.mjs']);

console.log('Language gating validation passed.');
