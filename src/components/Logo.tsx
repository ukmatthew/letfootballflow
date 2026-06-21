export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 2L34 8v12c0 9.5-6.2 17.8-14 20-7.8-2.2-14-10.5-14-20V8L20 2z"
        fill="#00b050"
      />
      <circle cx="20" cy="19" r="7.5" fill="white" fillOpacity="0.95" />
      <path
        d="M20 12.5c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5-2.9-6.5-6.5-6.5z"
        stroke="#00b050"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M20 12.5v13M13.5 19h13M15.2 14.7l9.6 8.6M24.8 14.7l-9.6 8.6"
        stroke="#00b050"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
