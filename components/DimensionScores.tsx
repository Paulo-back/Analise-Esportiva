import {
  DIMENSION_HELP, DIMENSION_LABELS, JUDGED_DIMENSIONS, PERCENTILE_HELP, classify,
  type DimensionScores as Scores,
} from "@/lib/profile";

// Alinha o balão pela coluna do grid (2 colunas no celular, 5 a partir de sm) pra não vazar da tela.
const TOOLTIP_POSITION = [
  "left-0",
  "right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2",
  "left-0 sm:left-1/2 sm:-translate-x-1/2",
  "right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2",
  "left-0 sm:left-auto sm:right-0",
];

export function DimensionScores({ scores }: { scores: Scores }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {JUDGED_DIMENSIONS.map((d, i) => {
        const score = scores[d];
        const kind = classify(score);
        const ring = kind === "strong" ? "ring-2 ring-strong" : kind === "weak" ? "ring-2 ring-weak" : "";
        const text = kind === "strong" ? "text-strong" : kind === "weak" ? "text-weak" : "";
        const tooltipId = `dimension-help-${d}`;
        return (
          <div key={d} className={`group relative rounded-lg bg-card-inner p-3 text-center text-xs ${ring}`}>
            {DIMENSION_LABELS[d]}
            <button
              type="button"
              aria-label={`Como é calculado: ${DIMENSION_LABELS[d]}`}
              aria-describedby={tooltipId}
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-muted text-[10px] font-bold leading-none text-muted hover:border-fg hover:text-fg focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none"
            >
              !
            </button>
            <b className={`block text-2xl ${text}`}>{score === null ? "—" : Math.round(score)}</b>
            <span
              id={tooltipId}
              role="tooltip"
              className={`invisible absolute top-full z-10 mt-1 w-60 rounded-lg border border-line bg-bg p-3 text-left text-xs font-normal leading-snug text-fg opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${TOOLTIP_POSITION[i]}`}
            >
              {DIMENSION_HELP[d]}
              <span className="mt-2 block text-muted">{PERCENTILE_HELP}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
