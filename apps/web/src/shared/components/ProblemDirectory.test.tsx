import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProgressProvider } from "../../auth/ProgressProvider";
import type { ProgressAuth, ProgressRepository } from "../../auth/types";
import { getCompanyCollection } from "../../catalog/companyCollections";
import { ProblemDirectory } from "./ProblemDirectory";

function renderDirectory(completedIds = new Set<number>()) {
  const auth: ProgressAuth = {
    configured: true,
    getUser: vi.fn(async () => ({ id: "user-1", email: "learner@example.com", name: "Learner" })),
    onUserChange: vi.fn(() => () => undefined),
    signInWithGoogle: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
  };
  const repository: ProgressRepository = {
    load: vi.fn(async () => new Set(completedIds)),
    mark: vi.fn(async () => undefined),
    unmark: vi.fn(async () => undefined),
  };

  render(
    <ProgressProvider auth={auth} repository={repository}>
      <ProblemDirectory />
    </ProgressProvider>,
  );

  return { auth, repository };
}

function idsInRows() {
  return screen.getAllByRole("article").map((row) => Number(row.getAttribute("data-problem-id")));
}

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

describe("ProblemDirectory", () => {
  it("renders a leading completion button that does not navigate", async () => {
    const user = userEvent.setup();
    renderDirectory();

    const completionControl = await screen.findByRole("button", { name: "Mark #1 complete" });
    await user.click(completionControl);

    expect(window.location.hash).toBe("");
    expect(screen.getByRole("button", { name: "Mark #1 incomplete" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("filters completed rows and puts a selected company in frequency order", async () => {
    const user = userEvent.setup();
    renderDirectory(new Set([1]));

    await screen.findByRole("button", { name: "Mark #1 incomplete" });
    await user.selectOptions(screen.getByLabelText("Completion"), "Completed");

    expect(idsInRows()).toEqual([1]);

    await user.selectOptions(screen.getByLabelText("Completion"), "All");
    await user.selectOptions(screen.getByLabelText("List"), "Google · 3 months");

    const google = getCompanyCollection("Google");
    expect(idsInRows().slice(0, 3)).toEqual(google.problems.slice(0, 3).map((problem) => problem.id));
    expect(screen.getByLabelText("Google · 3 months progress").textContent).toContain(`1 / ${google.problems.length}`);
  });
});
