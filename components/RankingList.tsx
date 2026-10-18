import Link from "next/link";
import { MIN_GAMES, formatMetric } from "@/lib/profile";
import type { LeagueTeamProfile } from "@/lib/types";

export interface RankingItem {
  teamId: number;
  teamName: string;
  display: string;
}

export function topByMetric(
  profiles: LeagueTeamProfile[],
  metric: string,
  order: "desc" | "asc",
  n: number
): RankingItem[] {
  return profiles
    .map((p) => ({ p, row: p.rows.find((r) => r.metric === metric) }))
    .filter(({ row }) => row && row.value !== null && row.gamesCounted >= MIN_GAMES)
    .sort((a, b) => {
      const diff = (a.row!.value as number) - (b.row!.value as number);
      return order === "asc" ? diff : -diff;
    })
    .slice(0, n)
    .map(({ p, row }) => ({ teamId: p.teamId, teamName: p.teamName, display: formatMetric(row!) }));
}

export function RankingList({ items }: { items: RankingItem[] }) {
  if (!items.length) return <p className="text-sm text-muted">Amostra ainda insuficiente.</p>;
  return (
    <ol className="space-y-1 text-sm">
      {/* Em "Destaques" o mesmo time pode liderar mais de uma dimensão: chave por posição. */}
      {items.map((item, i) => (
        <li key={`${i}-${item.teamId}`} className="flex items-center justify-between gap-2">
          <Link href={`/time/${item.teamId}`} className="rounded hover:text-brand-teal-ink focus-visible:outline-2 focus-visible:outline-brand-teal">{item.teamName}</Link>
          <span className="shrink-0 rounded-full bg-tier-3 px-2 py-0.5 text-xs font-bold tabular-nums">{item.display}</span>
        </li>
      ))}
    </ol>
  );
}
