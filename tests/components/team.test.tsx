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
  byVenue: {
    all: [goals(1.5, 20, 80)], home: [goals(2, 10, 90)], away: [goals(1, 4, 40)],
    turn_1: [goals(1.8, 10, 85)], turn_2: [goals(1.2, 10, 60)],
  },
};

describe("TeamDashboard", () => {
  it("troca de visão ao clicar em Casa", () => {
    render(<TeamDashboard profile={profile} standing={null} months={[]} rivals={[]} />);
    expect(screen.getAllByText("1,50 (30)").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Casa" }));
    expect(screen.getAllByText("2,00 (20)").length).toBeGreaterThan(0);
  });

  it("guarda a visão na URL e abre nela", () => {
    const { unmount } = render(<TeamDashboard profile={profile} standing={null} months={[]} rivals={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Casa" }));
    expect(window.location.search).toBe("?visao=casa");
    unmount();
    render(<TeamDashboard profile={profile} standing={null} months={[]} rivals={[]} />);
    expect(screen.getByRole("button", { name: "Casa" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Geral" }));
    expect(window.location.search).toBe("");
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

describe("TeamDashboard — dados de tempo de jogo", () => {
  function timing(metric: string, total: number, games = 4): MetricRow {
    return {
      metric, dimension: "timing", value: total / games, total, numerator: null, denominator: null,
      leagueAvg: null, percentile: null, gamesCounted: games,
    };
  }

  it("mostra os botões de turno e os gráficos de gols por tempo e por minuto", () => {
    const rows = [
      goals(1.5, 20, 80),
      timing("goals_for_1h", 7), timing("goals_for_2h", 9),
      timing("goals_against_1h", 3), timing("goals_against_2h", 5),
      timing("goals_for_min_76_90", 6), timing("goals_against_min_76_90", 2),
      timing("goals_for_min_0_15", 1), timing("goals_against_min_0_15", 0),
    ];
    const withTiming: TeamProfile = { ...profile, byVenue: { ...profile.byVenue, all: rows } };
    render(<TeamDashboard profile={withTiming} standing={null} months={[]} rivals={[]} />);

    expect(screen.getByRole("button", { name: "1º turno" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2º turno" })).toBeInTheDocument();
    expect(screen.getByText("7 · 3")).toBeInTheDocument(); // 1º tempo: marcados · sofridos
    expect(screen.getByText("6 · 2")).toBeInTheDocument(); // 76-90
  });

  it("mostra artilheiro, gols do banco, intervalo e eficiência da visão escolhida", () => {
    function pct(metric: string, dimension: MetricRow["dimension"], num: number, den: number, leagueAvg: number): MetricRow {
      return {
        metric, dimension, value: (num / den) * 100, total: null, numerator: num, denominator: den,
        leagueAvg, percentile: null, gamesCounted: 10,
      };
    }
    const rows = [
      goals(1.5, 20, 80),
      pct("bench_goals_pct", "goal_profile", 6, 30, 14),
      pct("ht_lead_points_pct", "goal_profile", 27, 30, 80),
      pct("conversion_pct", "efficiency", 30, 90, 30),
    ];
    const withProfile: TeamProfile = { ...profile, byVenue: { ...profile.byVenue, all: rows } };
    const scorers = {
      all: [{ rank: 1, playerName: "Vitor Roque", goals: 12, teamGoals: 30 }],
      home: [{ rank: 1, playerName: "Flaco López", goals: 5, teamGoals: 18 }],
      away: [], turn_1: [], turn_2: [],
    };
    render(<TeamDashboard profile={withProfile} standing={null} months={[]} scorers={scorers} rivals={[]} />);

    expect(screen.getByText("Vitor Roque")).toBeInTheDocument();
    expect(screen.getByText("12 de 30 · 40%")).toBeInTheDocument();
    expect(screen.getByText("20% (6/30)")).toBeInTheDocument();
    expect(screen.getByText("90% (27/30)")).toBeInTheDocument();
    expect(screen.getByText("33% (30/90)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Casa" }));
    expect(screen.getByText("Flaco López")).toBeInTheDocument();
  });

  it("avisa quando o minuto dos gols ainda não chegou", () => {
    render(<TeamDashboard profile={profile} standing={null} months={[]} rivals={[]} />);
    expect(screen.getByText(/Minuto dos gols ainda sendo carregado/)).toBeInTheDocument();
  });
});
