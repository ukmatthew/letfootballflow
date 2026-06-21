export type { Country } from "../../shared/countries";
export {
  COUNTRIES,
  countryName,
  detectSuggestedRegion,
  isUkDetected,
  normalizeDetectedCountry,
  partitionCountries,
  resolveCountryCode,
  UK_REGION_CODE,
} from "../../shared/countries";

import { resolveCountryCode as resolveCode } from "../../shared/countries";

const TAG_BASE = 0xe0000;
const TAG_CANCEL = 0xe007f;

/** Unicode subnational flag (🏴 + tag letters + cancel). */
function subnationalFlag(tags: string): string {
  return (
    "\u{1F3F4}" +
    [...tags.toLowerCase()].map((c) => String.fromCodePoint(TAG_BASE + c.charCodeAt(0))).join("") +
    String.fromCodePoint(TAG_CANCEL)
  );
}

// 🇬🇧 — Northern Ireland has no emoji flag, so use the UK flag to stay
// consistent with the other native emoji flags.
const UK_FLAG = "\u{1F1EC}\u{1F1E7}";

const FLAG_OVERRIDES: Record<string, string> = {
  EN: subnationalFlag("gbeng"),
  SX: subnationalFlag("gbsct"),
  WL: subnationalFlag("gbwls"),
  NI: UK_FLAG,
  GB: subnationalFlag("gbsct"), // legacy Scotland votes
};

/** Flag emoji for a country / UK home-nation code. */
export function flagEmoji(code: string): string {
  const resolved = resolveCode(code);
  if (FLAG_OVERRIDES[resolved]) return FLAG_OVERRIDES[resolved];
  if (!/^[A-Za-z]{2}$/.test(resolved)) return "🏳️";
  const base = 0x1f1e6;
  return [...resolved.toUpperCase()]
    .map((c) => String.fromCodePoint(base + c.charCodeAt(0) - 65))
    .join("");
}
