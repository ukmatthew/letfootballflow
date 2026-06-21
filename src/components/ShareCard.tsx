import { useState } from "react";
import type { VoteChoice } from "../lib/types";
import { SHARE_PLATFORMS, shareCta, shareMessage, shareText, type SharePlatformId } from "../lib/share";

interface Props {
  choice: VoteChoice;
}

function ShareIcon({ id }: { id: SharePlatformId }) {
  const cls = "h-5 w-5";

  switch (id) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 18.15c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.19.84.85-3.11-.2-.32a8.2 8.2 0 01-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23s-3.69 8.23-8.23 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28" />
        </svg>
      );
  }
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

export default function ShareCard({ choice }: Props) {
  const [copied, setCopied] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<SharePlatformId | null>(null);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(shareMessage(choice));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }

  async function copyShare(platformId: SharePlatformId) {
    try {
      await navigator.clipboard.writeText(shareMessage(choice));
      setCopiedPlatform(platformId);
      setTimeout(() => setCopiedPlatform(null), 2000);
      return true;
    } catch {
      setCopiedPlatform(null);
      return false;
    }
  }

  async function copyThenOpenShare(
    platformId: SharePlatformId,
    href: string | ((choice: VoteChoice) => string),
  ) {
    await copyShare(platformId);
    const url = typeof href === "function" ? href(choice) : href;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="card animate-fade-up bg-[#f1f1ef]">
      <h2 className="text-lg font-bold text-ink-800">Spread the word. Change the game.</h2>

      <div className="relative mt-4 rounded-2xl border border-black/5 bg-white px-5 py-6 shadow-card">
        <span className="text-5xl font-bold leading-none text-flow-500" aria-hidden>
          &ldquo;
        </span>
        <blockquote className="mt-1 text-sm leading-relaxed text-ink-800">
          {shareText(choice)}
        </blockquote>
        <img
          src="/images/brand/jointhevote.png"
          alt={shareCta()}
          className="brush-cta-vote mt-4"
        />
      </div>

      <button
        type="button"
        onClick={copyMessage}
        aria-label={copied ? "Copied" : "Copy my message"}
        className="brush-btn-copy mt-4"
      >
        {copied && (
          <span className="absolute inset-0 grid place-items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
            <span className="inline-flex items-center gap-2">
              Copied!
              <CopyIcon className="h-4 w-4" />
            </span>
          </span>
        )}
      </button>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {SHARE_PLATFORMS.map((platform) => {
          const platformCopied = copiedPlatform === platform.id;
          const baseClass =
            "grid h-12 w-12 place-items-center rounded-full shadow-sm transition active:scale-95";

          if (platform.copyThenHref) {
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => copyThenOpenShare(platform.id, platform.copyThenHref!)}
                aria-label={platform.label}
                title={platformCopied ? "Copied — paste into your post" : platform.label}
                className={`${baseClass} ${platform.className}`}
              >
                {platformCopied ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <ShareIcon id={platform.id} />
                )}
              </button>
            );
          }

          if (platform.copy) {
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => copyShare(platform.id)}
                aria-label={platform.label}
                title={platformCopied ? "Copied!" : platform.label}
                className={`${baseClass} ${platform.className}`}
              >
                {platformCopied ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <ShareIcon id={platform.id} />
                )}
              </button>
            );
          }

          return (
            <a
              key={platform.id}
              href={platform.href!(choice)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.label}
              title={platform.label}
              className={`${baseClass} ${platform.className}`}
            >
              <ShareIcon id={platform.id} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
