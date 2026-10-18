import { classify } from "@/lib/profile";

export function PercentileBar({ percentile, leagueAvgPosition = 50 }: { percentile: number | null; leagueAvgPosition?: number }) {
  const kind = classify(percentile);
  const color = kind === "strong" ? "bg-tier-5" : kind === "weak" ? "bg-tier-1" : "bg-brand-teal";
  return (
    <div role="img" className="relative h-2 rounded-full bg-tier-3" aria-label={percentile === null ? "sem percentil" : `percentil ${Math.round(percentile)}`}>
      {percentile !== null && (
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max(percentile, 2)}%` }} />
      )}
      <div className="absolute -top-1 h-4 w-0.5 bg-fg/50" style={{ left: `${leagueAvgPosition}%` }} />
    </div>
  );
}
