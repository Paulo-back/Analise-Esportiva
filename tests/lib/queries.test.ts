import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { pool } from "@/lib/db";
import {
  getLeagueGoalsByMonth,
  getLeagueKpis,
  getLeagueProfiles,
  getProfileLeague,
  getProfileLeagues,
  getStandings,
  getTeamGoalsByMonth,
  getComputedAt,
  getTeamProfile,
} from "@/lib/queries";

const hasDb = !!process.env.DATABASE_URL;

async function seed() {
  await pool.query(`
    INSERT INTO leagues (id, api_league_id, name) VALUES (1, 71, 'Brasileirão Série A'), (2, 39, 'Premier League');
    INSERT INTO teams (id, name) VALUES (10, 'Palmeiras'), (11, 'Flamengo'), (12, 'Santos'), (20, 'Arsenal');
    INSERT INTO fixtures (league_id, home_team_id, away_team_id, match_date, status, season, home_score, away_score) VALUES
      (1, 10, 11, '2026-04-05T20:00:00Z', 'FT', 2026, 2, 1),
      (1, 11, 12, '2026-04-12T20:00:00Z', 'FT', 2026, 3, 3),
      (1, 12, 10, '2026-05-03T20:00:00Z', 'FT', 2026, 0, 1),
      (1, 10, 12, '2026-05-10T20:00:00Z', 'NS', 2026, NULL, NULL),
      (1, 10, 11, '2025-09-01T20:00:00Z', 'FT', 2025, 0, 5);
  `);
  const metric = (team: number, league: number, season: number, venue: string, m: string,
                  dim: string, value: number | null, pct: number | null) =>
    `(${team}, ${league}, ${season}, '${venue}', '${m}', '${dim}', ${value ?? "NULL"}, ${value === null ? "NULL" : value * 2}, NULL, NULL, 1, ${pct ?? "NULL"}, 2)`;
  await pool.query(`
    INSERT INTO team_profile_metrics (team_id, league_id, season, venue, metric, dimension, value, total, numerator, denominator, league_avg, percentile, games_counted) VALUES
      ${[
        metric(10, 1, 2026, "all", "goals_for", "attack", 1.5, 100),
        metric(10, 1, 2026, "home", "goals_for", "attack", 2, 100),
        metric(10, 1, 2026, "away", "goals_for", "attack", 1, 50),
        metric(11, 1, 2026, "all", "goals_for", "attack", 2, 0),
        metric(20, 2, 2026, "all", "goals_for", "attack", 3, 100),
      ].join(",\n")}
  `);
}

describe.skipIf(!hasDb)("queries", () => {
  beforeEach(seed);
  afterEach(async () => {
    await pool.query("TRUNCATE team_profile_metrics, fixtures, teams, leagues RESTART IDENTITY CASCADE");
  });

  it("getProfileLeagues lista ligas com perfil e a temporada", async () => {
    const leagues = await getProfileLeagues();
    expect(leagues.map((l) => [l.name, l.season, l.apiLeagueId])).toEqual([
      ["Brasileirão Série A", 2026, 71],
      ["Premier League", 2026, 39],
    ]);
  });

  it("getProfileLeague devolve null para liga sem perfil", async () => {
    expect(await getProfileLeague(999)).toBeNull();
    expect((await getProfileLeague(1))?.season).toBe(2026);
  });

  it("getLeagueKpis conta só jogos finalizados da temporada", async () => {
    expect(await getLeagueKpis(1, 2026)).toEqual({ matches: 3, goals: 10, avgGoals: 10 / 3 });
  });

  it("getStandings ordena por pontos e calcula saldo", async () => {
    const rows = await getStandings(1, 2026);
    expect(rows.map((r) => [r.teamName, r.points, r.goalDiff, r.played, r.position])).toEqual([
      ["Palmeiras", 6, 2, 2, 1],
      ["Flamengo", 1, -1, 2, 2],
      ["Santos", 1, -1, 2, 3],
    ]);
  });

  it("getLeagueGoalsByMonth agrupa por mês", async () => {
    expect(await getLeagueGoalsByMonth(1, 2026)).toEqual([
      { month: "2026-04", goals: 9 },
      { month: "2026-05", goals: 1 },
    ]);
  });

  it("getTeamGoalsByMonth separa marcados e sofridos", async () => {
    expect(await getTeamGoalsByMonth(10, 1, 2026)).toEqual([
      { month: "2026-04", scored: 2, conceded: 1 },
      { month: "2026-05", scored: 1, conceded: 0 },
    ]);
  });

  it("getLeagueProfiles traz uma entrada por time com as métricas da visão", async () => {
    const profiles = await getLeagueProfiles(1, 2026, "all");
    expect(profiles.map((p) => [p.teamName, p.rows[0].value, p.rows[0].percentile])).toEqual([
      ["Flamengo", 2, 0],
      ["Palmeiras", 1.5, 100],
    ]);
  });

  it("getTeamProfile agrupa por visão e converte NUMERIC para number", async () => {
    const profile = await getTeamProfile(10);
    expect(profile?.leagueName).toBe("Brasileirão Série A");
    expect(profile?.season).toBe(2026);
    expect(profile?.byVenue.home[0]).toMatchObject({ metric: "goals_for", value: 2, total: 4, percentile: 100 });
    expect(profile?.byVenue.away[0].percentile).toBe(50);
  });

  it("getTeamProfile devolve null para time sem perfil", async () => {
    expect(await getTeamProfile(12)).toBeNull();
  });

  it("getComputedAt devolve a data do último cálculo", async () => {
    expect(await getComputedAt()).toBeInstanceOf(Date);
  });
});
