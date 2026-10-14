import { describe, expect, it } from "vitest";
import { BRAND_NAME } from "@/lib/brand";

describe("brand", () => {
  it("não referencia o TribunaStats", () => {
    expect(BRAND_NAME.toLowerCase()).not.toContain("tribuna");
  });
});
