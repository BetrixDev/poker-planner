export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <rect x="4" y="10" width="10" height="14" rx="2" fill="currentColor" />
      <rect x="18" y="10" width="10" height="14" rx="2" fill="currentColor" />
      <circle
        cx="9"
        cy="13"
        r="1.5"
        className="text-background"
        fill="currentColor"
      />
      <circle
        cx="23"
        cy="13"
        r="1.5"
        className="text-background"
        fill="currentColor"
      />
    </svg>
  );
}
