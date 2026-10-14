import { metricLabel, strengthsAndWeaknesses } from "@/lib/profile";
import type { MetricRow } from "@/lib/types";

export function StrengthPills({ rows }: { rows: MetricRow[] }) {
  const { strengths, weaknesses } = strengthsAndWeaknesses(rows);
  if (!strengths.length && !weaknesses.length) {
    return <p className="text-sm text-muted">Nenhum ponto forte ou fraco destacado nesta visão.</p>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      {strengths.length > 0 && <b className="mr-1">Fortes:</b>}
      {strengths.map((r) => (
        <span key={r.metric} className="rounded-full bg-strong-bg px-2 py-0.5 text-strong"><span aria-hidden>▲</span> <span>{metricLabel(r.metric)}</span></span>
      ))}
      {weaknesses.length > 0 && <b className="ml-3 mr-1">Fracos:</b>}
      {weaknesses.map((r) => (
        <span key={r.metric} className="rounded-full bg-weak-bg px-2 py-0.5 text-weak"><span aria-hidden>▼</span> <span>{metricLabel(r.metric)}</span></span>
      ))}
    </div>
  );
}
