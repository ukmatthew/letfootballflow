import type { CountryResult, Poll, ResultsPayload, VoteChoice } from "./types";
import { isValidChoice } from "./util";

const COUNTRY_MIN_VOTES = 5; // hide tiny samples from the leaderboard
const COUNTRY_LIMIT = 10;

export async function getPollBySlug(
  db: D1Database,
  slug: string,
): Promise<Poll | null> {
  const row = await db
    .prepare("SELECT id, slug, title, description FROM polls WHERE slug = ? AND status = 'active'")
    .bind(slug)
    .first<Poll>();
  return row ?? null;
}

/**
 * Insert a vote. Returns true if inserted, false if this voter already voted
 * (the UNIQUE(poll_id, voter_hash) constraint causes OR IGNORE to skip it).
 */
export async function insertVote(
  db: D1Database,
  vote: {
    pollId: string;
    choice: VoteChoice;
    countryCode: string | null;
    handle: string | null;
    voterHash: string;
  },
): Promise<boolean> {
  const result = await db
    .prepare(
      `INSERT OR IGNORE INTO votes (id, poll_id, choice, country_code, handle, voter_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      crypto.randomUUID(),
      vote.pollId,
      vote.choice,
      vote.countryCode,
      vote.handle,
      vote.voterHash,
    )
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function getTotals(
  db: D1Database,
  pollId: string,
): Promise<{ totals: Record<VoteChoice, number>; totalVotes: number }> {
  const { results } = await db
    .prepare("SELECT choice, COUNT(*) AS n FROM votes WHERE poll_id = ? GROUP BY choice")
    .bind(pollId)
    .all<{ choice: string; n: number }>();

  const totals: Record<VoteChoice, number> = { flow: 0, breaks: 0 };
  let totalVotes = 0;
  for (const row of results ?? []) {
    totalVotes += row.n;
    if (row.choice === "flow" || row.choice === "breaks") totals[row.choice] = row.n;
  }
  return { totals, totalVotes };
}

async function getCountryLeaderboard(
  db: D1Database,
  pollId: string,
): Promise<CountryResult[]> {
  const { results } = await db
    .prepare(
      `SELECT country_code AS countryCode,
              COUNT(*) AS total,
              SUM(CASE WHEN choice = 'flow' THEN 1 ELSE 0 END) AS flowVotes
       FROM votes
       WHERE poll_id = ? AND country_code IS NOT NULL
       GROUP BY country_code
       HAVING total >= ?
       ORDER BY (CAST(flowVotes AS REAL) / total) DESC, total DESC
       LIMIT ?`,
    )
    .bind(pollId, COUNTRY_MIN_VOTES, COUNTRY_LIMIT)
    .all<{ countryCode: string; total: number; flowVotes: number }>();

  return (results ?? []).map((r) => ({
    countryCode: r.countryCode,
    total: r.total,
    flowPercent: Math.round((r.flowVotes / r.total) * 100),
  }));
}

async function getUserVote(
  db: D1Database,
  pollId: string,
  voterHash: string,
): Promise<string | null> {
  const row = await db
    .prepare("SELECT choice FROM votes WHERE poll_id = ? AND voter_hash = ?")
    .bind(pollId, voterHash)
    .first<{ choice: string }>();
  return row?.choice ?? null;
}

export async function getResults(
  db: D1Database,
  poll: Poll,
  voterHash: string | null,
): Promise<ResultsPayload> {
  const [{ totals, totalVotes }, countries, rawUserChoice] = await Promise.all([
    getTotals(db, poll.id),
    getCountryLeaderboard(db, poll.id),
    voterHash ? getUserVote(db, poll.id, voterHash) : Promise.resolve(null),
  ]);

  const userChoice = isValidChoice(rawUserChoice) ? rawUserChoice : null;

  return {
    poll: { id: poll.id, title: poll.title },
    totals,
    totalVotes,
    countries,
    userHasVoted: rawUserChoice !== null,
    userChoice,
  };
}
