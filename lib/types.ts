// "venue" é o recorte: geral, casa, fora e os dois turnos (metade das rodadas).
export type Venue = "all" | "home" | "away" | "turn_1" | "turn_2";
export type Dimension =
  | "dominance" | "attack" | "defense" | "intensity" | "set_piece" | "discipline"
  | "style" | "timing" | "efficiency" | "goal_profile";
// Informativas: sem percentil e fora das notas.
export type InformativeDimension = "style" | "timing" | "efficiency" | "goal_profile";
export type JudgedDimension = Exclude<Dimension, InformativeDimension>;

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

// Artilheiro do time num recorte (pipeline: team_top_scorers); teamGoals inclui gol contra a favor.
export interface TopScorer {
  rank: number;
  playerName: string;
  goals: number;
  teamGoals: number;
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
