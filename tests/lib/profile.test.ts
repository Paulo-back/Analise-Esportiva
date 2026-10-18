import { describe, expect, it } from "vitest";
import {
  METRIC_INFO,
  canCompare,
  classify,
  dimensionScores,
  formatMetric,
  formatMonth,
  hasEnoughSample,
  scoreTier,
  standingsHighlights,
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
  it("cobre as 32 métricas do pipeline que aparecem em lista", () => {
    // 25 originais + 3 de xG + 4 de gols por tempo; as 12 faixas de minuto só aparecem no gráfico.
    expect(Object.keys(METRIC_INFO)).toHaveLength(32);
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

describe("scoreTier", () => {
  it("divide a nota em 5 faixas, com os cortes de forte/fraco inclusivos", () => {
    expect([75, 74, 60, 59, 40, 39, 26, 25, 0].map(scoreTier)).toEqual([
      "strong", "good", "good", "neutral", "neutral", "poor", "poor", "weak", "weak",
    ]);
    expect(scoreTier(null)).toBeNull();
  });
});

describe("standingsHighlights", () => {
  it("devolve a melhor e a pior dimensão com nota e faixa, mesmo no meio da escala", () => {
    expect(
      standingsHighlights({ attack: 51, defense: 39, intensity: 68, set_piece: 58, discipline: 36 })
    ).toEqual({
      best: { dimension: "intensity", score: 68, tier: "good" },
      worst: { dimension: "discipline", score: 36, tier: "poor" },
    });
  });
  it("ignora dimensões sem nota", () => {
    expect(
      standingsHighlights({ attack: 80, defense: null, intensity: 50, set_piece: 10, discipline: null })
    ).toEqual({
      best: { dimension: "attack", score: 80, tier: "strong" },
      worst: { dimension: "set_piece", score: 10, tier: "weak" },
    });
  });
  it("só uma dimensão com nota: sem pior, para não repetir a mesma", () => {
    expect(
      standingsHighlights({ attack: 70, defense: null, intensity: null, set_piece: null, discipline: null })
    ).toEqual({ best: { dimension: "attack", score: 70, tier: "good" }, worst: null });
  });
  it("nenhuma nota: null", () => {
    expect(
      standingsHighlights({ attack: null, defense: null, intensity: null, set_piece: null, discipline: null })
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
