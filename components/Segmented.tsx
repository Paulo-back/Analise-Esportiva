"use client";

import { useEffect, useRef, useState } from "react";

// Degradê na borda que ainda tem opção escondida: sinaliza que o seletor rola.
const FADE = {
  none: "",
  right: "[mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)]",
  left: "[mask-image:linear-gradient(to_left,#000_calc(100%-2rem),transparent)]",
  both: "[mask-image:linear-gradient(to_right,transparent,#000_2rem,#000_calc(100%-2rem),transparent)]",
};

export function Segmented<T extends string>({
  label, options, value, onChange, size = "md",
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState<keyof typeof FADE>("none");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft > 1;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setFade(left && right ? "both" : left ? "left" : right ? "right" : "none");
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  // Com 5 visões não cabe no celular: rola dentro de si em vez de empurrar a página.
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      data-fade={fade === "none" ? undefined : fade}
      className={`flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-tier-3 p-0.5 [scrollbar-width:none] ${FADE[fade]}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            onFocus={(e) => e.currentTarget.scrollIntoView?.({ block: "nearest", inline: "nearest" })}
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
