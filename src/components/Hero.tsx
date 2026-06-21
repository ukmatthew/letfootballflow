export default function Hero() {
  return (
    <section className="px-5 pb-2 pt-5 text-center animate-fade-up">
      <h2 className="headline-display text-[2.5rem] leading-none text-white sm:text-[3.25rem]">
        Two halves.
      </h2>
      <div className="relative mx-auto mt-2 inline-block max-w-full">
        <p className="headline-display relative z-10 text-[2.5rem] leading-none text-pitch-500 sm:text-[3.25rem]">
          Not four ad breaks.
        </p>
        <div
          className="pointer-events-none absolute -bottom-1 left-1/2 z-0 h-3 w-[108%] -translate-x-1/2 bg-green-brush bg-contain bg-center bg-no-repeat sm:-bottom-2 sm:h-4"
          aria-hidden
        />
      </div>
    </section>
  );
}
