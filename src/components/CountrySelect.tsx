import { useEffect, useId, useRef, useState } from "react";
import type { Country } from "../lib/countries";
import { countryName, partitionCountries } from "../lib/countries";
import FlagIcon from "./FlagIcon";

interface Props {
  value: string;
  onChange: (code: string) => void;
  suggestedCountry?: string | null;
}

type ListItem =
  | { kind: "option"; code: string; label: string }
  | { kind: "separator" };

function buildItems(
  ukNations: Country[],
  suggested: Country | null,
  rest: Country[],
): ListItem[] {
  const items: ListItem[] = [];

  for (const c of ukNations) {
    items.push({ kind: "option", code: c.code, label: c.name });
  }
  if (ukNations.length > 0) items.push({ kind: "separator" });

  if (suggested) {
    items.push({
      kind: "option",
      code: suggested.code,
      label: `${suggested.name} (near you)`,
    });
    items.push({ kind: "separator" });
  }

  for (const c of rest) {
    items.push({ kind: "option", code: c.code, label: c.name });
  }

  return items;
}

export default function CountrySelect({ value, onChange, suggestedCountry }: Props) {
  const { ukNations, suggested, rest } = partitionCountries(suggestedCountry);
  const items = buildItems(ukNations, suggested, rest);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-700/80">Represent your country</span>
      <span className="ml-1 text-xs text-ink-700/40">(optional)</span>
      <div ref={rootRef} className={`relative mt-1.5 ${open ? "z-50" : ""}`}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 py-3 pr-10 text-left text-base text-ink-800 shadow-sm transition focus:border-pitch-500 focus:outline-none focus:ring-4 focus:ring-pitch-500/10"
        >
          {value ? (
            <>
              <FlagIcon code={value} />
              <span className="min-w-0 truncate">{countryName(value)}</span>
            </>
          ) : (
            <>
              <span className="text-lg" aria-hidden>
                🌍
              </span>
              <span className="text-ink-700/55">Choose a country…</span>
            </>
          )}
        </button>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white py-1 shadow-card"
          >
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ""}
                onClick={() => select("")}
                className={`flex w-full items-center gap-2.5 bg-white px-4 py-2.5 text-left text-base transition hover:bg-pitch-500/5 ${
                  value === "" ? "bg-pitch-500/10 font-semibold text-ink-900" : "text-ink-800"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  🌍
                </span>
                Choose a country…
              </button>
            </li>
            {items.map((item, i) =>
              item.kind === "separator" ? (
                <li key={`sep-${i}`} role="presentation" className="my-1 border-t border-black/5" />
              ) : (
                <li key={item.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === item.code}
                    onClick={() => select(item.code)}
                    className={`flex w-full items-center gap-2.5 bg-white px-4 py-2.5 text-left text-base transition hover:bg-pitch-500/5 ${
                      value === item.code
                        ? "bg-pitch-500/10 font-semibold text-ink-900"
                        : "text-ink-800"
                    }`}
                  >
                    <FlagIcon code={item.code} />
                    <span className="min-w-0 truncate">{item.label}</span>
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </label>
  );
}
