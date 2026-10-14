import Link from "next/link";
import { DIMENSION_LABELS, JUDGED_DIMENSIONS, classify, type DimensionScores } from "@/lib/profile";

function cellClass(score: number | null): string {
  const kind = classify(score);
  if (kind === "strong") return "bg-strong-bg text-strong";
  if (kind === "weak") return "bg-weak-bg text-weak";
  return "bg-card-inner";
}

export function StrengthHeatmap({
  teams,
}: { teams: { teamId: number; teamName: string; scores: DimensionScores }[] }) {
  if (!teams.length) return <p className="text-sm text-muted">Sem perfis calculados ainda.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr className="text-muted">
            <th className="text-left">Time</th>
            {JUDGED_DIMENSIONS.map((d) => <th key={d}>{DIMENSION_LABELS[d]}</th>)}
          </tr>
        </thead>
        <tbody>
          {teams.map((t) => (
            <tr key={t.teamId}>
              <td><Link href={`/time/${t.teamId}`} className="hover:text-accent">{t.teamName}</Link></td>
              {JUDGED_DIMENSIONS.map((d) => (
                <td key={d} className={`rounded text-center font-bold ${cellClass(t.scores[d])}`}>
                  {t.scores[d] === null ? "—" : Math.round(t.scores[d] as number)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
