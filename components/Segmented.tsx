"use client";

export function Segmented<T extends string>({
  label, options, value, onChange, size = "md",
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  // Com 5 visões não cabe no celular: rola dentro de si em vez de empurrar a página.
  return (
    <div role="group" aria-label={label} className="flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-tier-3 p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`shrink-0 whitespace-nowrap rounded-full ${pad} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal ${
              active ? "bg-surface font-bold text-fg shadow-sm" : "text-muted hover:bg-surface/60 hover:text-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
