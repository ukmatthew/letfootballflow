export default function SituationOpinion() {
  return (
    <section className="space-y-3 px-2 pb-9 pt-4 animate-fade-up">
      <div className="relative bg-paper-gray bg-[length:100%_100%] bg-center bg-no-repeat px-6 py-6 sm:px-8">
        <div className="relative flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="badge-situation">Situation</span>
            <p className="mt-2.5 text-[15px] font-semibold leading-snug text-ink-900 sm:text-base">
              World Cup matches are now paused twice a game for &ldquo;hydration&rdquo;&mdash;even in
              air-conditioned stadiums
            </p>
          </div>
          <img
            src="/images/brand/bluemegaphone.png"
            alt=""
            aria-hidden
            className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
          />
        </div>
      </div>

      <div className="relative bg-paper-white bg-[length:100%_100%] bg-center bg-no-repeat px-6 py-6 sm:px-8">
        <div className="relative flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="badge-opinion">Opinion</span>
            <p className="mt-2.5 text-[15px] font-semibold leading-snug text-ink-900 sm:text-base">
              Player safety matters. Blanket TV timeouts don&rsquo;t.
            </p>
          </div>
          <img
            src="/images/brand/greenshield.png"
            alt=""
            aria-hidden
            className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
          />
        </div>
      </div>
    </section>
  );
}
