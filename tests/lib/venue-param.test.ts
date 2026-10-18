import { describe, expect, it } from "vitest";
import { venueFromSlug } from "@/lib/useVenueParam";

describe("venueFromSlug", () => {
  it("traduz o valor da URL para a visão", () => {
    expect(venueFromSlug("fora")).toBe("away");
    expect(venueFromSlug("turno-2")).toBe("turn_2");
  });

  it("cai em Geral quando o valor falta ou é inválido", () => {
    expect(venueFromSlug(null)).toBe("all");
    expect(venueFromSlug("xyz")).toBe("all");
  });
});
