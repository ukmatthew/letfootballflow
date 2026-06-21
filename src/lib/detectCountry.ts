import {
  detectSuggestedRegion,
  isUkDetected,
  normalizeDetectedCountry,
  UK_REGION_CODE,
} from "./countries";

/** Browser locale fallback when CF-IPCountry is unavailable (e.g. local dev). */
export function guessCountryFromLocale(): string | null {
  if (typeof navigator === "undefined") return null;

  const langs = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];

  for (const lang of langs) {
    const region = lang.replace("_", "-").split("-")[1];
    if (!region) continue;
    if (isUkDetected(region)) return UK_REGION_CODE;
    const code = normalizeDetectedCountry(region);
    if (code) return code;
  }

  return null;
}

/** Prefer server-detected country/region; fall back to browser locale. */
export function resolveSuggestedCountry(apiValue: string | null | undefined): string | null {
  return detectSuggestedRegion(apiValue) ?? guessCountryFromLocale();
}
