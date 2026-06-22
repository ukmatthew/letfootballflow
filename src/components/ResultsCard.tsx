import { CHOICES, type Results, type VoteChoice } from "../lib/types";

interface Props {
  results: Results;
}

const BAR_COLOR: Record<VoteChoice, string> = {
  flow: "bg-pitch-500",
  breaks: "bg-ink-600",
};

function pct(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

export default function ResultsCard({ results }: Props) {
  const { totals, totalVotes } = results;

  return (
    <section className="card animate-fade-up">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pitch-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Live
          </span>
          <h2 className="truncate text-base font-bold text-ink-900">Live Fan Vote</h2>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-ink-700/55">
          {totalVotes.toLocaleString()} votes cast
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        {CHOICES.map((c) => {
          const p = pct(totals[c.id], totalVotes);
          return (
            <div key={c.id}>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-paper">
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-ink-800">
                  {c.id === "flow" ? "Let Football Flow" : c.title}
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
    </section>
  );
}
