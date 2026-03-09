export const SITE_NAME = "Star Citizen Beginner";
export const SITE_SHORT_NAME = "SCB";
export const SITE_URL = "https://starcitizenbeginner.com";

export const REFERRAL_CODE = "STAR-FSRJ-5N7Z";
export const REFERRAL_BONUS_UEC = "50,000";
export const REFERRAL_BONUS_LABEL = `${REFERRAL_BONUS_UEC} UEC`;
export const REFERRAL_LINK = `https://www.robertsspaceindustries.com/enlist?referral=${REFERRAL_CODE}`;
export const REFERRAL_INFO_PATH = "/star-citizen-referral-code/";
export const REFERRAL_HELP_PATH = `${REFERRAL_INFO_PATH}#how-to-use`;

export const FLY_FREE_URL = "https://robertsspaceindustries.com/en/flyfree";

export const FREE_FLY_HUB_PATH = "/free-fly/";
export const SHOULD_YOU_BUY_PATH = "/should-you-buy-star-citizen/";
export const STARTER_PACKS_PATH = "/star-citizen-starter-packs/";
export const PERFORMANCE_GUIDE_PATH = "/star-citizen-performance-guide/";

export const DEFAULT_LANGUAGE_PATHS = {
  en: "/",
  de: "/de/",
  fr: "/fr/",
  es: "/es/",
  zh: "/zh/",
} as const;

export const LANGUAGE_LABELS = {
  en: { code: "EN", label: "English" },
  de: { code: "DE", label: "Deutsch" },
  fr: { code: "FR", label: "Français" },
  es: { code: "ES", label: "Español" },
  zh: { code: "中文", label: "中文" },
} as const;


export const LANGUAGE_OPTIONS = Object.entries(LANGUAGE_LABELS).map(([key, value]) => ({
  key,
  code: value.code,
  label: value.label,
  href: DEFAULT_LANGUAGE_PATHS[key as keyof typeof DEFAULT_LANGUAGE_PATHS],
}));
