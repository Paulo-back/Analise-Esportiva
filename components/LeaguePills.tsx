import Link from "next/link";
import type { ProfileLeague } from "@/lib/types";

export function LeaguePills({ leagues, activeId }: { leagues: ProfileLeague[]; activeId: number }) {
  return (
    <nav aria-label="Ligas" className="flex flex-wrap gap-2">
      {leagues.map((l) => {
        const active = l.id === activeId;
        return (
          <Link
            key={l.id}
            href={`/liga/${l.id}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${
              active
                ? "border-transparent bg-brand-gradient font-bold text-fg"
                : "border-line bg-surface hover:border-brand-teal hover:text-brand-teal-ink"
            }`}
          >
            {l.name}
          </Link>
        );
      })}
    </nav>
  );
}
