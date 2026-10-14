import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareDashboard } from "@/components/CompareDashboard";
import { canCompare } from "@/lib/profile";
import { getLeagueProfiles, getTeamProfile } from "@/lib/queries";

export const revalidate = 3600;

// Lista vazia: vira ISR em vez de rota dinâmica (ver app/liga/[id]/page.tsx).
export async function generateStaticParams() {
  return [];
}

export default async function ComparePage({ params }: { params: Promise<{ id: string; rivalId: string }> }) {
  const { id, rivalId } = await params;
  const teamId = Number(id);
  const otherId = Number(rivalId);
  if (!Number.isInteger(teamId) || !Number.isInteger(otherId)) notFound();

  const [a, b] = await Promise.all([getTeamProfile(teamId), getTeamProfile(otherId)]);
  if (!a) notFound();

  // Trava: nunca compara times de ligas/temporadas diferentes (ex.: Real Madrid x Palmeiras).
  if (!b || otherId === teamId || !canCompare(a, b)) {
    return (
      <div className="rounded-xl border border-weak bg-weak-bg p-6 text-weak">
        <p className="font-bold">Comparação indisponível</p>
        <p className="mt-1 text-sm">
          Só dá para comparar {a.teamName} com times do {a.leagueName} {a.season}.
        </p>
        <Link href={`/time/${a.teamId}`} className="mt-3 inline-block text-accent">Ver o painel de {a.teamName}</Link>
      </div>
    );
  }

  const leagueProfiles = await getLeagueProfiles(a.leagueId, a.season, "all");
  const rivals = leagueProfiles
    .filter((p) => p.teamId !== a.teamId)
    .map(({ teamId: tid, teamName, teamLogoUrl }) => ({ teamId: tid, teamName, teamLogoUrl }));

  return <CompareDashboard a={a} b={b} rivals={rivals} />;
}
