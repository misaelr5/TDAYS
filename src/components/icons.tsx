export function Arrow({
  diagonal = true,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"} />
    </svg>
  );
}
export function Facebook({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.4-1.6 1.7-1.6h1.4V4.3A17 17 0 0 0 14.4 4c-2.6 0-4.1 1.5-4.1 4.3v2.2H7.5v3h2.8V21" />
    </svg>
  );
}
export function Plane({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M94 13c2-12 10-12 12 0l4 64 68 47v13l-68-24-2 45 22 18v10l-30-9-30 9v-10l22-18-2-45-68 24v-13l68-47z" />
      <path
        d="M100 12v156"
        fill="none"
        stroke="#ffffff"
        strokeOpacity=".35"
        strokeWidth="2"
      />
    </svg>
  );
}
