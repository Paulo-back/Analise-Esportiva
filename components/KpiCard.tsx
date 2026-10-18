import { Card } from "@/components/Card";

export function KpiCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card title={title} className="relative overflow-hidden pl-5">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-brand-amber to-brand-teal" />
      <p className="mt-2 font-display text-[32px] font-bold leading-none tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}
