/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_CF_WEB_ANALYTICS_TOKEN?: string;
  readonly PUBLIC_SHOW_LANG_SWITCHER?: string;
  readonly PUBLIC_ENABLE_LANGUAGE_PAGES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
