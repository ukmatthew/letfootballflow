import { flagEmoji } from "../lib/countries";

interface Props {
  code: string;
  className?: string;
}

export default function FlagIcon({ code, className = "" }: Props) {
  return (
    <span className={`text-lg leading-none ${className}`} aria-hidden>
      {flagEmoji(code)}
    </span>
  );
}
