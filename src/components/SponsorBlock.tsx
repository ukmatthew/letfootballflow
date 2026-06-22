const CONTACT_EMAIL = "letfootballflow@gmail.com";

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

export default function SponsorBlock() {
  return (
    <section className="relative animate-fade-up overflow-hidden rounded-2xl bg-ink-900 p-6 text-white shadow-card">
      <div className="relative flex flex-col rounded-xl border border-flow-500/40 bg-white/[0.03] p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-flow-500/15 text-flow-400">
          <ChatIcon className="h-5 w-5" />
        </div>
        <h3 className="mt-3 text-sm font-bold">Get in touch</h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-white/65">
          For general enquiries, press, partnerships or feedback — we&apos;d love to hear from you.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-flow-500/50 px-3 py-2.5 text-xs font-semibold text-flow-400 transition hover:bg-flow-500/10"
        >
          <EnvelopeIcon className="h-3.5 w-3.5" />
          Email us
        </a>
      </div>
    </section>
  );
}
