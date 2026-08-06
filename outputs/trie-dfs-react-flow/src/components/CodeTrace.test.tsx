import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CodeTrace } from "./CodeTrace";

describe("CodeTrace", () => {
  it("expands the code panel and restores its compact state", async () => {
    const user = userEvent.setup();
    render(<CodeTrace activeLines={[2]} codeLines={["class Solution:", "  return 2"]} />);

    const codeTrace = screen.getByRole("region", { name: "Code trace" });
    const toggle = screen.getByRole("button", { name: "Expand code trace" });

    expect(codeTrace.className).not.toContain("is-expanded");
    await user.click(toggle);
    expect(codeTrace.className).toContain("is-expanded");
    expect(screen.getByRole("button", { name: "Collapse code trace" }).getAttribute("aria-expanded")).toBe("true");

    await user.click(screen.getByRole("button", { name: "Collapse code trace" }));
    expect(codeTrace.className).not.toContain("is-expanded");
  });
});
