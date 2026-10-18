import type { ReactNode } from "react";

// featured = bloco "estrela" da página: borda teal para o olho achar primeiro.
export function Card({
  title, subtitle, featured = false, className = "", children,
}: { title?: string; subtitle?: string; featured?: boolean; className?: string; children: ReactNode }) {
  const border = featured ? "border-2 border-brand-teal" : "border border-line";
  return (
    <section className={`rounded-[14px] bg-surface p-4 shadow-[0_1px_3px_rgb(7_19_23/0.05)] ${border} ${className}`}>
      {title && <h2 className="font-display text-base font-bold uppercase tracking-wide">{title}</h2>}
      {subtitle && <p className="mb-3 text-xs text-muted">{subtitle}</p>}
      {children}
    </section>
  );
}
