import Link from "next/link";
import { Crest } from "@/components/Crest";
import { DIMENSION_LABELS } from "@/lib/profile";
import type { JudgedDimension, StandingRow } from "@/lib/types";

type Badge = { dimension: JudgedDimension; kind: "strong" | "weak" } | null;

export function StandingsTable({ rows, badges }: { rows: StandingRow[]; badges: Record<number, Badge> }) {
  if (!rows.length) return <p className="text-sm text-muted">Classificação disponível após as primeiras rodadas.</p>;
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-muted">
          <th className="text-left">#</th><th className="text-left">Time</th>
          <th>P</th><th>J</th><th>V-E-D</th><th>SG</th><th className="text-left">Destaque</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const badge = badges[r.teamId];
          return (
            <tr key={r.teamId} className="even:bg-card-inner">
              <td className="py-1">{r.position}</td>
              <td>
                <Link href={`/time/${r.teamId}`} className="flex items-center gap-2 hover:text-accent">
                  <Crest src={r.teamLogoUrl} alt="" size={16} />
                  {r.teamName}
                </Link>
              </td>
              <td className="text-center font-bold">{r.points}</td>
              <td className="text-center">{r.played}</td>
              <td className="text-center">{r.wins}-{r.draws}-{r.losses}</td>
              <td className="text-center">{r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}</td>
              <td>
                {badge && (
                  <span className={`rounded-full px-2 py-0.5 ${badge.kind === "strong" ? "bg-strong-bg text-strong" : "bg-weak-bg text-weak"}`}>
                    {DIMENSION_LABELS[badge.dimension]}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
