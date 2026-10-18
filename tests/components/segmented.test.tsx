import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Segmented } from "@/components/Segmented";

const options = [
  { value: "all", label: "Geral" },
  { value: "home", label: "Casa" },
] as const;

describe("Segmented", () => {
  it("marca a opção ativa com aria-pressed e avisa a troca", () => {
    const onChange = vi.fn();
    render(<Segmented label="Visão" options={options} value="all" onChange={onChange} />);
    expect(screen.getByRole("group", { name: "Visão" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Geral" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Casa" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Casa" }));
    expect(onChange).toHaveBeenCalledWith("home");
  });
});
