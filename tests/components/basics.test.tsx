import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DimensionScores } from "@/components/DimensionScores";
import { MetricList } from "@/components/MetricList";
import { MonthlyGoalsChart } from "@/components/MonthlyGoalsChart";
import { StrengthPills } from "@/components/StrengthPills";
import type { MetricRow } from "@/lib/types";

const base: Omit<MetricRow, "metric" | "dimension"> = {
  value: 1.5, total: 30, numerator: null, denominator: null, leagueAvg: 1.2, percentile: 50, gamesCounted: 20,
};

describe("StrengthPills", () => {
  it("lista fortes e fracos com rótulos em português", () => {
    render(
      <StrengthPills
        rows={[
          { ...base, metric: "corners", dimension: "set_piece", percentile: 90 },
          { ...base, metric: "yellow_cards", dimension: "discipline", percentile: 10 },
        ]}
      />
    );
    expect(screen.getByText("Escanteios")).toBeInTheDocument();
    expect(screen.getByText("Amarelos")).toBeInTheDocument();
  });

  it("mostra mensagem quando não há destaque", () => {
    render(<StrengthPills rows={[{ ...base, metric: "corners", dimension: "set_piece" }]} />);
    expect(screen.getByText(/nenhum ponto forte ou fraco/i)).toBeInTheDocument();
  });
});

describe("DimensionScores", () => {
  it("mostra a nota arredondada e travessão sem dado", () => {
    render(
      <DimensionScores
        scores={{ attack: 66.4, defense: 91, intensity: null, set_piece: 79, discipline: 19 }}
      />
    );
    expect(screen.getByText("66")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("MetricList", () => {
  it("formata média (total) e separa estilo", () => {
    render(
      <MetricList
        rows={[
          { ...base, metric: "goals_for", dimension: "attack", value: 1.78, total: 48 },
          { ...base, metric: "possession_pct", dimension: "style", value: 58, total: null, percentile: null },
        ]}
      />
    );
    expect(screen.getByText("1,78 (48)")).toBeInTheDocument();
    expect(screen.getByText("Estilo")).toBeInTheDocument();
    expect(screen.getByText("58%")).toBeInTheDocument();
  });
});

describe("MonthlyGoalsChart", () => {
  it("rotula cada mês com os valores", () => {
    render(<MonthlyGoalsChart series={[{ label: "abr", primary: 6, secondary: 2 }]} />);
    expect(screen.getByText("abr")).toBeInTheDocument();
    expect(screen.getByText("6 · 2")).toBeInTheDocument();
  });
});
