"use client";

import { useRouter } from "next/navigation";
import type { TeamRef } from "@/lib/types";

export function RivalSelect({ teamId, rivalId, rivals }: { teamId: number; rivalId: number; rivals: TeamRef[] }) {
  const router = useRouter();
  return (
    <select
      value={rivalId}
      onChange={(e) => router.push(`/time/${teamId}/vs/${e.target.value}`)}
      className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-fg hover:border-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
      aria-label="Escolher rival da mesma liga"
    >
      {rivals.map((r) => (
        <option key={r.teamId} value={r.teamId}>{r.teamName}</option>
      ))}
    </select>
  );
}
