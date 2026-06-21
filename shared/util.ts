import type { VoteChoice } from "./types";

const VOTER_COOKIE = "lff_voter";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const VALID_CHOICES: VoteChoice[] = ["flow", "breaks"];

/** SHA-256 hex digest of the given string. */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Read a named cookie value from the request, or null. */
export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=") || null;
  }
  return null;
}

/**
 * Returns the anonymous voter token, creating a fresh one when absent.
 * `isNew` signals that a Set-Cookie header must be returned to the client.
 */
export function getOrCreateVoterToken(request: Request): {
  token: string;
  isNew: boolean;
} {
  const existing = readCookie(request, VOTER_COOKIE);
  if (existing) return { token: existing, isNew: false };
  return { token: crypto.randomUUID(), isNew: true };
}

/** Build a hardened Set-Cookie header for the anonymous voter token. */
export function voterCookieHeader(token: string): string {
  return [
    `${VOTER_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${ONE_YEAR_SECONDS}`,
  ].join("; ");
}

/**
 * Server-side hash of the anonymous token. The raw cookie is never stored.
 * A secret is mixed in so the stored hash cannot be reversed from the cookie.
 */
export function voterHash(token: string, secret: string | undefined): Promise<string> {
  const salt = secret ?? "lff-dev-insecure-secret";
  return sha256Hex(`${salt}:${token}`);
}

export function isValidChoice(value: unknown): value is VoteChoice {
  return typeof value === "string" && VALID_CHOICES.includes(value as VoteChoice);
}

/** Normalise an optional ISO 3166-1 alpha-2 country code, or null. */
export function normalizeCountry(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

/** Normalise an optional handle: trim, strip disallowed chars, cap length. */
export function normalizeHandle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .trim()
    .replace(/[^A-Za-z0-9_.@-]/g, "")
    .slice(0, 30);
  return cleaned.length > 0 ? cleaned : null;
}

interface JsonInit {
  status?: number;
  cookie?: string;
}

/** JSON response helper with optional Set-Cookie + no-store caching. */
export function json(body: unknown, init: JsonInit = {}): Response {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  if (init.cookie) headers.append("Set-Cookie", init.cookie);
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers,
  });
}
