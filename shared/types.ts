export type VoteChoice = "flow" | "breaks";

export interface Env {
  DB: D1Database;
  /** Secret mixed into the voter cookie hash. Set via `wrangler pages secret put`. */
  VOTER_HASH_SECRET?: string;
  /** Cloudflare Turnstile secret key. Set via `wrangler pages secret put`. */
  TURNSTILE_SECRET_KEY?: string;
  /** "1" to require Turnstile verification on votes. */
  TURNSTILE_REQUIRED?: string;
}

export interface Poll {
  id: string;
  slug: string;
  title: string;
  description: string | null;
}

export interface CountryResult {
  countryCode: string;
  total: number;
  flowPercent: number;
}

export interface ResultsPayload {
  poll: { id: string; title: string };
  totals: Record<VoteChoice, number>;
  totalVotes: number;
  countries: CountryResult[];
  userHasVoted: boolean;
  userChoice: VoteChoice | null;
  /** ISO-style country code from CF-IPCountry, when known. Not stored. */
  suggestedCountry?: string | null;
}

export interface VoteRequestBody {
  pollSlug?: string;
  choice?: string;
  countryCode?: string | null;
  handle?: string | null;
  turnstileToken?: string | null;
}
