import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompareDashboard, compareWinner } from "@/components/CompareDashboard";
import { RivalSelect } from "@/components/RivalSelect";
import type { MetricRow, TeamProfile } from "@/lib/types";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function row(metric: string, dimension: MetricRow["dimension"], value: number, percentile: number): MetricRow {
  return { metric, dimension, value, total: value * 10, numerator: null, denominator: null, leagueAvg: 1, percentile, gamesCounted: 10 };
}

function team(id: number, name: string, goalsFor: number, goalsAgainst: number): TeamProfile {
  const rows = [row("goals_for", "attack", goalsFor, 50), row("goals_against", "defense", goalsAgainst, 50)];
  return {
    teamId: id, teamName: name, teamLogoUrl: null, leagueId: 1, leagueName: "Brasileirão Série A", season: 2026,
    byVenue: { all: rows, home: rows, away: rows },
  };
}

describe("compareWinner", () => {
  it("maior é melhor no ataque, menor é melhor na defesa, estilo sem vencedor", () => {
    expect(compareWinner("goals_for", 2, 1)).toBe("a");
    expect(compareWinner("goals_against", 2, 1)).toBe("b");
    expect(compareWinner("possession_pct", 60, 40)).toBeNull();
    expect(compareWinner("goals_for", 1, 1)).toBeNull();
    expect(compareWinner("goals_for", null, 1)).toBeNull();
  });
});

describe("RivalSelect", () => {
  it("lista só os rivais recebidos e navega ao trocar", () => {
    render(
      <RivalSelect teamId={10} rivalId={11}
        rivals={[{ teamId: 11, teamName: "Flamengo", teamLogoUrl: null }, { teamId: 12, teamName: "Santos", teamLogoUrl: null }]} />
    );
    expect(screen.getAllByRole("option")).toHaveLength(2);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "12" } });
    expect(push).toHaveBeenCalledWith("/time/10/vs/12");
  });
});

describe("CompareDashboard", () => {
  it("mostra os dois lados com média (total)", () => {
    render(
      <CompareDashboard a={team(10, "Palmeiras", 1.78, 0.63)} b={team(11, "Flamengo", 2.04, 0.74)}
        rivals={[{ teamId: 11, teamName: "Flamengo", teamLogoUrl: null }]} />
    );
    expect(screen.getByText("1,78 (18)")).toBeInTheDocument();
    expect(screen.getByText("2,04 (20)")).toBeInTheDocument();
  });
});
