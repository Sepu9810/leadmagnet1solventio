import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 6.5v11l9-5.5-9-5.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6.2C4 4.99 4.99 4 6.2 4h4.8v16H6.2A2.2 2.2 0 0 1 4 17.8V6.2Zm9 13.8V4h4.8C19.01 4 20 4.99 20 6.2v11.6a2.2 2.2 0 0 1-2.2 2.2H13Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="12" width="3" height="3" rx="0.8" fill="currentColor" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
