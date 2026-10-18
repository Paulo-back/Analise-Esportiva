"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/Card";
import { Crest } from "@/components/Crest";
import { DimensionScores } from "@/components/DimensionScores";
import { KpiCard } from "@/components/KpiCard";
import { MetricList } from "@/components/MetricList";
import { MonthlyGoalsChart } from "@/components/MonthlyGoalsChart";
import { StrengthPills } from "@/components/StrengthPills";
import {
  GOAL_MINUTE_BUCKETS, MIN_GAMES, VENUE_LABELS, dimensionScores, formatMetric, formatMonth, formatNumber,
  hasEnoughSample, pickRows,
} from "@/lib/profile";
import type { StandingRow, TeamMonthGoals, TeamProfile, TeamRef, Venue } from "@/lib/types";

function totalOf(rows: ReturnType<typeof pickRows>[]): number[] {
  return rows.map((r) => (r?.total ?? 0));
}

function leagueHint(row: ReturnType<typeof pickRows>): string | undefined {
  if (!row || row.leagueAvg === null) return undefined;
  return `liga: ${formatNumber(row.leagueAvg, row.metric.endsWith("_pct") ? 0 : 2)}${row.metric.endsWith("_pct") ? "%" : ""}`;
}

export function TeamDashboard({
  profile, standing, months, rivals,
}: { profile: TeamProfile; standing: StandingRow | null; months: TeamMonthGoals[]; rivals: TeamRef[] }) {
  const [venue, setVenue] = useState<Venue>("all");
  const rows = profile.byVenue[venue];
  const enough = hasEnoughSample(rows);
  const goalsFor = pickRows(rows, "goals_for");
  const goalsAgainst = pickRows(rows, "goals_against");
  const cleanSheets = pickRows(rows, "clean_sheet_pct");
  const [for1h, for2h, against1h, against2h] = totalOf(
    ["goals_for_1h", "goals_for_2h", "goals_against_1h", "goals_against_2h"].map((m) => pickRows(rows, m))
  );
  const halfGames = pickRows(rows, "goals_for_1h")?.gamesCounted ?? 0;
  const minuteGames = pickRows(rows, "goals_for_min_0_15")?.gamesCounted ?? 0;
  const minuteSeries = GOAL_MINUTE_BUCKETS.map((b) => ({
    label: b.label,
    primary: pickRows(rows, `goals_for_min_${b.key}`)?.total ?? 0,
    secondary: pickRows(rows, `goals_against_min_${b.key}`)?.total ?? 0,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4">
        <Crest src={profile.teamLogoUrl} alt={profile.teamName} size={44} />
        <div>
          <h1 className="text-xl font-bold uppercase">{profile.teamName}</h1>
          <p className="text-xs text-muted">
            <Link href={`/liga/${profile.leagueId}`} className="hover:text-accent">{profile.leagueName}</Link>{" "}
            {profile.season}
            {standing && ` · ${standing.position}º lugar · ${standing.played} jogos`}
          </p>
        </div>
        <div className="flex gap-2 lg:ml-auto">
          {(Object.keys(VENUE_LABELS) as Venue[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVenue(v)}
              className={`rounded-full border px-3 py-1 text-xs ${v === venue ? "border-accent bg-accent font-bold text-bg" : "border-line"}`}
            >
              {VENUE_LABELS[v]}
            </button>
          ))}
          {rivals.length > 0 && (
            <Link
              href={`/time/${profile.teamId}/vs/${rivals[0].teamId}`}
              className="rounded-full border border-dashed border-accent px-3 py-1 text-xs text-accent"
            >
              ⇄ Comparar
            </Link>
          )}
        </div>
      </div>

      {!enough && (
        <p className="rounded-lg border border-weak bg-weak-bg p-3 text-sm text-weak">
          Amostra insuficiente nesta visão (menos de {MIN_GAMES} jogos): valores mostrados sem percentil e sem selos.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Campanha"
          value={standing ? `${standing.wins}-${standing.draws}-${standing.losses}` : "—"}
          hint={standing ? `V-E-D · ${standing.points} pts` : undefined}
        />
        <KpiCard title="Gols pró" value={goalsFor ? formatMetric(goalsFor) : "—"} hint={leagueHint(goalsFor)} />
        <KpiCard title="Gols sofridos" value={goalsAgainst ? formatMetric(goalsAgainst) : "—"} hint={leagueHint(goalsAgainst)} />
        <KpiCard title="Sem sofrer gol" value={cleanSheets ? formatMetric(cleanSheets) : "—"} hint={leagueHint(cleanSheets)} />
      </div>

      {enough && (
        <Card title="Nota por dimensão" subtitle="percentil médio na liga (0–100)">
          <DimensionScores scores={dimensionScores(rows)} />
          <div className="mt-3"><StrengthPills rows={rows} /></div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Métricas" subtitle="média por jogo (total) · percentil · traço = mediana da liga">
          <MetricList rows={rows} />
        </Card>
        <Card title="Gols por mês" subtitle="marcados (verde) · sofridos (vermelho) · todas as visões">
          <MonthlyGoalsChart
            series={months.map((m) => ({ label: formatMonth(m.month), primary: m.scored, secondary: m.conceded }))}
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Gols por tempo" subtitle={`marcados (verde) · sofridos (vermelho) · ${halfGames} jogos com placar do intervalo`}>
          {halfGames ? (
            <MonthlyGoalsChart
              series={[
                { label: "1º tempo", primary: for1h, secondary: against1h },
                { label: "2º tempo", primary: for2h, secondary: against2h },
              ]}
            />
          ) : (
            <p className="text-sm text-muted">Sem placar do intervalo nesta visão ainda.</p>
          )}
        </Card>
        <Card title="Gols por minuto" subtitle={`marcados (verde) · sofridos (vermelho) · ${minuteGames} jogos com minuto dos gols`}>
          {minuteGames ? (
            <MonthlyGoalsChart series={minuteSeries} />
          ) : (
            <p className="text-sm text-muted">Minuto dos gols ainda sendo carregado nesta visão.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
