import { describe, expect, it } from "vitest";
import {
  METRIC_INFO,
  canCompare,
  classify,
  dimensionScores,
  formatMetric,
  formatMonth,
  hasEnoughSample,
  standingsBadge,
  strengthsAndWeaknesses,
} from "@/lib/profile";
import type { MetricRow } from "@/lib/types";

function row(partial: Partial<MetricRow> & Pick<MetricRow, "metric">): MetricRow {
  return {
    dimension: "attack",
    value: 1,
    total: 10,
    numerator: null,
    denominator: null,
    leagueAvg: 1,
    percentile: 50,
    gamesCounted: 10,
    ...partial,
  };
}

describe("METRIC_INFO", () => {
  it("cobre as 25 métricas do pipeline", () => {
    expect(Object.keys(METRIC_INFO)).toHaveLength(25);
  });
});

describe("classify", () => {
  it("marca forte em >= 75 e fraco em <= 25", () => {
    expect(classify(75)).toBe("strong");
    expect(classify(74.9)).toBeNull();
    expect(classify(25)).toBe("weak");
    expect(classify(null)).toBeNull();
  });
});

describe("dimensionScores", () => {
  it("faz a média dos percentis não nulos por dimensão e ignora estilo", () => {
    const scores = dimensionScores([
      row({ metric: "goals_for", dimension: "attack", percentile: 80 }),
      row({ metric: "shots_total", dimension: "attack", percentile: 60 }),
      row({ metric: "key_passes", dimension: "attack", percentile: null }),
      row({ metric: "corners", dimension: "set_piece", percentile: 90 }),
      row({ metric: "possession_pct", dimension: "style", percentile: null }),
    ]);
    expect(scores.attack).toBe(70);
    expect(scores.set_piece).toBe(90);
    expect(scores.defense).toBeNull();
    expect("style" in scores).toBe(false);
  });
});

describe("strengthsAndWeaknesses", () => {
  it("ordena fortes do maior percentil e fracos do menor", () => {
    const { strengths, weaknesses } = strengthsAndWeaknesses([
      row({ metric: "goals_for", percentile: 80 }),
      row({ metric: "corners", dimension: "set_piece", percentile: 95 }),
      row({ metric: "yellow_cards", dimension: "discipline", percentile: 20 }),
      row({ metric: "fouls", dimension: "discipline", percentile: 5 }),
      row({ metric: "shots_total", percentile: 50 }),
    ]);
    expect(strengths.map((r) => r.metric)).toEqual(["corners", "goals_for"]);
    expect(weaknesses.map((r) => r.metric)).toEqual(["fouls", "yellow_cards"]);
  });
});

describe("standingsBadge", () => {
  it("prefere a dimensão mais forte quando >= 75", () => {
    expect(
      standingsBadge({ attack: 80, defense: 91, intensity: 50, set_piece: 10, discipline: 40 })
    ).toEqual({ dimension: "defense", kind: "strong" });
  });
  it("cai para a mais fraca quando nenhuma é forte", () => {
    expect(
      standingsBadge({ attack: 60, defense: 50, intensity: 22, set_piece: 30, discipline: 40 })
    ).toEqual({ dimension: "intensity", kind: "weak" });
  });
  it("sem selo quando nada passa dos cortes", () => {
    expect(
      standingsBadge({ attack: 60, defense: 50, intensity: null, set_piece: 30, discipline: 40 })
    ).toBeNull();
  });
});

describe("formatMetric", () => {
  it("contagem: média (total)", () => {
    expect(formatMetric(row({ metric: "goals_for", value: 1.7777, total: 48 }))).toBe("1,78 (48)");
  });
  it("porcentagem: pct% (num/den) com milhar pt-BR", () => {
    expect(
      formatMetric(
        row({ metric: "duels_won_pct", value: 51.0, total: null, numerator: 1430, denominator: 2804 })
      )
    ).toBe("51% (1.430/2.804)");
  });
  it("média simples (posse): só pct", () => {
    expect(formatMetric(row({ metric: "possession_pct", value: 57.6, total: null }))).toBe("58%");
  });
  it("sem valor: travessão", () => {
    expect(formatMetric(row({ metric: "goals_for", value: null, total: null }))).toBe("—");
  });
});

describe("hasEnoughSample", () => {
  it("usa os jogos de goals_for como amostra da visão", () => {
    expect(hasEnoughSample([row({ metric: "goals_for", gamesCounted: 5 })])).toBe(true);
    expect(hasEnoughSample([row({ metric: "goals_for", gamesCounted: 4 })])).toBe(false);
    expect(hasEnoughSample([])).toBe(false);
  });
});

describe("canCompare", () => {
  it("só permite mesma liga e mesma temporada", () => {
    expect(canCompare({ leagueId: 1, season: 2026 }, { leagueId: 1, season: 2026 })).toBe(true);
    expect(canCompare({ leagueId: 1, season: 2026 }, { leagueId: 2, season: 2026 })).toBe(false);
    expect(canCompare({ leagueId: 1, season: 2026 }, { leagueId: 1, season: 2025 })).toBe(false);
  });
});

describe("formatMonth", () => {
  it("abrevia o mês em pt-BR", () => {
    expect(formatMonth("2026-04")).toBe("abr");
    expect(formatMonth("2026-12")).toBe("dez");
  });
});
