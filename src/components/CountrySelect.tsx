import { useEffect, useId, useRef, useState } from "react";
import type { Country } from "../lib/countries";
import { countryName, partitionCountries } from "../lib/countries";
import FlagIcon from "./FlagIcon";

interface Props {
  value: string;
  onChange: (code: string) => void;
  suggestedCountry?: string | null;
  variant?: "light" | "dark";
  label?: string;
  showOptional?: boolean;
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

export default function CountrySelect({
  value,
  onChange,
  suggestedCountry,
  variant = "light",
  label = "Represent your country",
  showOptional = true,
}: Props) {
  const { ukNations, suggested, rest } = partitionCountries(suggestedCountry);
  const items = buildItems(ukNations, suggested, rest);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const isDark = variant === "dark";

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

  const triggerClass = isDark
    ? "flex w-full items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pr-10 text-left text-base text-white shadow-sm transition focus:border-pitch-500 focus:outline-none focus:ring-4 focus:ring-pitch-500/10"
    : "flex w-full items-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 py-3 pr-10 text-left text-base text-ink-800 shadow-sm transition focus:border-pitch-500 focus:outline-none focus:ring-4 focus:ring-pitch-500/10";

  const listClass = isDark
    ? "absolute z-[100] mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-white/15 bg-ink-800 py-1 shadow-lg"
    : "absolute z-[100] mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white py-1 shadow-lg ring-1 ring-black/5";

  const optionClass = (selected: boolean) => {
    if (isDark) {
      return `flex w-full items-center gap-2.5 bg-ink-800 px-4 py-2.5 text-left text-base transition hover:bg-pitch-500/10 ${
        selected ? "bg-pitch-500/15 font-semibold text-white" : "text-white/85"
      }`;
    }
    return `flex w-full items-center gap-2.5 bg-white px-4 py-2.5 text-left text-base transition hover:bg-pitch-500/5 ${
      selected ? "bg-pitch-50 font-semibold text-ink-900" : "text-ink-800"
    }`;
  };

  return (
    <label className="block">
      {!isDark && (
        <>
          <span className="text-sm font-semibold text-ink-700/80">{label}</span>
          {showOptional && (
            <span className="ml-1 text-xs text-ink-700/40">(optional)</span>
          )}
        </>
      )}
      <div ref={rootRef} className={`relative ${isDark ? "mt-0" : "mt-1.5"} ${open ? "z-[100]" : ""}`}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
          className={triggerClass}
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
              <span className={isDark ? "text-white/50" : "text-ink-700/55"}>
                Choose a country…
              </span>
            </>
          )}
        </button>
        <svg
          className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
            isDark ? "text-white/40" : "text-ink-700/40"
          }`}
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
          <ul id={listId} role="listbox" className={listClass}>
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ""}
                onClick={() => select("")}
                className={optionClass(value === "")}
              >
                <span className="text-lg" aria-hidden>
                  🌍
                </span>
                Choose a country…
              </button>
            </li>
            {items.map((item, i) =>
              item.kind === "separator" ? (
                <li
                  key={`sep-${i}`}
                  role="presentation"
                  className={`my-1 border-t ${isDark ? "border-white/10" : "border-black/5"}`}
                />
              ) : (
                <li key={item.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === item.code}
                    onClick={() => select(item.code)}
                    className={optionClass(value === item.code)}
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
