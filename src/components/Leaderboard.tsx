import type { CountryResult } from "../lib/types";
import { countryName } from "../lib/countries";
import FlagIcon from "./FlagIcon";

interface Props {
  countries: CountryResult[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ countries }: Props) {
  return (
    <section className="card animate-fade-up">
      <h2 className="text-base font-bold text-ink-900">Most pro-flow countries</h2>

      {countries.length === 0 ? (
        <p className="mt-3 text-sm text-ink-700/55">
          Not enough votes yet — be the first to put your country on the board.
        </p>
      ) : (
        <ol className="mt-4 space-y-2">
          {countries.map((c, i) => (
            <li
              key={c.countryCode}
              className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#fafafa] px-3 py-2.5 transition hover:border-pitch-500/20"
            >
              <span className="w-6 text-center text-sm font-bold tabular-nums text-ink-700/40">
                {MEDALS[i] ?? i + 1}
              </span>
              <FlagIcon code={c.countryCode} />
              <span className="min-w-0 flex-1 truncate font-semibold text-ink-700">
                {countryName(c.countryCode)}
              </span>
              <span className="hidden text-xs tabular-nums text-ink-700/40 sm:inline">
                {c.total.toLocaleString()} votes
              </span>
              <span className="inline-flex items-center rounded-full bg-pitch-500/10 px-2.5 py-1 text-sm font-bold tabular-nums text-pitch-700">
                {c.flowPercent}%
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
