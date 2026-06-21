#!/usr/bin/env node
/**
 * Seed the local D1 database with test votes for UI development.
 * Safe to re-run: removes previous seed votes (voter_hash LIKE 'seed-%') first.
 *
 * Usage: npm run db:seed:local
 *        node scripts/seed-local-votes.mjs --count=150
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const POLL_ID = "global-2026";
const DEFAULT_COUNT = 100;

/** [countryCode, voteCount] — weighted so the leaderboard has several countries. */
const COUNTRY_WEIGHTS = [
  ["EN", 14],
  ["US", 12],
  ["BR", 10],
  ["DE", 9],
  ["ES", 8],
  ["FR", 8],
  ["AR", 7],
  ["MX", 6],
  ["SX", 6],
  ["WL", 5],
  ["NI", 5],
  ["IT", 5],
  ["NL", 4],
  ["PT", 4],
  ["NG", 4],
  ["JP", 3],
  ["KR", 3],
  ["AU", 3],
  ["CA", 3],
  ["BE", 2],
  ["SA", 2],
  ["SN", 2],
  ["HR", 2],
  ["UY", 2],
  ["GH", 2],
  ["CM", 2],
  ["IE", 2],
  ["TR", 2],
  ["SE", 2],
  ["CH", 2],
];

/** Slight pro-flow skew so results look interesting. */
const CHOICE_WEIGHTS = [
  ["flow", 58],
  ["breaks", 42],
];

function parseCount(argv) {
  const flag = argv.find((a) => a.startsWith("--count="));
  if (!flag) return DEFAULT_COUNT;
  const n = Number.parseInt(flag.split("=")[1], 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_COUNT;
}

function pickWeighted(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [value, weight] of pairs) {
    r -= weight;
    if (r <= 0) return value;
  }
  return pairs[pairs.length - 1][0];
}

function buildVoteRows(targetCount) {
  const rows = [];
  let i = 0;

  for (const [country, n] of COUNTRY_WEIGHTS) {
    for (let c = 0; c < n && rows.length < targetCount; c++) {
      rows.push({
        id: crypto.randomUUID(),
        choice: pickWeighted(CHOICE_WEIGHTS),
        country,
        voterHash: `seed-${String(i++).padStart(4, "0")}`,
      });
    }
  }

  while (rows.length < targetCount) {
    rows.push({
      id: crypto.randomUUID(),
      choice: pickWeighted(CHOICE_WEIGHTS),
      country: pickWeighted(COUNTRY_WEIGHTS.map(([code]) => [code, 1])),
      voterHash: `seed-${String(i++).padStart(4, "0")}`,
    });
  }

  return rows.slice(0, targetCount);
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

function main() {
  const count = parseCount(process.argv.slice(2));
  const rows = buildVoteRows(count);

  const statements = [
    `DELETE FROM votes WHERE poll_id = '${POLL_ID}' AND voter_hash LIKE 'seed-%';`,
    ...rows.map(
      (r) =>
        `INSERT INTO votes (id, poll_id, choice, country_code, handle, voter_hash) VALUES ('${sqlEscape(r.id)}', '${POLL_ID}', '${r.choice}', '${r.country}', NULL, '${r.voterHash}');`,
    ),
  ];

  const sqlPath = join(tmpdir(), `lff-seed-${Date.now()}.sql`);
  writeFileSync(sqlPath, statements.join("\n") + "\n", "utf8");

  console.log(`Seeding ${rows.length} test votes into local D1 (poll: ${POLL_ID})…`);

  try {
    execSync(`npx wrangler d1 execute lff_db --local --file="${sqlPath}"`, {
      stdio: "inherit",
      cwd: ROOT,
    });
    console.log("Done. Refresh http://127.0.0.1:8788 to see results.");
  } finally {
    unlinkSync(sqlPath);
  }
}

main();
