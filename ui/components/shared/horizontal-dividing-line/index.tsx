export default function HorizontalDividingLine() {
  return (
    <div role="separator" className="flex w-full items-center gap-4">
      <span className="flex-1 border-t-2 border-dashed border-black/25 dark:border-white/25" />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 shrink-0 text-black dark:text-white"
      >
        <path
          d="M9 7.87
             C7.2 5.6 8.5 1.9 12 1.9 S16.8 5.6 15 7.87
             C16.84 6.17 19.31 6.52 20.23 9.33 S19.34 13.87 16.85 13.58
             C19.32 14.59 20.21 17.84 17.61 19.73 S12.2 19.76 12 17.1
             C11.64 19.65 9.25 21 6.77 19.2 S4.84 14.71 7.15 13.58
             C4.48 14.44 2.15 12.37 3.2 9.14 S7.35 5.6 9 7.87 Z"
        />
        <circle cx="12" cy="11.8" r="2.4" />
      </svg>
      <span className="flex-1 border-t-2 border-dashed border-black/25 dark:border-white/25" />
    </div>
  )
}
