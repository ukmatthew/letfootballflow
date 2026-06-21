import type { Env, VoteRequestBody } from "../../shared/types";
import { getPollBySlug, getResults, insertVote } from "../../shared/db";
import {
  getOrCreateVoterToken,
  isValidChoice,
  json,
  normalizeCountry,
  normalizeHandle,
  voterCookieHeader,
  voterHash,
} from "../../shared/util";
import { verifyTurnstile } from "../../shared/turnstile";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: VoteRequestBody;
  try {
    body = (await request.json()) as VoteRequestBody;
  } catch {
    return json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!isValidChoice(body.choice)) {
    return json({ ok: false, error: "invalid-choice" }, { status: 400 });
  }

  const poll = await getPollBySlug(env.DB, body.pollSlug ?? "global");
  if (!poll) return json({ ok: false, error: "poll-not-found" }, { status: 404 });

  // Verify Turnstile (IP is used only for verification, never stored).
  const remoteIp = request.headers.get("CF-Connecting-IP");
  const turnstile = await verifyTurnstile(env, body.turnstileToken, remoteIp);
  if (!turnstile.ok) {
    return json(
      { ok: false, error: "turnstile-failed", reason: turnstile.error },
      { status: 403 },
    );
  }

  const { token, isNew } = getOrCreateVoterToken(request);
  const hash = await voterHash(token, env.VOTER_HASH_SECRET);
  const cookie = isNew ? voterCookieHeader(token) : undefined;

  const inserted = await insertVote(env.DB, {
    pollId: poll.id,
    choice: body.choice,
    countryCode: normalizeCountry(body.countryCode),
    handle: normalizeHandle(body.handle),
    voterHash: hash,
  });

  const results = await getResults(env.DB, poll, hash);

  if (!inserted) {
    return json(
      {
        ok: true,
        alreadyVoted: true,
        message: "You have already voted in this poll.",
        ...results,
      },
      { cookie },
    );
  }

  return json({ ok: true, alreadyVoted: false, ...results }, { cookie });
};
