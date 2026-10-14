"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/Card";
import { RivalSelect } from "@/components/RivalSelect";
import {
  DIMENSION_LABELS, JUDGED_DIMENSIONS, METRIC_INFO, VENUE_LABELS, dimensionScores, formatMetric, metricLabel, pickRows,
} from "@/lib/profile";
import type { TeamProfile, TeamRef, Venue } from "@/lib/types";

// Mesma direção do pipeline (pipeline/team_profiles.py METRICS): -1 = menor é melhor.
const LOWER_IS_BETTER = new Set([
  "goals_against", "shots_on_goal_against", "dribbled_past", "penalties_committed",
  "fouls", "yellow_cards", "red_cards",
]);
const STYLE = new Set(["possession_pct", "passes_total", "passes_accuracy_pct", "offsides"]);

export function compareWinner(metric: string, a: number | null, b: number | null): "a" | "b" | null {
  if (a === null || b === null || a === b || STYLE.has(metric)) return null;
  const aBetter = LOWER_IS_BETTER.has(metric) ? a < b : a > b;
  return aBetter ? "a" : "b";
}

function VenueButtons({ value, onChange, label }: { value: Venue; onChange: (v: Venue) => void; label: string }) {
  return (
    <div className="flex gap-1" role="group" aria-label={label}>
      {(Object.keys(VENUE_LABELS) as Venue[]).map((v) => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={`rounded-full border px-2 py-0.5 text-[11px] ${v === value ? "border-accent bg-accent font-bold text-bg" : "border-line"}`}>
          {VENUE_LABELS[v]}
        </button>
      ))}
    </div>
  );
}

export function CompareDashboard({ a, b, rivals }: { a: TeamProfile; b: TeamProfile; rivals: TeamRef[] }) {
  const [venueA, setVenueA] = useState<Venue>("all");
  const [venueB, setVenueB] = useState<Venue>("all");
  const rowsA = a.byVenue[venueA];
  const rowsB = b.byVenue[venueB];
  const scoresA = dimensionScores(rowsA);
  const scoresB = dimensionScores(rowsB);
  const metrics = Object.keys(METRIC_INFO);
  const win = "font-bold text-accent";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4">
        <h1 className="text-xl font-bold uppercase">
          <Link href={`/time/${a.teamId}`} className="hover:text-accent">{a.teamName}</Link> x {b.teamName}
        </h1>
        <span className="text-xs text-muted">{a.leagueName} {a.season} · só rivais da mesma liga</span>
        <div className="lg:ml-auto"><RivalSelect teamId={a.teamId} rivalId={b.teamId} rivals={rivals} /></div>
      </div>

      <Card title="Lado a lado" subtitle="média (total) · o melhor de cada linha fica destacado">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-1 text-xs">
          <div className="text-right"><b>{a.teamName}</b><div className="mt-1 flex justify-end"><VenueButtons value={venueA} onChange={setVenueA} label={`Visão de ${a.teamName}`} /></div></div>
          <span />
          <div><b>{b.teamName}</b><div className="mt-1"><VenueButtons value={venueB} onChange={setVenueB} label={`Visão de ${b.teamName}`} /></div></div>

          {JUDGED_DIMENSIONS.map((d) => {
            const sa = scoresA[d];
            const sb = scoresB[d];
            const w = sa !== null && sb !== null && sa !== sb ? (sa > sb ? "a" : "b") : null;
            return [
              <span key={`${d}-a`} className={`text-right ${w === "a" ? win : ""}`}>{sa === null ? "—" : Math.round(sa)}</span>,
              <span key={`${d}-m`} className="text-center text-muted">{DIMENSION_LABELS[d]} (nota)</span>,
              <span key={`${d}-b`} className={w === "b" ? win : ""}>{sb === null ? "—" : Math.round(sb)}</span>,
            ];
          })}

          {metrics.map((m) => {
            const ra = pickRows(rowsA, m);
            const rb = pickRows(rowsB, m);
            if (!ra && !rb) return null;
            const w = compareWinner(m, ra?.value ?? null, rb?.value ?? null);
            return [
              <span key={`${m}-a`} className={`text-right ${w === "a" ? win : ""}`}>{ra ? formatMetric(ra) : "—"}</span>,
              <span key={`${m}-m`} className="text-center text-muted">{metricLabel(m)}</span>,
              <span key={`${m}-b`} className={w === "b" ? win : ""}>{rb ? formatMetric(rb) : "—"}</span>,
            ];
          })}
        </div>
      </Card>
    </div>
  );
}
