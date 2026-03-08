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
