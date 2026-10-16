import type { ScoreTier } from "@/lib/profile";

// Forte/fraco com cor cheia; bom/ruim com a mesma cor mais apagada; neutro sem cor.
export const TIER_CLASS: Record<ScoreTier, string> = {
  strong: "bg-strong-bg text-strong",
  good: "bg-strong-bg/40 text-strong",
  neutral: "bg-card-inner",
  poor: "bg-weak-bg/40 text-weak",
  weak: "bg-weak-bg text-weak",
};
