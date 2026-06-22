export type VoteChoice = "flow" | "breaks";

export interface CountryResult {
  countryCode: string;
  total: number;
  flowPercent: number;
}

export interface Results {
  poll: { id: string; title: string };
  totals: Record<VoteChoice, number>;
  totalVotes: number;
  countries: CountryResult[];
  userHasVoted: boolean;
  userChoice: VoteChoice | null;
  userCountryCode: string | null;
  suggestedCountry?: string | null;
}

export interface VotePayload {
  pollSlug: string;
  choice: VoteChoice;
  countryCode: string | null;
  handle: string | null;
  turnstileToken: string | null;
}

export interface ChoiceMeta {
  id: VoteChoice;
  emoji: string;
  title: string;
  subtitle: string;
  image: string;
  /** Tailwind colour accents per option. */
  accent: string;
  bar: string;
  ring: string;
}

export const CHOICES: ChoiceMeta[] = [
  {
    id: "flow",
    emoji: "🌊",
    title: "I'm voting to Let Football Flow",
    subtitle: "Hydration breaks only when conditions demand them.",
    image: "/images/footballer.png",
    accent: "ring-flow-300 bg-flow-50",
    bar: "bg-flow-500",
    ring: "border-flow-500",
  },
  {
    id: "breaks",
    emoji: "💧",
    title: "Keep Mandatory Breaks",
    subtitle:
      "Provide tactical resets for coaches and an inevitable shift toward a modern, four-quarter format.",
    image: "/images/hydrationbreak.png",
    accent: "ring-pitch-400 bg-emerald-50",
    bar: "bg-ink-800",
    ring: "border-ink-700",
  },
];

export function choiceMeta(id: VoteChoice | string): ChoiceMeta {
  return CHOICES.find((c) => c.id === id) ?? CHOICES[0];
}

export function choiceDisplayTitle(
  id: VoteChoice,
  submittedChoice: VoteChoice | null,
): string {
  const meta = choiceMeta(id);
  if (!submittedChoice) return meta.title;
  if (id === submittedChoice) {
    if (id === "flow") return "I voted for Let Football Flow";
    return "I voted for Keep Mandatory Breaks";
  }
  if (id === "flow") return "I didn't vote for Let Football Flow";
  return "I didn't vote for Keep Mandatory Breaks";
}
