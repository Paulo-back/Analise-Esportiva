import type { ScoreTier } from "@/lib/profile";

// Escala da nota (variáveis tier-1…5 em globals.css): cheio nas pontas, claro em bom/ruim, cinza no neutro.
export const TIER_CLASS: Record<ScoreTier, string> = {
  strong: "bg-tier-5 text-tier-5-fg",
  good: "bg-tier-4 text-tier-4-fg",
  neutral: "bg-tier-3 text-tier-3-fg",
  poor: "bg-tier-2 text-tier-2-fg",
  weak: "bg-tier-1 text-tier-1-fg",
};
