const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** True on Vite dev server or when the page is opened on a local hostname (e.g. Wrangler :8788). */
export function isLocalDevHost(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  return LOCAL_HOSTS.has(window.location.hostname);
}

/** Whether the Turnstile widget should render and gate vote submission. */
export function turnstileRequired(): boolean {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
  const enabled = import.meta.env.VITE_TURNSTILE_ENABLED;
  if (enabled === "false" || enabled === "0") return false;
  return !isLocalDevHost() && siteKey.length > 0;
}
