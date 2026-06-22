import type { CountryUpdateRequestBody, Env } from "../../../shared/types";
import { getPollBySlug, getResults, updateVoteCountry } from "../../../shared/db";
import { isKnownCountryCode } from "../../../shared/countries";
import { json, normalizeCountry, readCookie, voterHash } from "../../../shared/util";

export const onRequestPatch: PagesFunction<Env> = async ({ request, env }) => {
  let body: CountryUpdateRequestBody;
  try {
    body = (await request.json()) as CountryUpdateRequestBody;
  } catch {
    return json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const countryCode = normalizeCountry(body.countryCode);
  if (!countryCode || !isKnownCountryCode(countryCode)) {
    return json({ ok: false, error: "invalid-country" }, { status: 400 });
  }

  const poll = await getPollBySlug(env.DB, body.pollSlug ?? "global");
  if (!poll) return json({ ok: false, error: "poll-not-found" }, { status: 404 });

  const token = readCookie(request, "lff_voter");
  if (!token) {
    return json({ ok: false, error: "no-vote" }, { status: 404 });
  }

  const hash = await voterHash(token, env.VOTER_HASH_SECRET);
  const outcome = await updateVoteCountry(env.DB, poll.id, hash, countryCode);

  if (outcome === "no-vote") {
    return json({ ok: false, error: "no-vote" }, { status: 404 });
  }
  if (outcome === "already-set") {
    return json({ ok: false, error: "country-already-set" }, { status: 409 });
  }

  const results = await getResults(env.DB, poll, hash);
  return json({ ok: true, ...results });
};
