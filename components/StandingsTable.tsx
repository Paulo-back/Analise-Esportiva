import Link from "next/link";
import { Crest } from "@/components/Crest";
import { TIER_CLASS } from "@/components/tierClass";
import { DIMENSION_LABELS, type DimensionHighlight } from "@/lib/profile";
import type { StandingRow } from "@/lib/types";

type HighlightsByTeam = { best: DimensionHighlight; worst: DimensionHighlight | null } | null;

function HighlightPill({ h, arrow }: { h: DimensionHighlight; arrow: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 ${TIER_CLASS[h.tier]} ${h.tier === "neutral" ? "ring-1 ring-line" : ""}`}>
      <span aria-hidden>{arrow}</span>
      <span>{DIMENSION_LABELS[h.dimension]}</span>
      <b>{Math.round(h.score)}</b>
    </span>
  );
}

function Highlights({ h }: { h: NonNullable<HighlightsByTeam> }) {
  return (
    <span className="flex flex-wrap gap-1">
      <HighlightPill h={h.best} arrow="▲" />
      {h.worst && <HighlightPill h={h.worst} arrow="▼" />}
    </span>
  );
}

export function StandingsTable({
  rows, highlights,
}: { rows: StandingRow[]; highlights: Record<number, HighlightsByTeam> }) {
  if (!rows.length) return <p className="text-sm text-muted">Classificação disponível após as primeiras rodadas.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted">
            <th className="px-1 py-1 text-left font-normal">#</th>
            <th className="px-1 text-left font-normal">Time</th>
            <th className="px-1 font-normal">P</th>
            <th className="px-1 font-normal">J</th>
            <th className="px-1 font-normal">V-E-D</th>
            <th className="px-1 font-normal">SG</th>
            <th className="hidden px-1 text-left font-normal sm:table-cell">Melhor · pior</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const h = highlights[r.teamId];
            return (
              <tr key={r.teamId} className="even:bg-card-inner">
                <td className="px-1 py-1.5">{r.position}</td>
                <td className="px-1 py-1.5">
                  <Link href={`/time/${r.teamId}`} className="flex items-center gap-2 whitespace-nowrap hover:text-accent">
                    <Crest src={r.teamLogoUrl} alt="" size={16} />
                    {r.teamName}
                  </Link>
                  {/* No celular a coluna de destaque não cabe: as pílulas descem para baixo do nome. */}
                  {h && <div className="mt-1 sm:hidden"><Highlights h={h} /></div>}
                </td>
                <td className="px-1 text-center font-bold">{r.points}</td>
                <td className="px-1 text-center">{r.played}</td>
                <td className="whitespace-nowrap px-1 text-center">{r.wins}-{r.draws}-{r.losses}</td>
                <td className="px-1 text-center">{r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}</td>
                <td className="hidden px-1 sm:table-cell">{h && <Highlights h={h} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
