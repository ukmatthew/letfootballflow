const BMC_URL = "https://www.buymeacoffee.com/letfootballflow";

/**
 * Direct link to the Buy Me a Coffee page, styled to match the requested
 * button (green, black outline/text, 💧 "Buy me a water"). We use a plain
 * link rather than BMC's button widget script, which doesn't reliably inject
 * its button inside a single-page app.
 */
export default function BuyMeACoffee() {
  return (
    <a
      href={BMC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-[#00c875] px-5 py-3 text-base font-bold text-black shadow-[0_2px_0_#000] transition hover:brightness-95 active:translate-y-px"
    >
      <span aria-hidden>💧</span>
      Buy me a water
    </a>
  );
}
