import Link from "next/link";
import { TIER_CLASS } from "@/components/tierClass";
import { DIMENSION_LABELS, JUDGED_DIMENSIONS, scoreTier, type DimensionScores } from "@/lib/profile";
import type { JudgedDimension } from "@/lib/types";

// Cabeçalho curto no celular, para as 6 colunas caberem sem rolar.
const SHORT_LABELS: Record<JudgedDimension, string> = {
  dominance: "Dom", attack: "Ata", defense: "Def", intensity: "Int", set_piece: "BP", discipline: "Dis",
};

const LEGEND = ["bg-tier-1", "bg-tier-2", "bg-tier-3", "bg-tier-4", "bg-tier-5"];

function cellClass(score: number | null): string {
  const tier = scoreTier(score);
  return tier ? TIER_CLASS[tier] : "bg-tier-3";
}

export function StrengthHeatmap({
  teams,
}: { teams: { teamId: number; teamName: string; scores: DimensionScores }[] }) {
  if (!teams.length) return <p className="text-sm text-muted">Sem perfis calculados ainda.</p>;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-xs">
          <thead>
            <tr className="text-muted">
              <th className="text-left font-semibold">Time</th>
              {JUDGED_DIMENSIONS.map((d) => (
                <th key={d} className="font-semibold">
                  <abbr title={DIMENSION_LABELS[d]} className="no-underline sm:hidden">{SHORT_LABELS[d]}</abbr>
                  <span className="hidden sm:inline">{DIMENSION_LABELS[d]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.teamId}>
                <td className="pr-2">
                  <Link
                    href={`/time/${t.teamId}`}
                    className="block max-w-[7.5rem] truncate rounded font-medium hover:text-brand-teal-ink focus-visible:outline-2 focus-visible:outline-brand-teal sm:max-w-none sm:whitespace-nowrap"
                  >
                    {t.teamName}
                  </Link>
                </td>
                {JUDGED_DIMENSIONS.map((d) => (
                  <td key={d} className={`rounded-md px-1 py-1 text-center font-bold tabular-nums ${cellClass(t.scores[d])}`}>
                    {t.scores[d] === null ? "—" : Math.round(t.scores[d] as number)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center gap-1 text-[11px] text-muted">
        fraco
        {LEGEND.map((c) => <span key={c} aria-hidden className={`inline-block h-2 w-5 rounded-sm ${c}`} />)}
        forte
      </p>
    </div>
  );
}
