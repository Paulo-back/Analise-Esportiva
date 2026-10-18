"use client";

import { useCallback, useEffect, useState } from "react";
import type { Venue } from "@/lib/types";

// Valor da visão na URL (?visao=casa), para o link compartilhado abrir na mesma visão.
const SLUGS: Record<Venue, string> = {
  all: "geral", home: "casa", away: "fora", turn_1: "turno-1", turn_2: "turno-2",
};

export function venueFromSlug(slug: string | null): Venue {
  const hit = (Object.keys(SLUGS) as Venue[]).find((v) => SLUGS[v] === slug);
  return hit ?? "all";
}

// Lê window.location depois de montar (e não useSearchParams) para a página continuar estática no ISR.
export function useVenueParam(key: string): [Venue, (v: Venue) => void] {
  const [venue, setVenue] = useState<Venue>("all");

  useEffect(() => {
    setVenue(venueFromSlug(new URLSearchParams(window.location.search).get(key)));
  }, [key]);

  const update = useCallback((v: Venue) => {
    setVenue(v);
    const url = new URL(window.location.href);
    if (v === "all") url.searchParams.delete(key);
    else url.searchParams.set(key, SLUGS[v]);
    window.history.replaceState(window.history.state, "", url);
  }, [key]);

  return [venue, update];
}
