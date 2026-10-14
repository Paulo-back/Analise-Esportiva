import { notFound, redirect } from "next/navigation";
import { DEFAULT_API_LEAGUE_ID, getProfileLeagues } from "@/lib/queries";

export const revalidate = 3600;

export default async function Home() {
  const leagues = await getProfileLeagues();
  const target = leagues.find((l) => l.apiLeagueId === DEFAULT_API_LEAGUE_ID) ?? leagues[0];
  if (!target) notFound();
  redirect(`/liga/${target.id}`);
}
