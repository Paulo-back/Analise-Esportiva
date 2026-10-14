import { DIMENSION_LABELS, JUDGED_DIMENSIONS, classify, type DimensionScores as Scores } from "@/lib/profile";

export function DimensionScores({ scores }: { scores: Scores }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {JUDGED_DIMENSIONS.map((d) => {
        const score = scores[d];
        const kind = classify(score);
        const ring = kind === "strong" ? "ring-2 ring-strong" : kind === "weak" ? "ring-2 ring-weak" : "";
        const text = kind === "strong" ? "text-strong" : kind === "weak" ? "text-weak" : "";
        return (
          <div key={d} className={`rounded-lg bg-card-inner p-3 text-center text-xs ${ring}`}>
            {DIMENSION_LABELS[d]}
            <b className={`block text-2xl ${text}`}>{score === null ? "—" : Math.round(score)}</b>
          </div>
        );
      })}
    </div>
  );
}
