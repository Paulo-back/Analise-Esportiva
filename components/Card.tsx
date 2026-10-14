import type { ReactNode } from "react";

export function Card({
  title, subtitle, className = "", children,
}: { title?: string; subtitle?: string; className?: string; children: ReactNode }) {
  return (
    <section className={`rounded-xl border border-line bg-card p-4 ${className}`}>
      {title && <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>}
      {subtitle && <p className="mb-3 text-xs text-muted">{subtitle}</p>}
      {children}
    </section>
  );
}
