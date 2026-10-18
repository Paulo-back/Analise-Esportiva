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

  // "Forças em primeiro": o mapa é o diferencial do site, então abre a página; a tabela vem como contexto.
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Crest src={league.logoUrl} alt={league.name} size={44} />
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase leading-none">{league.name}</h1>
          <div className="mt-1 flex flex-wrap gap-x-1 text-xs text-muted">
            <span>Temporada {league.season}</span>
            {computedAt && <span aria-hidden>·</span>}
            <UpdatedAt date={computedAt} className="" />
          </div>
        </div>
        <div className="w-full lg:ml-auto lg:w-auto"><LeaguePills leagues={leagues} activeId={league.id} /></div>
      </div>

      {/* min-w-0 nos blocos com tabela: sem isso o item do grid não encolhe e empurra a página no celular */}
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-12">
          <KpiCard title="Partidas" value={formatNumber(kpis.matches, 0)} />
          <KpiCard title="Gols" value={formatNumber(kpis.goals, 0)} />
          <KpiCard title="Média de gols" value={kpis.avgGoals === null ? "—" : formatNumber(kpis.avgGoals, 2)} />
        </div>

        <Card featured className="min-w-0 lg:col-span-8" title="Mapa de forças" subtitle="nota por dimensão, de 0 a 100">
          <StrengthHeatmap teams={heatmapTeams} />
        </Card>
        <Card className="lg:col-span-4" title="Destaques" subtitle="líder de cada dimensão">
          <RankingList items={leaders} />
        </Card>

        <Card className="min-w-0 lg:col-span-7" title="Classificação" subtitle="com a melhor e a pior dimensão de cada time">
          <StandingsTable rows={standings} highlights={highlights} />
        </Card>
        <Card className="lg:col-span-5" title="Gols por mês" subtitle="total de gols da liga · mês de pico em âmbar">
          <MonthlyGoalsChart highlightMax series={months.map((m) => ({ label: formatMonth(m.month), primary: m.goals }))} />
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-12">
          <Card title="Melhores ataques" subtitle="gols por jogo (total)">
            <RankingList items={topByMetric(profiles, "goals_for", "desc", 5)} />
          </Card>
          <Card title="Melhores defesas" subtitle="gols sofridos por jogo (total)">
            <RankingList items={topByMetric(profiles, "goals_against", "asc", 5)} />
          </Card>
          <Card title="Mais indisciplinados" subtitle="amarelos por jogo (total)">
            <RankingList items={topByMetric(profiles, "yellow_cards", "desc", 5)} />
          </Card>
        </div>
      </div>
    </div>
  );
}
