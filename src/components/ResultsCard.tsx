import { CHOICES, type Results, type VoteChoice } from "../lib/types";

interface Props {
  results: Results;
}

const BAR_COLOR: Record<VoteChoice, string> = {
  flow: "bg-flow-500",
  breaks: "bg-pitch-500",
};

function pct(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

export default function ResultsCard({ results }: Props) {
  const { totals, totalVotes } = results;
  const leading = CHOICES.reduce((a, b) => (totals[b.id] > totals[a.id] ? b : a));

  return (
    <section className="card animate-fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink-900">Global Flow Meter</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pitch-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pitch-700">
          <span className="h-1.5 w-1.5 rounded-full bg-pitch-500" />
          Live fan vote
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        {CHOICES.map((c) => {
          const p = pct(totals[c.id], totalVotes);
          const isLeading = totalVotes > 0 && c.id === leading.id;
          return (
            <div key={c.id}>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-paper">
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-ink-800">
                  {c.title}
                  {isLeading && (
                    <span className="ml-2 inline-flex rounded-md bg-pitch-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-pitch-700">
                      Leading
                    </span>
                  )}
                </span>
                <span className="font-bold tabular-nums text-ink-900">{p}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5">
                <div
                  className={`h-full animate-grow-bar rounded-full ${BAR_COLOR[c.id]}`}
                  style={{ width: `${p}%` }}
                  role="progressbar"
                  aria-valuenow={p}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={c.title}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-black/5 pt-4 text-xs text-ink-700/55">
        Votes cast:{" "}
        <span className="font-bold tabular-nums text-ink-800">
          {totalVotes.toLocaleString()}
        </span>
      </div>
    </section>
  );
}
