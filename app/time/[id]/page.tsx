import { notFound } from "next/navigation";
import { TeamDashboard } from "@/components/TeamDashboard";
import { UpdatedAt } from "@/components/UpdatedAt";
import {
  getComputedAt, getLeagueProfiles, getStandings, getTeamGoalsByMonth, getTeamProfile, getTeamTopScorers,
} from "@/lib/queries";

export const revalidate = 3600;

// Lista vazia: vira ISR em vez de rota dinâmica (ver app/liga/[id]/page.tsx).
export async function generateStaticParams() {
  return [];
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const teamId = Number((await params).id);
  if (!Number.isInteger(teamId)) notFound();
  const profile = await getTeamProfile(teamId);
  if (!profile) notFound();

  const [standings, months, scorers, leagueProfiles, computedAt] = await Promise.all([
    getStandings(profile.leagueId, profile.season),
    getTeamGoalsByMonth(teamId, profile.leagueId, profile.season),
    getTeamTopScorers(teamId, profile.leagueId, profile.season),
    getLeagueProfiles(profile.leagueId, profile.season, "all"),
    getComputedAt(),
  ]);
  const rivals = leagueProfiles
    .filter((p) => p.teamId !== teamId)
    .map(({ teamId: id, teamName, teamLogoUrl }) => ({ teamId: id, teamName, teamLogoUrl }));

  return (
    <div className="space-y-4">
      <TeamDashboard
        profile={profile}
        standing={standings.find((s) => s.teamId === teamId) ?? null}
        months={months}
        scorers={scorers}
        rivals={rivals}
      />
      <UpdatedAt date={computedAt} />
    </div>
  );
}
