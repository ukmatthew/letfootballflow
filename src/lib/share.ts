import type { VoteChoice } from "./types";

export const SITE_URL = "https://letfootballflow.com";

export function shareText(choice: VoteChoice): string {
  if (choice === "flow") {
    return "I voted: Two halves. Not four ad breaks. Football needs player safety — not blanket TV timeouts.";
  }
  return "I voted: Keep Mandatory Breaks.\nJoin the vote: LetFootballFlow.com";
}

export function shareCta(): string {
  return "Join the vote: LetFootballFlow.com";
}

/** Always use the public site URL when sharing (not localhost). */
export function shareUrl(): string {
  return SITE_URL;
}

export function shareMessage(choice: VoteChoice): string {
  if (choice === "flow") {
    return `${shareText(choice)}\n${shareCta()}`;
  }
  return shareText(choice);
}

/** Facebook no longer accepts pre-filled text; opens the share dialog for the site URL only. */
export function facebookShareUrl(): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`;
}

export function xShareUrl(choice: VoteChoice): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage(choice))}`;
}

export function whatsappShareUrl(choice: VoteChoice): string {
  return `https://wa.me/?text=${encodeURIComponent(shareMessage(choice))}`;
}

/** @deprecated use xShareUrl */
export const twitterIntent = xShareUrl;

/** @deprecated use whatsappShareUrl */
export const whatsappIntent = whatsappShareUrl;

export type SharePlatformId = "facebook" | "instagram" | "x" | "whatsapp";

export interface SharePlatform {
  id: SharePlatformId;
  label: string;
  /** Opens a share window. */
  href?: (choice: VoteChoice) => string;
  /** Copies message to clipboard (Instagram has no web share URL). */
  copy?: boolean;
  /** Copies message, then opens a share window (Facebook ignores pre-filled text). */
  copyThenHref?: string | ((choice: VoteChoice) => string);
  className: string;
}

export const SHARE_PLATFORMS: SharePlatform[] = [
  {
    id: "facebook",
    label: "Copy message and share on Facebook",
    copyThenHref: facebookShareUrl,
    className: "bg-[#1877F2] text-white hover:bg-[#166fe5]",
  },
  {
    id: "instagram",
    label: "Copy link for Instagram",
    copy: true,
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:opacity-90",
  },
  {
    id: "x",
    label: "Share on X",
    href: xShareUrl,
    className: "bg-ink-900 text-white hover:bg-ink-800",
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    href: whatsappShareUrl,
    className: "bg-[#25D366] text-white hover:bg-[#20bd5a]",
  },
];
