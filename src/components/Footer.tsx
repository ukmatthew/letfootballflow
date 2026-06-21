export default function Footer() {
  return (
    <footer className="px-5 pb-12 pt-8 text-center text-xs leading-relaxed text-ink-700/45">
      <div className="mx-auto mb-5 h-px w-24 bg-black/10" />
      <p className="font-semibold text-ink-700/70">
        Independent fan project. Not affiliated with FIFA or any tournament organiser.
      </p>
      <p className="mx-auto mt-3 max-w-md">
        Privacy: no accounts, no emails, no passwords, no precise location. We use one
        anonymous voting cookie to help prevent repeat voting and store only a hashed
        version of it. We never store your raw cookie or raw IP address, and we never
        sell personal data.
      </p>
      <p className="mt-4">
        Get in touch — general enquiries, press and partnerships:{" "}
        <a
          href="mailto:letfootballflow@gmail.com"
          className="font-semibold text-pitch-600 underline-offset-2 hover:underline"
        >
          letfootballflow@gmail.com
        </a>
      </p>
      <p className="mt-4">© {new Date().getFullYear()} Let Football Flow</p>
    </footer>
  );
}
