import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamDashboard } from "@/components/TeamDashboard";
import type { MetricRow, TeamProfile } from "@/lib/types";

function goals(value: number, games: number, percentile: number): MetricRow {
  return {
    metric: "goals_for", dimension: "attack", value, total: value * games,
    numerator: null, denominator: null, leagueAvg: 1.2, percentile, gamesCounted: games,
  };
}

const profile: TeamProfile = {
  teamId: 10, teamName: "Palmeiras", teamLogoUrl: null, leagueId: 1, leagueName: "Brasileirão Série A",
  season: 2026,
  byVenue: { all: [goals(1.5, 20, 80)], home: [goals(2, 10, 90)], away: [goals(1, 4, 40)] },
};

describe("TeamDashboard", () => {
  it("troca de visão ao clicar em Casa", () => {
    render(<TeamDashboard profile={profile} standing={null} months={[]} rivals={[]} />);
    expect(screen.getAllByText("1,50 (30)").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Casa" }));
    expect(screen.getAllByText("2,00 (20)").length).toBeGreaterThan(0);
  });

  it("avisa amostra insuficiente na visão Fora", () => {
    render(<TeamDashboard profile={profile} standing={null} months={[]} rivals={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Fora" }));
    expect(screen.getByText(/amostra insuficiente/i)).toBeInTheDocument();
  });

  it("link de comparação aponta para a rota vs", () => {
    render(
      <TeamDashboard profile={profile} standing={null} months={[]}
        rivals={[{ teamId: 11, teamName: "Flamengo", teamLogoUrl: null }]} />
    );
    expect(screen.getByRole("link", { name: /comparar/i })).toHaveAttribute("href", "/time/10/vs/11");
  });
});
