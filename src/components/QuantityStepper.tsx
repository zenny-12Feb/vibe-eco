"use client";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border-4 border-cream bg-white p-1 shadow-chunky-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-bubblegum-light font-display text-xl font-bold text-bubblegum-dark transition hover:bg-bubblegum hover:text-white sm:h-9 sm:w-9"
        aria-label="Giam so luong"
      >
        −
      </button>
      <span className="min-w-[2ch] text-center font-display text-lg font-extrabold text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-grass-light font-display text-xl font-bold text-grass-dark transition hover:bg-grass hover:text-white sm:h-9 sm:w-9"
        aria-label="Tang so luong"
      >
        +
      </button>
    </div>
  );
}
