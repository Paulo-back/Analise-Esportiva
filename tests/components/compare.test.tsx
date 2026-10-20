import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompareDashboard, compareWinner, dimensionTally, tallyLabel } from "@/components/CompareDashboard";
import { MirrorBar } from "@/components/MirrorBar";
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
    byVenue: { all: rows, home: rows, away: rows, turn_1: rows, turn_2: rows },
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

  it("eficiência, faltas e desarmes não têm vencedor; saldo maior é melhor", () => {
    expect(compareWinner("conversion_pct", 40, 20)).toBeNull();
    expect(compareWinner("goals_minus_xg", 0.4, -0.2)).toBeNull();
    expect(compareWinner("fouls", 10, 14)).toBeNull();
    expect(compareWinner("tackles_interceptions", 30, 20)).toBeNull();
    expect(compareWinner("xg_diff", -0.3, 0.5)).toBe("b");
  });

  it("xG sofrido e gols sofridos por tempo: menor é melhor", () => {
    expect(compareWinner("xg_against", 1.4, 0.9)).toBe("b");
    expect(compareWinner("goals_against_1h", 1.0, 0.68)).toBe("b");
    expect(compareWinner("goals_against_2h", 0.5, 0.8)).toBe("a");
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
  it("não mostra o perfil dos gols, que fica só no painel do time", () => {
    const base = team(10, "Palmeiras", 1.78, 0.63);
    const rows = [...base.byVenue.all, row("bench_goals_pct", "goal_profile", 20, 50)];
    const a = { ...base, byVenue: { ...base.byVenue, all: rows } };
    render(<CompareDashboard a={a} b={team(11, "Flamengo", 2.04, 0.74)} rivals={[]} />);
    expect(screen.queryByText("Gols de quem saiu do banco")).not.toBeInTheDocument();
  });

  it("mostra os dois lados com média (total)", () => {
    render(
      <CompareDashboard a={team(10, "Palmeiras", 1.78, 0.63)} b={team(11, "Flamengo", 2.04, 0.74)}
        rivals={[{ teamId: 11, teamName: "Flamengo", teamLogoUrl: null }]} />
    );
    expect(screen.getByText("1,78 (18)")).toBeInTheDocument();
    expect(screen.getByText("2,04 (20)")).toBeInTheDocument();
  });
});

describe("MirrorBar", () => {
  it("marca só o valor do vencedor", () => {
    render(<MirrorBar label="Ataque" a={80} b={60} aText="80" bText="60" max={100} winner="a" />);
    expect(screen.getByText("80")).toHaveAttribute("data-winner", "true");
    expect(screen.getByText("60")).not.toHaveAttribute("data-winner");
    expect(screen.getByLabelText("Ataque: 80 × 60")).toBeInTheDocument();
  });

  it("sem vencedor não marca nenhum lado", () => {
    const { container } = render(<MirrorBar label="Posse" a={55} b={45} aText="55%" bText="45%" max={55} winner={null} />);
    expect(container.querySelectorAll("[data-winner]")).toHaveLength(0);
  });

  it("valor ausente aparece como travessão", () => {
    render(<MirrorBar label="xG" a={null} b={1.2} aText="—" bText="1,20" max={1.2} winner={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("placar de dimensões", () => {
  const s = (attack: number | null, defense: number | null) =>
    ({ dominance: null, attack, defense, intensity: null, set_piece: null, discipline: null });

  it("conta só dimensões com as duas notas e diferentes", () => {
    expect(dimensionTally(s(80, 40), s(60, 40))).toEqual({ a: 1, b: 0, total: 1 });
    expect(dimensionTally(s(null, 40), s(60, 50))).toEqual({ a: 0, b: 1, total: 1 });
  });

  it("escreve vitória, empate ou nada", () => {
    expect(tallyLabel("Palmeiras", "Flamengo", { a: 3, b: 2, total: 5 })).toBe("Palmeiras vence 3 de 5 dimensões");
    expect(tallyLabel("Palmeiras", "Flamengo", { a: 1, b: 2, total: 3 })).toBe("Flamengo vence 2 de 3 dimensões");
    expect(tallyLabel("Palmeiras", "Flamengo", { a: 2, b: 2, total: 4 })).toBe("Empate em dimensões (2 a 2)");
    expect(tallyLabel("Palmeiras", "Flamengo", { a: 0, b: 0, total: 0 })).toBeNull();
  });
});
