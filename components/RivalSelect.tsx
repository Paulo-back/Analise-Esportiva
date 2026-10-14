"use client";

import { useRouter } from "next/navigation";
import type { TeamRef } from "@/lib/types";

export function RivalSelect({ teamId, rivalId, rivals }: { teamId: number; rivalId: number; rivals: TeamRef[] }) {
  const router = useRouter();
  return (
    <select
      value={rivalId}
      onChange={(e) => router.push(`/time/${teamId}/vs/${e.target.value}`)}
      className="rounded-lg bg-fg px-2 py-1 text-sm text-bg"
      aria-label="Escolher rival da mesma liga"
    >
      {rivals.map((r) => (
        <option key={r.teamId} value={r.teamId}>{r.teamName}</option>
      ))}
    </select>
  );
}
