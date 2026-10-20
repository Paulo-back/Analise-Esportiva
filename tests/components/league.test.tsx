import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RankingList, topByMetric } from "@/components/RankingList";
import { StandingsTable } from "@/components/StandingsTable";
import { StrengthHeatmap } from "@/components/StrengthHeatmap";
import { UpdatedAt } from "@/components/UpdatedAt";
import type { LeagueTeamProfile, MetricRow } from "@/lib/types";

function profile(teamId: number, value: number | null, games = 10): LeagueTeamProfile {
  const row: MetricRow = {
    metric: "goals_for", dimension: "attack", value, total: value === null ? null : value * games,
    numerator: null, denominator: null, leagueAvg: 1, percentile: 50, gamesCounted: games,
  };
  return { teamId, teamName: `Time ${teamId}`, teamLogoUrl: null, rows: [row] };
}

describe("topByMetric", () => {
  it("ordena, ignora nulos e amostra insuficiente, e formata média (total)", () => {
    const items = topByMetric(
      [profile(1, 1.2), profile(2, 2.0), profile(3, null), profile(4, 9.0, 3)],
      "goals_for", "desc", 2
    );
    expect(items).toEqual([
      { teamId: 2, teamName: "Time 2", display: "2,00 (20)" },
      { teamId: 1, teamName: "Time 1", display: "1,20 (12)" },
    ]);
  });
});

describe("RankingList", () => {
  it("renderiza link para o time", () => {
    render(<RankingList items={[{ teamId: 2, teamName: "Time 2", display: "2,00 (20)" }]} />);
    expect(screen.getByRole("link", { name: "Time 2" })).toHaveAttribute("href", "/time/2");
  });
});

describe("StandingsTable", () => {
  it("mostra a melhor e a pior dimensão com a nota", () => {
    render(
      <StandingsTable
        rows={[{
          teamId: 1, teamName: "Palmeiras", teamLogoUrl: null, position: 1, points: 56, played: 27,
          wins: 17, draws: 5, losses: 5, goalsFor: 48, goalsAgainst: 17, goalDiff: 31,
        }]}
        highlights={{ 1: {
          best: { dimension: "defense", score: 91, tier: "strong" },
          worst: { dimension: "set_piece", score: 36.4, tier: "poor" },
        } }}
      />
    );
    // Renderizado 2x: abaixo do nome (celular) e na coluna própria (sm+); o CSS esconde um deles.
    for (const text of ["Defesa", "91", "Bola parada", "36"]) {
      expect(screen.getAllByText(text)).toHaveLength(2);
    }
    expect(screen.getByText("+31")).toBeInTheDocument();
  });
});

describe("UpdatedAt", () => {
  it("formata a data em pt-BR", () => {
    render(<UpdatedAt date={new Date("2026-10-14T10:00:00Z")} />);
    expect(screen.getByText("Dados atualizados em 14/10/2026")).toBeInTheDocument();
  });
});

describe("StrengthHeatmap", () => {
  it("mostra as notas por dimensão", () => {
    render(
      <StrengthHeatmap
        teams={[{ teamId: 1, teamName: "Palmeiras", scores: { dominance: null, attack: 66, defense: 91, intensity: null, set_piece: 79, discipline: 19 } }]}
      />
    );
    expect(screen.getByText("91")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Palmeiras" })).toHaveAttribute("href", "/time/1");
  });
});
