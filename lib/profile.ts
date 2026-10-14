import type { Dimension, JudgedDimension, MetricRow, Venue } from "@/lib/types";

export const STRONG_PERCENTILE = 75;
export const WEAK_PERCENTILE = 25;
export const MIN_GAMES = 5;

export const VENUE_LABELS: Record<Venue, string> = { all: "Geral", home: "Casa", away: "Fora" };

export const JUDGED_DIMENSIONS: JudgedDimension[] = [
  "attack", "defense", "intensity", "set_piece", "discipline",
];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  attack: "Ataque",
  defense: "Defesa",
  intensity: "Intensidade",
  set_piece: "Bola parada",
  discipline: "Disciplina",
  style: "Estilo",
};

type MetricKind = "count" | "mean" | "pct";

// featured = aparece sem precisar expandir "ver todas" no painel do time.
export const METRIC_INFO: Record<string, { label: string; kind: MetricKind; featured: boolean }> = {
  goals_for: { label: "Gols pró", kind: "count", featured: true },
  shots_total: { label: "Chutes", kind: "count", featured: false },
  shots_on_goal: { label: "Chutes no gol", kind: "count", featured: true },
  shots_inside_box_pct: { label: "Chutes de dentro da área", kind: "pct", featured: false },
  conversion_pct: { label: "Conversão", kind: "pct", featured: true },
  key_passes: { label: "Passes-chave", kind: "count", featured: true },
  dribbles_success: { label: "Dribles certos", kind: "count", featured: false },
  penalties_won: { label: "Pênaltis sofridos", kind: "count", featured: false },
  goals_against: { label: "Gols sofridos", kind: "count", featured: true },
  shots_on_goal_against: { label: "Chutes no gol sofridos", kind: "count", featured: true },
  dribbled_past: { label: "Vezes driblado", kind: "count", featured: true },
  penalties_committed: { label: "Pênaltis cometidos", kind: "count", featured: false },
  clean_sheet_pct: { label: "Jogos sem sofrer gol", kind: "pct", featured: false },
  tackles_interceptions: { label: "Desarmes + interceptações", kind: "count", featured: false },
  blocks: { label: "Bloqueios", kind: "count", featured: false },
  save_pct: { label: "Defesas do goleiro", kind: "pct", featured: false },
  duels_won_pct: { label: "Duelos ganhos", kind: "pct", featured: true },
  corners: { label: "Escanteios", kind: "count", featured: true },
  fouls: { label: "Faltas", kind: "count", featured: false },
  yellow_cards: { label: "Amarelos", kind: "count", featured: true },
  red_cards: { label: "Vermelhos", kind: "count", featured: false },
  possession_pct: { label: "Posse", kind: "mean", featured: true },
  passes_total: { label: "Passes", kind: "count", featured: true },
  passes_accuracy_pct: { label: "Precisão de passe", kind: "pct", featured: true },
  offsides: { label: "Impedimentos", kind: "count", featured: false },
};

export function metricLabel(metric: string): string {
  return METRIC_INFO[metric]?.label ?? metric;
}

export function classify(percentile: number | null): "strong" | "weak" | null {
  if (percentile === null) return null;
  if (percentile >= STRONG_PERCENTILE) return "strong";
  if (percentile <= WEAK_PERCENTILE) return "weak";
  return null;
}

export type DimensionScores = Record<JudgedDimension, number | null>;

export function dimensionScores(rows: MetricRow[]): DimensionScores {
  const scores = {} as DimensionScores;
  for (const dimension of JUDGED_DIMENSIONS) {
    const values = rows
      .filter((r) => r.dimension === dimension && r.percentile !== null)
      .map((r) => r.percentile as number);
    scores[dimension] = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }
  return scores;
}

export function strengthsAndWeaknesses(rows: MetricRow[]) {
  const strengths = rows
    .filter((r) => classify(r.percentile) === "strong")
    .sort((a, b) => (b.percentile as number) - (a.percentile as number));
  const weaknesses = rows
    .filter((r) => classify(r.percentile) === "weak")
    .sort((a, b) => (a.percentile as number) - (b.percentile as number));
  return { strengths, weaknesses };
}

export function standingsBadge(
  scores: DimensionScores
): { dimension: JudgedDimension; kind: "strong" | "weak" } | null {
  const entries = JUDGED_DIMENSIONS
    .map((d) => [d, scores[d]] as const)
    .filter((e): e is readonly [JudgedDimension, number] => e[1] !== null);
  if (!entries.length) return null;
  const best = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  if (best[1] >= STRONG_PERCENTILE) return { dimension: best[0], kind: "strong" };
  const worst = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
  if (worst[1] <= WEAK_PERCENTILE) return { dimension: worst[0], kind: "weak" };
  return null;
}

export function hasEnoughSample(rows: MetricRow[]): boolean {
  const goals = rows.find((r) => r.metric === "goals_for");
  return !!goals && goals.gamesCounted >= MIN_GAMES;
}

export function pickRows(rows: MetricRow[], metric: string): MetricRow | undefined {
  return rows.find((r) => r.metric === metric);
}

export function formatNumber(n: number, digits: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function formatMetric(row: MetricRow): string {
  if (row.value === null) return "—";
  const kind = METRIC_INFO[row.metric]?.kind ?? "count";
  if (kind === "pct") {
    const base = `${formatNumber(row.value, 0)}%`;
    if (row.numerator === null || row.denominator === null) return base;
    return `${base} (${formatNumber(row.numerator, 0)}/${formatNumber(row.denominator, 0)})`;
  }
  if (kind === "mean") return `${formatNumber(row.value, 0)}%`;
  const avg = formatNumber(row.value, 2);
  return row.total === null ? avg : `${avg} (${formatNumber(row.total, 0)})`;
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatMonth(month: string): string {
  return MONTHS[Number(month.slice(5, 7)) - 1] ?? month;
}

export function canCompare(
  a: { leagueId: number; season: number },
  b: { leagueId: number; season: number }
): boolean {
  return a.leagueId === b.leagueId && a.season === b.season;
}
