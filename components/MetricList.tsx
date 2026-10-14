import { PercentileBar } from "@/components/PercentileBar";
import { DIMENSION_LABELS, JUDGED_DIMENSIONS, METRIC_INFO, formatMetric, metricLabel } from "@/lib/profile";
import type { MetricRow } from "@/lib/types";

function MetricLine({ row }: { row: MetricRow }) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-2 py-1 text-xs">
      <span>{metricLabel(row.metric)}</span>
      <PercentileBar percentile={row.percentile} />
      <span className="text-right">
        {formatMetric(row)}
        {row.percentile !== null && <span className="text-muted"> · p{Math.round(row.percentile)}</span>}
      </span>
    </div>
  );
}

export function MetricList({ rows }: { rows: MetricRow[] }) {
  const judged = rows.filter((r) => r.dimension !== "style");
  const style = rows.filter((r) => r.dimension === "style");
  const byDimension = (list: MetricRow[]) =>
    JUDGED_DIMENSIONS.map((d) => [d, list.filter((r) => r.dimension === d)] as const).filter(([, l]) => l.length);
  const featured = judged.filter((r) => METRIC_INFO[r.metric]?.featured);
  const others = judged.filter((r) => !METRIC_INFO[r.metric]?.featured);

  return (
    <div>
      {byDimension(featured).map(([d, list]) => (
        <div key={d} className="mt-2">
          <p className="text-[11px] uppercase tracking-wider text-muted">{DIMENSION_LABELS[d]}</p>
          {list.map((r) => <MetricLine key={r.metric} row={r} />)}
        </div>
      ))}
      {others.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-muted">ver todas as métricas</summary>
          {byDimension(others).map(([d, list]) => (
            <div key={d} className="mt-2">
              <p className="text-[11px] uppercase tracking-wider text-muted">{DIMENSION_LABELS[d]}</p>
              {list.map((r) => <MetricLine key={r.metric} row={r} />)}
            </div>
          ))}
        </details>
      )}
      {style.length > 0 && (
        <div className="mt-3 rounded-lg border border-dashed border-line p-2 text-xs">
          <b>Estilo</b>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {style.map((r) => (
              <span key={r.metric}>
                {metricLabel(r.metric)}: <span>{formatMetric(r)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
