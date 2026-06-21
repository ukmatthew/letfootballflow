/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloudflare Turnstile site key. Leave empty to disable the widget in dev. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  turnstile?: {
    render: (
      el: HTMLElement,
      opts: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "flexible" | "compact";
      },
    ) => string;
    reset: (id?: string) => void;
    remove: (id?: string) => void;
  };
}
