import { Card } from "@/components/Card";
import {
  EFFICIENCY_HELP, EFFICIENCY_METRICS, METRIC_INFO, formatMetric, formatNumber, metricLabel, pickRows,
} from "@/lib/profile";
import type { MetricRow, TopScorer } from "@/lib/types";

function leagueText(row: MetricRow): string | null {
  if (row.leagueAvg === null) return null;
  const info = METRIC_INFO[row.metric];
  if (info?.kind === "pct" || info?.kind === "mean") return `liga: ${formatNumber(row.leagueAvg, 0)}%`;
  return `liga: ${formatNumber(row.leagueAvg, 2, info?.signed)}`;
}

// Linha "rótulo · valor · média da liga", sem percentil: tudo aqui é informativo.
function StatLine({ row, label }: { row: MetricRow | undefined; label?: string }) {
  if (!row) return null;
  const league = leagueText(row);
  return (
    <div className="flex items-baseline justify-between gap-3 py-1 text-xs">
      <span>{label ?? metricLabel(row.metric)}</span>
      <span className="text-right tabular-nums">
        {formatMetric(row)}
        {league && <span className="text-muted"> · {league}</span>}
      </span>
    </div>
  );
}

function share(goals: number, total: number): number {
  return total ? (goals / total) * 100 : 0;
}

export function ScorerDependencyCard({ scorers, className = "" }: { scorers: TopScorer[]; className?: string }) {
  const top = scorers[0];
  return (
    <Card className={className} title="Dependência do artilheiro" subtitle="gols de cada jogador sobre o total do time">
      {top ? (
        <>
          <p className="text-sm">
            <b>{top.playerName}</b> fez <b className="tabular-nums">{formatNumber(share(top.goals, top.teamGoals), 0)}%</b> dos gols
          </p>
          <ul className="mt-3 space-y-2">
            {scorers.map((s) => (
              <li key={s.rank} className="text-xs">
                <div className="flex justify-between gap-2">
                  <span className="truncate">{s.rank}. {s.playerName}</span>
                  <span className="tabular-nums">
                    {s.goals} de {s.teamGoals} · {formatNumber(share(s.goals, s.teamGoals), 0)}%
                  </span>
                </div>
                <div role="img" aria-label={`${formatNumber(share(s.goals, s.teamGoals), 0)}% dos gols`} className="mt-1 h-2 rounded-full bg-tier-3">
                  <div className="h-2 rounded-full bg-brand-teal" style={{ width: `${Math.max(share(s.goals, s.teamGoals), 2)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-muted">Sem autor de gol nesta visão ainda.</p>
      )}
    </Card>
  );
}

export function BenchGoalsCard({ rows, className = "" }: { rows: MetricRow[]; className?: string }) {
  const bench = pickRows(rows, "bench_goals_pct");
  const league = bench ? leagueText(bench) : null;
  return (
    <Card className={className} title="Gols do banco" subtitle="feitos por quem entrou no decorrer do jogo">
      <p className="mt-1 font-display text-[32px] font-bold leading-none tabular-nums">{bench ? formatMetric(bench) : "—"}</p>
      {league && <p className="mt-1 text-xs text-muted">{league}</p>}
    </Card>
  );
}

export function GoalOriginCard({ rows, className = "" }: { rows: MetricRow[]; className?: string }) {
  return (
    <Card className={className} title="Origem dos gols" subtitle="parte dos gols pró em cada situação">
      <StatLine row={pickRows(rows, "penalty_goals_pct")} label="De pênalti" />
      <StatLine row={pickRows(rows, "own_goals_for_pct")} label="Gol contra a favor" />
    </Card>
  );
}

export function HalftimeCard({ rows, className = "" }: { rows: MetricRow[]; className?: string }) {
  return (
    <Card className={className} title="Vantagem no intervalo" subtitle="pontos conquistados sobre os possíveis">
      <StatLine row={pickRows(rows, "ht_lead_points_pct")} label="Vencendo no intervalo" />
      <StatLine row={pickRows(rows, "ht_trail_points_pct")} label="Perdendo no intervalo" />
    </Card>
  );
}

export function EfficiencyCard({ rows, className = "" }: { rows: MetricRow[]; className?: string }) {
  return (
    <Card className={className} title="Eficiência" subtitle={EFFICIENCY_HELP}>
      {EFFICIENCY_METRICS.map((m) => <StatLine key={m} row={pickRows(rows, m)} />)}
    </Card>
  );
}
