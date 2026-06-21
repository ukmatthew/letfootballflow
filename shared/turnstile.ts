import type { Env } from "./types";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  /** Reason for failure, e.g. "missing-token" or "timeout-or-duplicate". */
  error?: string;
}

/**
 * Verify a Turnstile token server-side. The client IP is sent to Cloudflare for
 * verification only — it is never stored. When TURNSTILE_REQUIRED is off and no
 * secret is configured (local dev), verification is skipped.
 */
export async function verifyTurnstile(
  env: Env,
  token: string | null | undefined,
  remoteIp: string | null,
): Promise<TurnstileResult> {
  const required = env.TURNSTILE_REQUIRED === "1";
  const secret = env.TURNSTILE_SECRET_KEY;

  if (!required && !secret) return { ok: true };
  if (!secret) return { ok: false, error: "server-misconfigured" };
  if (!token) return { ok: false, error: "missing-token" };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body: form });
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return { ok: true };
    return { ok: false, error: data["error-codes"]?.[0] ?? "verification-failed" };
  } catch {
    return { ok: false, error: "verification-unreachable" };
  }
}
