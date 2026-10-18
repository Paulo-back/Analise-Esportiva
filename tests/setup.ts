import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { pool } from "@/lib/db";

beforeAll(async () => {
  if (!process.env.DATABASE_URL) return;
  await pool.query("CREATE SCHEMA IF NOT EXISTS dashboard_test");
  const { rows } = await pool.query("SELECT current_schema() AS schema");
  // Trava de segurança: os testes fazem TRUNCATE. Nunca rodar fora do schema isolado.
  if (rows[0].schema !== "dashboard_test") {
    throw new Error(
      `Testes exigem search_path=dashboard_test na DATABASE_URL (atual: ${rows[0].schema})`
    );
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leagues (
      id INTEGER PRIMARY KEY,
      api_league_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '',
      logo_url TEXT
    );
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT
    );
    CREATE TABLE IF NOT EXISTS fixtures (
      id SERIAL PRIMARY KEY,
      league_id INTEGER NOT NULL REFERENCES leagues(id),
      home_team_id INTEGER NOT NULL REFERENCES teams(id),
      away_team_id INTEGER NOT NULL REFERENCES teams(id),
      match_date TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL,
      season INTEGER,
      home_score INTEGER,
      away_score INTEGER
    );
    CREATE TABLE IF NOT EXISTS team_profile_metrics (
      id SERIAL PRIMARY KEY,
      team_id INTEGER NOT NULL REFERENCES teams(id),
      league_id INTEGER NOT NULL REFERENCES leagues(id),
      season INTEGER NOT NULL,
      venue TEXT NOT NULL,
      metric TEXT NOT NULL,
      dimension TEXT NOT NULL,
      value NUMERIC,
      total NUMERIC,
      numerator NUMERIC,
      denominator NUMERIC,
      league_avg NUMERIC,
      percentile NUMERIC,
      games_counted INTEGER NOT NULL,
      computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (team_id, league_id, season, venue, metric)
    );
  `);
});

// Componentes guardam a visão na URL (?visao=); cada teste começa sem query string.
afterEach(() => {
  if (typeof window !== "undefined") window.history.replaceState(null, "", "/");
});

afterAll(async () => {
  if (process.env.DATABASE_URL) await pool.end();
});
