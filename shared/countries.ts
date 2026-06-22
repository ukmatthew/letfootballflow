export interface Country {
  code: string;
  name: string;
}

/** ISO GB from Cloudflare / en-GB locale — the UK, not a single nation. */
export const UK_REGION_CODE = "GB";

/** Home-nation codes (alphabetical by name). Scotland uses SX (GB is the UK region). */
export const UK_NATION_CODES = ["EN", "NI", "SX", "WL"] as const;

export type UkNationCode = (typeof UK_NATION_CODES)[number];

const KNOWN_CODES = new Set<string>([
  "AR", "AU", "AT", "BE", "BR", "BG", "CM", "CA", "CL", "CN", "CO", "CR", "HR", "CZ", "DK",
  "EC", "EG", "EN", "FI", "FR", "DE", "GH", "GR", "HU", "IS", "IN", "ID", "IR", "IE", "IL",
  "IT", "CI", "JM", "JP", "KE", "KR", "MX", "MA", "NL", "NZ", "NG", "NO", "PA", "PY", "PE",
  "PH", "PL", "PT", "QA", "RO", "RU", "SA", "SN", "RS", "SX", "NI", "SK", "SI", "ZA", "ES",
  "SE", "CH", "TH", "TN", "TR", "UA", "AE", "US", "UY", "VE", "WL",
]);

/** Legacy votes stored Scotland under GB before the SX rename. */
const LEGACY_CODE_ALIASES: Record<string, string> = {
  GB: "SX",
};

export function isKnownCountryCode(code: string): boolean {
  return KNOWN_CODES.has(code.toUpperCase());
}

export function isUkDetected(raw: string | null | undefined): boolean {
  return raw?.toUpperCase() === UK_REGION_CODE;
}

/** Normalise a detected ISO region to a list code, or null. GB means UK (not Scotland). */
export function normalizeDetectedCountry(raw: string | null | undefined): string | null {
  if (!raw || raw === "XX" || raw.length !== 2) return null;
  if (isUkDetected(raw)) return null;
  const upper = raw.toUpperCase();
  return KNOWN_CODES.has(upper) ? upper : null;
}

/** Value for suggestedCountry in the API / client when the user is in the UK. */
export function detectSuggestedRegion(raw: string | null | undefined): string | null {
  if (!raw || raw === "XX") return null;
  if (isUkDetected(raw)) return UK_REGION_CODE;
  return normalizeDetectedCountry(raw);
}

export function resolveCountryCode(code: string): string {
  return LEGACY_CODE_ALIASES[code] ?? code;
}

export function countryName(code: string): string {
  const resolved = resolveCountryCode(code);
  return COUNTRIES.find((c) => c.code === resolved)?.name ?? code;
}

export function ukNations(): Country[] {
  return UK_NATION_CODES.map(
    (code) => COUNTRIES.find((c) => c.code === code)!,
  ).sort((a, b) => a.name.localeCompare(b.name));
}

/** UK home nations first (when detected), otherwise one suggested country at the top. */
export function partitionCountries(detected: string | null | undefined): {
  ukNations: Country[];
  suggested: Country | null;
  rest: Country[];
} {
  if (isUkDetected(detected)) {
    const nations = ukNations();
    const nationCodes = new Set(nations.map((c) => c.code));
    return {
      ukNations: nations,
      suggested: null,
      rest: COUNTRIES.filter((c) => !nationCodes.has(c.code)),
    };
  }

  const normalized = normalizeDetectedCountry(detected);
  const suggested = normalized
    ? (COUNTRIES.find((c) => c.code === normalized) ?? null)
    : null;
  const rest = COUNTRIES.filter((c) => c.code !== suggested?.code);
  return { ukNations: [], suggested, rest };
}

// A broad, footballing-friendly list. Sorted alphabetically by name.
export const COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "EN", name: "England" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "CI", name: "Ivory Coast" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "KE", name: "Kenya" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "MA", name: "Morocco" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NG", name: "Nigeria" },
  { code: "NI", name: "Northern Ireland" },
  { code: "NO", name: "Norway" },
  { code: "PA", name: "Panama" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SX", name: "Scotland" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TH", name: "Thailand" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Türkiye" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" },
  { code: "WL", name: "Wales" },
];
