import { useEffect, useState } from "react";
import VoteCard from "./components/VoteCard";
import ResultsCard from "./components/ResultsCard";
import Leaderboard from "./components/Leaderboard";
import ShareCard from "./components/ShareCard";
import SponsorBlock from "./components/SponsorBlock";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import CountryPrompt, { hasSkippedCountry } from "./components/CountryPrompt";
import { fetchResults } from "./lib/api";
import type { VoteResponse } from "./lib/api";
import { resolveSuggestedCountry } from "./lib/detectCountry";
import { choiceMeta, type Results } from "./lib/types";

export default function App() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [justVoted, setJustVoted] = useState(false);
  const [suggestedCountry, setSuggestedCountry] = useState<string | null>(null);
  const [countrySkipped, setCountrySkippedState] = useState(hasSkippedCountry);

  useEffect(() => {
    fetchResults()
      .then((r) => {
        setResults(r);
        setSuggestedCountry(resolveSuggestedCountry(r.suggestedCountry));
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, []);

  function handleResult(res: VoteResponse) {
    setResults(res);
    setJustVoted(!res.alreadyVoted);
    setCountrySkippedState(false);
  }

  function handleCountryComplete(updated: Results) {
    setResults(updated);
    setCountrySkippedState(false);
  }

  function handleCountrySkip() {
    setCountrySkippedState(true);
  }

  const hasVoted = results?.userHasVoted ?? false;
  const userChoice = results?.userChoice ?? null;
  const userCountryCode = results?.userCountryCode ?? null;
  const showCountryPrompt =
    hasVoted && !userCountryCode && !countrySkipped;
  const dimResultsPanels = !hasVoted || showCountryPrompt;

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-paper">
      <div className="px-5 pt-5">
        <div className="rounded-2xl shadow-card">
          <img
            src="/images/brand/poster.png"
            alt="Two halves. Not four ad breaks. World Cup matches are now paused twice a game for hydration, even in air-conditioned stadiums. Player safety matters. Blanket TV timeouts don't. Join the vote at LetFootballFlow.com."
            className="relative z-10 block w-full"
          />

          <main className="hero-dark -mt-5 flex flex-col gap-5 rounded-b-2xl px-5 pb-4 pt-6">
            {!hasVoted && <VoteCard onResult={handleResult} />}

            {showCountryPrompt && userChoice && (
              <>
                <VoteCard onResult={handleResult} submittedChoice={userChoice} />
                <CountryPrompt
                  suggestedCountry={suggestedCountry}
                  onComplete={handleCountryComplete}
                  onSkip={handleCountrySkip}
                />
              </>
            )}

            {hasVoted && userChoice && !showCountryPrompt && (
              <section className="card animate-fade-up">
                <div className="flex items-center gap-4">
                  <img
                    src={choiceMeta(userChoice).image}
                    alt=""
                    className="h-24 w-24 shrink-0 object-contain"
                  />
                  <p className="text-base leading-snug text-ink-800">
                    {justVoted ? (
                      userChoice === "flow" ? (
                        <>
                          You have voted to{" "}
                          <span className="inline-flex flex-wrap items-center gap-1.5 font-bold">
                            <Logo className="h-7 w-7" />
                            <span>
                              Let Football <span className="text-pitch-500">Flow</span>
                            </span>
                          </span>
                        </>
                      ) : (
                        <>
                          You have voted to{" "}
                          <span className="font-bold text-pitch-600">Keep Mandatory Breaks</span>
                        </>
                      )
                    ) : userChoice === "flow" ? (
                      <>
                        You have already voted to{" "}
                        <span className="inline-flex flex-wrap items-center gap-1.5 font-bold">
                          <Logo className="h-7 w-7" />
                          <span>
                            Let Football <span className="text-pitch-500">Flow</span>
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        You have already voted to{" "}
                        <span className="font-bold text-pitch-600">Keep Mandatory Breaks</span>
                      </>
                    )}
                  </p>
                </div>
              </section>
            )}

            {hasVoted && userChoice && !showCountryPrompt && <ShareCard choice={userChoice} />}

            <div className="grid gap-5">
              <div
                className={`grid gap-5 transition-all duration-300 ${
                  dimResultsPanels ? "pointer-events-none scale-[0.98] opacity-40" : ""
                }`}
              >
                {loading ? (
                  <div className="card animate-pulse">
                    <div className="h-5 w-40 rounded-full bg-slate-100" />
                    <div className="mt-5 space-y-4">
                      <div className="h-3.5 w-full rounded-full bg-slate-100" />
                      <div className="h-3.5 w-5/6 rounded-full bg-slate-100" />
                      <div className="h-3.5 w-2/3 rounded-full bg-slate-100" />
                    </div>
                  </div>
                ) : results ? (
                  <>
                    <ResultsCard results={results} />
                    <Leaderboard countries={results.countries} />
                  </>
                ) : (
                  <div className="card text-sm text-slate-500">
                    Results are taking a breather. Please refresh in a moment.
                  </div>
                )}
              </div>

              <div
                className={`transition-all duration-300 ${
                  showCountryPrompt ? "pointer-events-none scale-[0.98] opacity-40" : ""
                }`}
              >
                <SponsorBlock />
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
