import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Crest } from "@/components/Crest";
import { KpiCard } from "@/components/KpiCard";
import { LeaguePills } from "@/components/LeaguePills";
import { MonthlyGoalsChart } from "@/components/MonthlyGoalsChart";
import { RankingList, topByMetric } from "@/components/RankingList";
import { StandingsTable } from "@/components/StandingsTable";
import { StrengthHeatmap } from "@/components/StrengthHeatmap";
import { UpdatedAt } from "@/components/UpdatedAt";
import { DIMENSION_LABELS, JUDGED_DIMENSIONS, dimensionScores, formatMonth, formatNumber, standingsHighlights } from "@/lib/profile";
import {
  getComputedAt, getLeagueGoalsByMonth, getLeagueKpis, getLeagueProfiles, getProfileLeague, getProfileLeagues,
  getStandings,
} from "@/lib/queries";

export const revalidate = 3600;

// Lista vazia: nenhuma liga é gerada no build, mas a rota vira ISR (gerada na 1ª visita e
// cacheada por `revalidate`). Sem isto o Next 15 trata /liga/[id] como dinâmica (banco a cada acesso).
export async function generateStaticParams() {
  return [];
}

export default async function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const leagueId = Number((await params).id);
  if (!Number.isInteger(leagueId)) notFound();
  const league = await getProfileLeague(leagueId);
  if (!league) notFound();

  const [leagues, kpis, standings, profiles, months, computedAt] = await Promise.all([
    getProfileLeagues(),
    getLeagueKpis(league.id, league.season),
    getStandings(league.id, league.season),
    getLeagueProfiles(league.id, league.season, "all"),
    getLeagueGoalsByMonth(league.id, league.season),
    getComputedAt(),
  ]);

  const scored = profiles.map((p) => ({ ...p, scores: dimensionScores(p.rows) }));
  const highlights = Object.fromEntries(scored.map((p) => [p.teamId, standingsHighlights(p.scores)]));
  const heatmapOrder = new Map(standings.map((s) => [s.teamId, s.position]));
  const heatmapTeams = [...scored].sort(
    (a, b) => (heatmapOrder.get(a.teamId) ?? 999) - (heatmapOrder.get(b.teamId) ?? 999)
  );
  const leaders = JUDGED_DIMENSIONS.map((d) => {
    const best = scored
      .filter((p) => p.scores[d] !== null)
      .sort((a, b) => (b.scores[d] as number) - (a.scores[d] as number))[0];
    return best ? { teamId: best.teamId, teamName: best.teamName, display: DIMENSION_LABELS[d] } : null;
  }).filter((x): x is { teamId: number; teamName: string; display: string } => x !== null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4">
        <Crest src={league.logoUrl} alt={league.name} size={40} />
        <div>
          <h1 className="text-xl font-bold uppercase">{league.name}</h1>
          <p className="text-xs text-muted">Temporada {league.season}</p>
        </div>
        <div className="w-full lg:ml-auto lg:w-auto"><LeaguePills leagues={leagues} activeId={league.id} /></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Partidas" value={formatNumber(kpis.matches, 0)} />
        <KpiCard title="Gols" value={formatNumber(kpis.goals, 0)} />
        <KpiCard title="Média de gols" value={kpis.avgGoals === null ? "—" : formatNumber(kpis.avgGoals, 2)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* min-w-0: sem isso o item do grid não encolhe e a tabela empurra a página no celular */}
        <Card
          className="min-w-0"
          title="Mapa de forças"
          subtitle="nota por dimensão · verde ≥ 75 · verde claro 60–74 · vermelho claro 26–39 · vermelho ≤ 25"
        >
          <StrengthHeatmap teams={heatmapTeams} />
        </Card>
        <Card className="min-w-0" title="Classificação" subtitle="com a melhor e a pior dimensão de cada time">
          <StandingsTable rows={standings} highlights={highlights} />
        </Card>
      </div>

      <Card title="Gols por mês" subtitle="total de gols da liga">
        <MonthlyGoalsChart series={months.map((m) => ({ label: formatMonth(m.month), primary: m.goals }))} />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Melhores ataques" subtitle="gols por jogo (total)">
          <RankingList items={topByMetric(profiles, "goals_for", "desc", 5)} />
        </Card>
        <Card title="Melhores defesas" subtitle="gols sofridos por jogo (total)">
          <RankingList items={topByMetric(profiles, "goals_against", "asc", 5)} />
        </Card>
        <Card title="Mais indisciplinados" subtitle="amarelos por jogo (total)">
          <RankingList items={topByMetric(profiles, "yellow_cards", "desc", 5)} />
        </Card>
        <Card title="Destaques" subtitle="líder de cada dimensão">
          <RankingList items={leaders} />
        </Card>
      </div>
      <UpdatedAt date={computedAt} />
    </div>
  );
}
