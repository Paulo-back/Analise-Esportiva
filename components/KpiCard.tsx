import { Card } from "@/components/Card";

export function KpiCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card title={title}>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </Card>
  );
}
