import { pool } from "@/lib/db";
import type {
  LeagueKpis,
  LeagueMonthGoals,
  LeagueTeamProfile,
  MetricRow,
  ProfileLeague,
  StandingRow,
  TeamMonthGoals,
  TeamProfile,
  Venue,
} from "@/lib/types";

// Liga aberta por padrão em "/": Brasileirão Série A (api_league_id da API-Football).
export const DEFAULT_API_LEAGUE_ID = 71;

const FINISHED = "('FT', 'AET', 'PEN')";

function num(v: unknown): number | null {
  return v === null || v === undefined ? null : Number(v);
}

function toMetricRow(r: Record<string, unknown>): MetricRow {
  return {
    metric: r.metric as string,
    dimension: r.dimension as MetricRow["dimension"],
    value: num(r.value),
    total: num(r.total),
    numerator: num(r.numerator),
    denominator: num(r.denominator),
    leagueAvg: num(r.league_avg),
    percentile: num(r.percentile),
    gamesCounted: Number(r.games_counted),
  };
}

const METRIC_COLUMNS =
  "m.metric, m.dimension, m.value, m.total, m.numerator, m.denominator, m.league_avg, m.percentile, m.games_counted";

function toLeague(r: Record<string, unknown>): ProfileLeague {
  return {
    id: Number(r.id),
    apiLeagueId: Number(r.api_league_id),
    name: r.name as string,
    logoUrl: (r.logo_url as string | null) ?? null,
    season: Number(r.season),
  };
}

const LEAGUES_SQL = `
  SELECT l.id, l.api_league_id, l.name, l.logo_url, MAX(m.season) AS season
  FROM team_profile_metrics m JOIN leagues l ON l.id = m.league_id
  WHERE ($1::int IS NULL OR l.id = $1)
  GROUP BY l.id, l.api_league_id, l.name, l.logo_url
  ORDER BY l.name`;

export async function getProfileLeagues(): Promise<ProfileLeague[]> {
  const { rows } = await pool.query(LEAGUES_SQL, [null]);
  return rows.map(toLeague);
}

export async function getProfileLeague(leagueId: number): Promise<ProfileLeague | null> {
  const { rows } = await pool.query(LEAGUES_SQL, [leagueId]);
  return rows.length ? toLeague(rows[0]) : null;
}

export async function getLeagueKpis(leagueId: number, season: number): Promise<LeagueKpis> {
  const { rows } = await pool.query(
    `SELECT count(*) AS matches, COALESCE(SUM(home_score + away_score), 0) AS goals
     FROM fixtures
     WHERE league_id = $1 AND season = $2 AND status IN ${FINISHED}
       AND home_score IS NOT NULL AND away_score IS NOT NULL`,
    [leagueId, season]
  );
  const matches = Number(rows[0].matches);
  const goals = Number(rows[0].goals);
  return { matches, goals, avgGoals: matches ? goals / matches : null };
}

export async function getStandings(leagueId: number, season: number): Promise<StandingRow[]> {
  const { rows } = await pool.query(
    `WITH finished AS (
       SELECT home_team_id, away_team_id, home_score, away_score FROM fixtures
       WHERE league_id = $1 AND season = $2 AND status IN ${FINISHED}
         AND home_score IS NOT NULL AND away_score IS NOT NULL
     ),
     results AS (
       SELECT home_team_id AS team_id, home_score AS gf, away_score AS ga FROM finished
       UNION ALL
       SELECT away_team_id, away_score, home_score FROM finished
     )
     SELECT t.id AS team_id, t.name AS team_name, t.logo_url AS team_logo_url,
            count(*) AS played,
            sum((r.gf > r.ga)::int) AS wins, sum((r.gf = r.ga)::int) AS draws,
            sum((r.gf < r.ga)::int) AS losses,
            sum(r.gf) AS goals_for, sum(r.ga) AS goals_against
     FROM results r JOIN teams t ON t.id = r.team_id
     GROUP BY t.id, t.name, t.logo_url`,
    [leagueId, season]
  );
  const mapped = rows.map((r) => {
    const wins = Number(r.wins);
    const draws = Number(r.draws);
    const goalsFor = Number(r.goals_for);
    const goalsAgainst = Number(r.goals_against);
    return {
      teamId: Number(r.team_id),
      teamName: r.team_name as string,
      teamLogoUrl: (r.team_logo_url as string | null) ?? null,
      position: 0,
      points: wins * 3 + draws,
      played: Number(r.played),
      wins,
      draws,
      losses: Number(r.losses),
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
    };
  });
  mapped.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.teamName.localeCompare(b.teamName, "pt-BR")
  );
  return mapped.map((row, i) => ({ ...row, position: i + 1 }));
}

