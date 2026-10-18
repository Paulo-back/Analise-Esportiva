import { metricLabel, strengthsAndWeaknesses } from "@/lib/profile";
import type { MetricRow } from "@/lib/types";

function PillGroup({ title, rows, arrow, className }: { title: string; rows: MetricRow[]; arrow: string; className: string }) {
  if (!rows.length) return null;
  return (
    <div>
      <p className="mb-1 font-display text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
      <div className="flex flex-wrap gap-1 text-xs">
        {rows.map((r) => (
          <span key={r.metric} className={`rounded-full px-2 py-0.5 ${className}`}>
            <span aria-hidden>{arrow}</span> <span>{metricLabel(r.metric)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function StrengthPills({ rows }: { rows: MetricRow[] }) {
  const { strengths, weaknesses } = strengthsAndWeaknesses(rows);
  if (!strengths.length && !weaknesses.length) {
    return <p className="text-sm text-muted">Nenhum ponto forte ou fraco destacado nesta visão.</p>;
  }
  return (
    <div className="space-y-3">
      <PillGroup title="Fortes" rows={strengths} arrow="▲" className="bg-tier-4 text-tier-4-fg" />
      <PillGroup title="Fracos" rows={weaknesses} arrow="▼" className="bg-tier-2 text-tier-2-fg" />
    </div>
  );
}
