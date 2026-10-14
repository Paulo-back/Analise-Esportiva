export type Venue = "all" | "home" | "away";
export type Dimension = "attack" | "defense" | "intensity" | "set_piece" | "discipline" | "style";
export type JudgedDimension = Exclude<Dimension, "style">;

export interface MetricRow {
  metric: string;
  dimension: Dimension;
  value: number | null;
  total: number | null;
  numerator: number | null;
  denominator: number | null;
  leagueAvg: number | null;
  percentile: number | null;
  gamesCounted: number;
}

export interface TeamRef {
  teamId: number;
  teamName: string;
  teamLogoUrl: string | null;
}

export interface ProfileLeague {
  id: number;
  apiLeagueId: number;
  name: string;
  logoUrl: string | null;
  season: number;
}

export interface TeamProfile extends TeamRef {
  leagueId: number;
  leagueName: string;
  season: number;
  byVenue: Record<Venue, MetricRow[]>;
}

export interface LeagueTeamProfile extends TeamRef {
  rows: MetricRow[];
}

export interface StandingRow extends TeamRef {
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
}

export interface LeagueKpis {
  matches: number;
  goals: number;
  avgGoals: number | null;
}

export interface LeagueMonthGoals {
  month: string; // "2026-04"
  goals: number;
}

export interface TeamMonthGoals {
  month: string;
  scored: number;
  conceded: number;
}
