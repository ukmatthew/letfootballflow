import type { Env } from "../../shared/types";
import { getPollBySlug, getResults } from "../../shared/db";
import { detectSuggestedRegion } from "../../shared/countries";
import { json, readCookie, voterHash } from "../../shared/util";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("poll") ?? "global";

  const poll = await getPollBySlug(env.DB, slug);
  if (!poll) return json({ ok: false, error: "poll-not-found" }, { status: 404 });

  const token = readCookie(request, "lff_voter");
  const hash = token ? await voterHash(token, env.VOTER_HASH_SECRET) : null;

  const results = await getResults(env.DB, poll, hash);
  const suggestedCountry = detectSuggestedRegion(request.headers.get("CF-IPCountry"));

  return json({ ok: true, suggestedCountry, ...results });
};
