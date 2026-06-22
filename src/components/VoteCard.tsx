import { useCallback, useState } from "react";
import { CHOICES, choiceDisplayTitle, type VoteChoice } from "../lib/types";
import { ApiError, submitVote, type VoteResponse } from "../lib/api";
import { turnstileRequired } from "../lib/env";
import Turnstile from "./Turnstile";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
const needsTurnstile = turnstileRequired();

const AVATAR_COLORS = ["bg-flow-400", "bg-pitch-400", "bg-emerald-400"];

interface Props {
  onResult: (res: VoteResponse) => void;
  /** When set, shows a read-only "vote cast" state instead of the submit button. */
  submittedChoice?: VoteChoice | null;
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SocialProof() {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex -space-x-2" aria-hidden>
        {AVATAR_COLORS.map((color, i) => (
          <span
            key={color}
            className={`inline-block h-7 w-7 rounded-full border-2 border-ink-900 ${color}`}
            style={{ zIndex: AVATAR_COLORS.length - i }}
          />
        ))}
      </div>
      <p className="text-sm text-white/65">
        Join the live fan vote in{" "}
        <span className="font-bold text-pitch-400">2 seconds</span>.
      </p>
    </div>
  );
}

export default function VoteCard({ onResult, submittedChoice = null }: Props) {
  const isSubmitted = submittedChoice !== null;
  const [choice, setChoice] = useState<VoteChoice | null>(submittedChoice ?? "flow");
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToken = useCallback((t: string | null) => setToken(t), []);

  const canSubmit = choice !== null && !submitting && (!needsTurnstile || !!token);

  async function onSubmit() {
    if (!choice) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitVote({
        pollSlug: "global",
        choice,
        countryCode: null,
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
      <div className={isSubmitted ? "opacity-40 transition-opacity duration-300" : ""}>
        <div className="badge-vote-now">
          <LightningIcon className="h-3.5 w-3.5" />
          Vote now
        </div>

        <h2 className="mt-4 text-xl font-bold leading-snug text-white sm:text-2xl">
          Should football stay two halves, not four quarters?
        </h2>

        <SocialProof />
      </div>

      <div className="grid gap-3">
        {CHOICES.map((c) => {
          const selected = choice === c.id;
          const faded = choice !== null && !selected;

          return (
            <div
              key={c.id}
              className={`relative w-full overflow-hidden rounded-2xl border-2 bg-white text-left shadow-card transition-all duration-200 ${
                faded ? "scale-[0.99] opacity-80" : "opacity-100"
              } ${selected ? "border-pitch-500 shadow-paper" : "border-black/5"}`}
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
                    {choiceDisplayTitle(c.id, submittedChoice)}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-700/60 sm:text-sm">
                    {c.subtitle}
                  </span>
                </span>

                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-[2.5px] transition sm:h-10 sm:w-10 ${
                    selected
                      ? "border-pitch-500 bg-white"
                      : "border-ink-700/20 bg-white"
                  }`}
                  aria-hidden
                >
                  {selected && <span className="h-4 w-4 rounded-full bg-pitch-500" />}
                </span>
              </div>
              {!isSubmitted && (
                <button
                  type="button"
                  onClick={() => {
                    setChoice(c.id);
                    setError(null);
                  }}
                  aria-pressed={selected}
                  className="absolute inset-0 cursor-pointer"
                >
                  <span className="sr-only">{c.title}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {choice !== null && (
        <div className="mt-5 grid animate-fade-up gap-4">
          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2 rounded-full border border-pitch-500/30 bg-pitch-500/10 px-5 py-3.5 text-sm font-bold text-pitch-400 opacity-40 transition-opacity duration-300">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-pitch-500 text-white" aria-hidden>
                ✓
              </span>
              Vote cast
            </div>
          ) : (
            <>
              {needsTurnstile && <Turnstile siteKey={SITE_KEY} onToken={handleToken} />}

              {error && (
                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={!canSubmit}
                onClick={onSubmit}
                aria-busy={submitting}
                className="btn-vote-primary"
              >
                <span>{submitting ? "Submitting…" : "Cast my vote"}</span>
                <span className="btn-vote-primary-icon">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-white/45">
                <LockIcon className="h-3.5 w-3.5 shrink-0" />
                Takes <span className="font-semibold text-white/65">2 seconds</span>. No sign-up
                required.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