export async function getLeagueGoalsByMonth(
  leagueId: number,
  season: number
): Promise<LeagueMonthGoals[]> {
  const { rows } = await pool.query(
    `SELECT to_char(date_trunc('month', match_date AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM') AS month,
            SUM(home_score + away_score) AS goals
     FROM fixtures
     WHERE league_id = $1 AND season = $2 AND status IN ${FINISHED}
       AND home_score IS NOT NULL AND away_score IS NOT NULL
     GROUP BY 1 ORDER BY 1`,
    [leagueId, season]
  );
  return rows.map((r) => ({ month: r.month as string, goals: Number(r.goals) }));
}

export async function getTeamGoalsByMonth(
  teamId: number,
  leagueId: number,
  season: number
): Promise<TeamMonthGoals[]> {
  const { rows } = await pool.query(
    `SELECT to_char(date_trunc('month', match_date AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM') AS month,
            SUM(CASE WHEN home_team_id = $1 THEN home_score ELSE away_score END) AS scored,
            SUM(CASE WHEN home_team_id = $1 THEN away_score ELSE home_score END) AS conceded
     FROM fixtures
     WHERE league_id = $2 AND season = $3 AND status IN ${FINISHED}
       AND home_score IS NOT NULL AND away_score IS NOT NULL
       AND (home_team_id = $1 OR away_team_id = $1)
     GROUP BY 1 ORDER BY 1`,
    [teamId, leagueId, season]
  );
  return rows.map((r) => ({
    month: r.month as string,
    scored: Number(r.scored),
    conceded: Number(r.conceded),
  }));
}

export async function getLeagueProfiles(
  leagueId: number,
  season: number,
  venue: Venue
): Promise<LeagueTeamProfile[]> {
  const { rows } = await pool.query(
    `SELECT t.id AS team_id, t.name AS team_name, t.logo_url AS team_logo_url, ${METRIC_COLUMNS}
     FROM team_profile_metrics m JOIN teams t ON t.id = m.team_id
     WHERE m.league_id = $1 AND m.season = $2 AND m.venue = $3
     ORDER BY t.name, m.metric`,
    [leagueId, season, venue]
  );
  const byTeam = new Map<number, LeagueTeamProfile>();
  for (const r of rows) {
    const teamId = Number(r.team_id);
    if (!byTeam.has(teamId)) {
      byTeam.set(teamId, {
        teamId,
        teamName: r.team_name as string,
        teamLogoUrl: (r.team_logo_url as string | null) ?? null,
        rows: [],
      });
    }
    byTeam.get(teamId)!.rows.push(toMetricRow(r));
  }
  return [...byTeam.values()];
}

export async function getComputedAt(): Promise<Date | null> {
  const { rows } = await pool.query("SELECT MAX(computed_at) AS computed_at FROM team_profile_metrics");
  return rows[0].computed_at ? new Date(rows[0].computed_at as string) : null;
}

export async function getTeamProfile(teamId: number): Promise<TeamProfile | null> {
  const { rows } = await pool.query(
    `WITH target AS (
       SELECT league_id, season FROM team_profile_metrics
       WHERE team_id = $1
       ORDER BY season DESC, league_id ASC
       LIMIT 1
     )
     SELECT t.id AS team_id, t.name AS team_name, t.logo_url AS team_logo_url,
            l.id AS league_id, l.name AS league_name, m.season, m.venue, ${METRIC_COLUMNS}
     FROM team_profile_metrics m
     JOIN target tg ON tg.league_id = m.league_id AND tg.season = m.season
     JOIN teams t ON t.id = m.team_id
     JOIN leagues l ON l.id = m.league_id
     WHERE m.team_id = $1
     ORDER BY m.metric`,
    [teamId]
  );
  if (!rows.length) return null;
  const first = rows[0];
  const byVenue: TeamProfile["byVenue"] = { all: [], home: [], away: [], turn_1: [], turn_2: [] };
  for (const r of rows) byVenue[r.venue as Venue].push(toMetricRow(r));
  return {
    teamId: Number(first.team_id),
    teamName: first.team_name as string,
    teamLogoUrl: (first.team_logo_url as string | null) ?? null,
    leagueId: Number(first.league_id),
    leagueName: first.league_name as string,
    season: Number(first.season),
    byVenue,
  };
}
