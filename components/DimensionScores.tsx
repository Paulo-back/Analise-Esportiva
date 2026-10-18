import { TIER_CLASS } from "@/components/tierClass";
import {
  DIMENSION_HELP, DIMENSION_LABELS, JUDGED_DIMENSIONS, PERCENTILE_HELP, scoreTier,
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
        const tier = scoreTier(score);
        const tooltipId = `dimension-help-${d}`;
        // Mesma escala de cor do mapa de forças da liga.
        return (
          <div key={d} className={`group relative rounded-xl p-3 text-center text-xs font-semibold ${tier ? TIER_CLASS[tier] : "bg-tier-3"}`}>
            {DIMENSION_LABELS[d]}
            <button
              type="button"
              aria-label={`Como é calculado: ${DIMENSION_LABELS[d]}`}
              aria-describedby={tooltipId}
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-teal"
            >
              !
            </button>
            <b className="block font-display text-4xl leading-tight tabular-nums">{score === null ? "—" : Math.round(score)}</b>
            <span
              id={tooltipId}
              role="tooltip"
              className={`invisible absolute top-full z-10 mt-1 w-60 rounded-lg border border-line bg-surface p-3 text-left text-xs font-normal leading-snug text-fg opacity-0 shadow-lg transition-opacity motion-reduce:transition-none group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${TOOLTIP_POSITION[i]}`}
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
