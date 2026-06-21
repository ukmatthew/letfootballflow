import BuyMeACoffee from "./BuyMeACoffee";

export default function SponsorBlock() {
  return (
    <section className="relative animate-fade-up overflow-hidden rounded-2xl bg-ink-900 p-6 text-white shadow-card">
      <div className="relative">
        <h2 className="text-lg font-bold">Help keep the fan vote online</h2>
        <p className="mt-2 text-sm text-white/80">
          If you like football that flows, support the project during the tournament.
        </p>

        <BuyMeACoffee />

        <div className="mt-5 rounded-xl border border-dashed border-white/25 bg-white/5 px-4 py-3 text-sm text-white/85">
          <p className="font-bold">Want to sponsor the Flow Meter?</p>
          <p className="mt-1 text-white/70">
            Perfect for water brands, sports drinks, fan media and football newsletters.
            This Flow Meter could be hydrated by you.
          </p>
        </div>
      </div>
    </section>
  );
}
