import { useCallback, useEffect, useState } from "react";
import { isUkDetected } from "../lib/countries";
import { CHOICES, type VoteChoice } from "../lib/types";
import { ApiError, submitVote, type VoteResponse } from "../lib/api";
import CountrySelect from "./CountrySelect";
import Turnstile from "./Turnstile";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

interface Props {
  onResult: (res: VoteResponse) => void;
  suggestedCountry?: string | null;
}

export default function VoteCard({ onResult, suggestedCountry }: Props) {
  const [choice, setChoice] = useState<VoteChoice | null>(null);
  const [country, setCountry] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!suggestedCountry || isUkDetected(suggestedCountry) || country) return;
    setCountry(suggestedCountry);
  }, [suggestedCountry, country]);

  const handleToken = useCallback((t: string | null) => setToken(t), []);

  const needsTurnstile = SITE_KEY.length > 0;
  const canSubmit = choice !== null && !submitting && (!needsTurnstile || !!token);

  async function onSubmit() {
    if (!choice) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitVote({
        pollSlug: "global",
        choice,
        countryCode: country || null,
        handle: null,
        turnstileToken: token,
      });
      onResult(res);
    } catch (err) {
      if (err instanceof ApiError && err.code === "turnstile-failed") {
        setError("Verification expired. Please tick the box again.");
        setToken(null);
      } else {
        setError("Something went wrong sending your vote. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="animate-fade-up">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-700/50">
        Cast your vote
      </p>

      <div className="grid gap-3">
        {CHOICES.map((c) => {
          const selected = choice === c.id;
          const faded = choice !== null && !selected;

          return (
            <div
              key={c.id}
              className={`transition-all duration-300 ${faded ? "scale-[0.98] opacity-40" : "opacity-100"} ${selected ? "relative z-10" : ""}`}
            >
              <button
                type="button"
                onClick={() => {
                  setChoice(c.id);
                  setError(null);
                }}
                aria-pressed={selected}
                className={`group relative w-full overflow-hidden rounded-2xl border-2 bg-white text-left shadow-card transition-all duration-200 active:scale-[0.99] ${
                  selected ? "border-pitch-500 shadow-paper" : "border-black/5 hover:border-black/10"
                }`}
              >
                <div className="relative flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5">
                  <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                    <img
                      src={c.image}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink-900 sm:text-base">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-ink-700/60 sm:text-sm">
                      {c.subtitle}
                    </span>
                  </span>

                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[2.5px] transition sm:h-10 sm:w-10 ${
                      selected ? `${c.ring} bg-white` : `${c.ring} bg-white group-hover:bg-slate-50`
                    }`}
                    aria-hidden
                  >
                    {selected && <span className={`h-4 w-4 rounded-full ${c.bar}`} />}
                  </span>
                </div>
              </button>

              {selected && (
                <div className="mt-3 grid animate-fade-up gap-4 px-0.5">
                  <CountrySelect
                    value={country}
                    onChange={setCountry}
                    suggestedCountry={suggestedCountry}
                  />

                  {needsTurnstile && (
                    <Turnstile siteKey={SITE_KEY} onToken={handleToken} />
                  )}

                  {error && (
                    <p
                      className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={onSubmit}
                    aria-label={submitting ? "Submitting vote" : "Submit vote"}
                    aria-busy={submitting}
                    className="brush-btn-submit disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="sr-only">
                      {submitting ? "Submitting…" : "Submit vote"}
                    </span>
                    {submitting && (
                      <span
                        className="absolute inset-0 flex items-center justify-center text-base font-bold text-white"
                        aria-hidden
                      >
                        Submitting…
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
