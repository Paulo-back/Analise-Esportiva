import { Card } from "@/components/Card";

export function KpiCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card title={title} padding="p-3 pl-4 sm:p-4 sm:pl-5" className="relative overflow-hidden">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-brand-amber to-brand-teal" />
      <p className="mt-1 font-display text-2xl font-bold sm:mt-2 sm:text-[32px] leading-none tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}
