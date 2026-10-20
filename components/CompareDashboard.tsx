"use client";

import Link from "next/link";
import { useVenueParam } from "@/lib/useVenueParam";
import { Card } from "@/components/Card";
import { Crest } from "@/components/Crest";
import { MirrorBar } from "@/components/MirrorBar";
import { RivalSelect } from "@/components/RivalSelect";
import { Segmented } from "@/components/Segmented";
import {
  DIMENSION_LABELS, EFFICIENCY_METRICS, JUDGED_DIMENSIONS, METRIC_INFO, VENUE_LABELS, dimensionScores, formatMetric,
  metricLabel, pickRows,
  type DimensionScores,
} from "@/lib/profile";
import type { Dimension, TeamProfile, TeamRef, Venue } from "@/lib/types";

// Mesma direção do pipeline (pipeline/team_profiles.py METRICS): -1 = menor é melhor.
const LOWER_IS_BETTER = new Set([
  "goals_against", "shots_on_goal_against", "dribbled_past", "penalties_committed",
  "yellow_cards", "red_cards", "xg_against", "goals_against_1h", "goals_against_2h",
]);
// Estilo e eficiência não têm vencedor: não dizem quem é melhor (ver pipeline, direção 0).
const NO_WINNER = new Set([
  "possession_pct", "passes_total", "passes_accuracy_pct", "offsides", "tackles_interceptions", "fouls",
  ...EFFICIENCY_METRICS,
]);

const VENUE_OPTIONS = (Object.keys(VENUE_LABELS) as Venue[]).map((v) => ({ value: v, label: VENUE_LABELS[v] }));
// Perfil dos gols fica só no painel do time.
const GROUP_ORDER: Dimension[] = [...JUDGED_DIMENSIONS, "efficiency", "style", "timing"];

export function compareWinner(metric: string, a: number | null, b: number | null): "a" | "b" | null {
  if (a === null || b === null || a === b || NO_WINNER.has(metric)) return null;
  const aBetter = LOWER_IS_BETTER.has(metric) ? a < b : a > b;
  return aBetter ? "a" : "b";
}

// Placar do cabeçalho: só contam dimensões em que os dois têm nota e as notas diferem.
export function dimensionTally(sa: DimensionScores, sb: DimensionScores) {
  let a = 0;
  let b = 0;
  for (const d of JUDGED_DIMENSIONS) {
    const x = sa[d];
    const y = sb[d];
    if (x === null || y === null || x === y) continue;
    if (x > y) a++;
    else b++;
  }
  return { a, b, total: a + b };
}

export function tallyLabel(aName: string, bName: string, t: { a: number; b: number; total: number }): string | null {
  if (t.total === 0) return null;
  if (t.a === t.b) return `Empate em dimensões (${t.a} a ${t.b})`;
  return t.a > t.b ? `${aName} vence ${t.a} de ${t.total} dimensões` : `${bName} vence ${t.b} de ${t.total} dimensões`;
}

function TeamSide({ team, ring, align, venue, onVenue }: {
  team: TeamProfile; ring: string; align: "left" | "right"; venue: Venue; onVenue: (v: Venue) => void;
}) {
  const name = (
    <span className="font-display text-lg font-extrabold uppercase leading-none break-words sm:text-2xl">{team.teamName}</span>
  );
  // No celular o escudo vai acima do nome: lado a lado não sobra largura com o "VS" no meio.
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${align === "right" ? "items-end text-right" : "items-start"}`}>
      <div className={`flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center ${align === "right" ? "items-end sm:flex-row-reverse" : "items-start"}`}>
        <span className={`inline-flex shrink-0 rounded-full p-0.5 ring-2 ${ring}`}><Crest src={team.teamLogoUrl} alt="" size={32} /></span>
        {align === "left" ? (
          <Link href={`/time/${team.teamId}`} className="rounded hover:text-brand-teal-ink focus-visible:outline-2 focus-visible:outline-brand-teal">{name}</Link>
        ) : name}
      </div>
      <Segmented size="sm" label={`Visão de ${team.teamName}`} options={VENUE_OPTIONS} value={venue} onChange={onVenue} />
    </div>
  );
}

export function CompareDashboard({ a, b, rivals }: { a: TeamProfile; b: TeamProfile; rivals: TeamRef[] }) {
  const [venueA, setVenueA] = useVenueParam("visao");
  const [venueB, setVenueB] = useVenueParam("visao_rival");
  const rowsA = a.byVenue[venueA];
  const rowsB = b.byVenue[venueB];
  const scoresA = dimensionScores(rowsA);
  const scoresB = dimensionScores(rowsB);
  const score = tallyLabel(a.teamName, b.teamName, dimensionTally(scoresA, scoresB));

  const groups = GROUP_ORDER.map((d) => {
    const lines = Object.keys(METRIC_INFO).flatMap((m) => {
      const ra = pickRows(rowsA, m);
      const rb = pickRows(rowsB, m);
      if (!ra && !rb) return [];
      if ((ra ?? rb)!.dimension !== d) return [];
      const va = ra?.value ?? null;
      const vb = rb?.value ?? null;
      return [{
        metric: m, va, vb,
        aText: ra ? formatMetric(ra) : "—",
        bText: rb ? formatMetric(rb) : "—",
        max: Math.max(Math.abs(va ?? 0), Math.abs(vb ?? 0)),
        winner: compareWinner(m, va, vb),
      }];
    });
    return { dimension: d, lines };
  }).filter((g) => g.lines.length);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted">{a.leagueName} {a.season} · só rivais da mesma liga</p>
          <RivalSelect teamId={a.teamId} rivalId={b.teamId} rivals={rivals} />
        </div>
        <h1 className="sr-only">{a.teamName} x {b.teamName}</h1>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <TeamSide team={a} ring="ring-team-a" align="left" venue={venueA} onVenue={setVenueA} />
          <span aria-hidden className="pt-1 font-display text-xl font-extrabold text-muted">VS</span>
          <TeamSide team={b} ring="ring-team-b" align="right" venue={venueB} onVenue={setVenueB} />
        </div>
        {score && <p className="mt-4 text-center text-sm font-semibold">{score}</p>}
      </Card>

      <Card featured title="Dimensões" subtitle="nota de 0 a 100 · cor cheia = melhor da linha">
        {JUDGED_DIMENSIONS.map((d) => {
          const sa = scoresA[d];
          const sb = scoresB[d];
          const w = sa !== null && sb !== null && sa !== sb ? (sa > sb ? "a" : "b") : null;
          return (
            <MirrorBar key={d} label={DIMENSION_LABELS[d]} a={sa} b={sb} max={100} winner={w}
              aText={sa === null ? "—" : String(Math.round(sa))} bText={sb === null ? "—" : String(Math.round(sb))} />
          );
        })}
      </Card>

      <Card title="Métricas" subtitle="média por jogo (total) · cor cheia = melhor da linha · estilo e eficiência sem vencedor">
        {groups.map((g) => (
          <div key={g.dimension} className="mt-3 first:mt-0">
            <p className="mb-1 font-display text-xs font-bold uppercase tracking-wide text-muted">{DIMENSION_LABELS[g.dimension]}</p>
            {g.lines.map((l) => (
              <MirrorBar key={l.metric} label={metricLabel(l.metric)} a={l.va} b={l.vb} aText={l.aText} bText={l.bText}
                max={l.max} winner={l.winner} />
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}
