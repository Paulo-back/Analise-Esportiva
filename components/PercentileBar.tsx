import { classify } from "@/lib/profile";

export function PercentileBar({ percentile, leagueAvgPosition = 50 }: { percentile: number | null; leagueAvgPosition?: number }) {
  const kind = classify(percentile);
  const color = kind === "strong" ? "bg-strong" : kind === "weak" ? "bg-weak" : "bg-accent";
  return (
    <div className="relative h-2 rounded-full bg-bg" aria-label={percentile === null ? "sem percentil" : `percentil ${Math.round(percentile)}`}>
      {percentile !== null && (
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max(percentile, 2)}%` }} />
      )}
      <div className="absolute -top-1 h-4 w-0.5 bg-fg/60" style={{ left: `${leagueAvgPosition}%` }} />
    </div>
  );
}
