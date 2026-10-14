import Link from "next/link";
import type { ProfileLeague } from "@/lib/types";

export function LeaguePills({ leagues, activeId }: { leagues: ProfileLeague[]; activeId: number }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {leagues.map((l) => (
        <Link
          key={l.id}
          href={`/liga/${l.id}`}
          className={`rounded-full border px-3 py-1 text-xs ${
            l.id === activeId ? "border-accent bg-accent font-bold text-bg" : "border-line hover:border-accent"
          }`}
        >
          {l.name}
        </Link>
      ))}
    </nav>
  );
}
