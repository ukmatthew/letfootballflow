import { useEffect, useState } from "react";
import { isUkDetected } from "../lib/countries";
import { ApiError, fetchResults, updateVoteCountry } from "../lib/api";
import type { Results } from "../lib/types";
import CountrySelect from "./CountrySelect";

const SKIP_KEY = "lff_country_skipped";

export function hasSkippedCountry(): boolean {
  try {
    return localStorage.getItem(SKIP_KEY) === "1";
  } catch {
    return false;
  }
}

export function setCountrySkipped(skipped: boolean): void {
  try {
    if (skipped) localStorage.setItem(SKIP_KEY, "1");
    else localStorage.removeItem(SKIP_KEY);
  } catch {
    // ignore
  }
}

interface Props {
  suggestedCountry?: string | null;
  onComplete: (results: Results) => void;
  onSkip: () => void;
}

export default function CountryPrompt({ suggestedCountry, onComplete, onSkip }: Props) {
  const [country, setCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!suggestedCountry || isUkDetected(suggestedCountry) || country) return;
    setCountry(suggestedCountry);
  }, [suggestedCountry, country]);

  async function onAddCountry() {
    if (!country) return;
    setSubmitting(true);
    setError(null);
    try {
      const results = await updateVoteCountry({ pollSlug: "global", countryCode: country });
      setCountrySkipped(false);
      onComplete(results);
    } catch (err) {
      if (err instanceof ApiError && err.code === "country-already-set") {
        onComplete(await fetchResults());
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    setCountrySkipped(true);
    onSkip();
  }

  return (
    <section className="card relative z-10 animate-fade-up p-4 sm:p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-pitch-600">
        Optional
      </p>
      <h2 className="mt-1 text-base font-bold text-ink-900">Where are you voting from?</h2>
      <p className="mt-1 text-sm text-ink-700/55">Add your country to the live leaderboard.</p>

      <div className="mt-3">
        <CountrySelect
          value={country}
          onChange={setCountry}
          suggestedCountry={suggestedCountry}
          label="Your country"
          showOptional={false}
        />
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          disabled={!country || submitting}
          onClick={onAddCountry}
          className="rounded-full bg-pitch-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-pitch-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Add country"}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm font-semibold text-ink-700/45 transition hover:text-ink-700/70"
        >
          Skip
        </button>
      </div>
    </section>
  );
}
