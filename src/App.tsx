import { useEffect, useState } from "react";
import VoteCard from "./components/VoteCard";
import ResultsCard from "./components/ResultsCard";
import Leaderboard from "./components/Leaderboard";
import ShareCard from "./components/ShareCard";
import SponsorBlock from "./components/SponsorBlock";
import Footer from "./components/Footer";
import Logo from "./components/Logo";
import { fetchResults } from "./lib/api";
import type { VoteResponse } from "./lib/api";
import { resolveSuggestedCountry } from "./lib/detectCountry";
import { choiceMeta, type Results } from "./lib/types";

export default function App() {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [justVoted, setJustVoted] = useState(false);
  const [suggestedCountry, setSuggestedCountry] = useState<string | null>(null);

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
  }

  const hasVoted = results?.userHasVoted ?? false;
  const userChoice = results?.userChoice ?? null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <div className="px-5 pt-5">
        <img
          src="/images/brand/poster.png"
          alt="Two halves. Not four ad breaks. World Cup matches are now paused twice a game for hydration, even in air-conditioned stadiums. Player safety matters. Blanket TV timeouts don't. Join the vote at LetFootballFlow.com."
          className="block w-full rounded-2xl shadow-card"
        />
      </div>

      <main className="flex flex-col gap-5 bg-paper px-5 pb-4 pt-5">
        {!hasVoted && (
          <VoteCard onResult={handleResult} suggestedCountry={suggestedCountry} />
        )}

        {hasVoted && userChoice && (
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

        {hasVoted && userChoice && <ShareCard choice={userChoice} />}

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

        <SponsorBlock />
      </main>

      <Footer />
    </div>
  );
}
