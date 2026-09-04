import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProgressProvider } from "../../auth/ProgressProvider";
import type { ProgressAuth, ProgressRepository } from "../../auth/types";
import { getCompanyCollection, type CompanyName } from "../../catalog/companyCollections";
import { problemCatalog } from "../../catalog/problems";
import type { Problem } from "../../catalog/types";
import { ProblemDirectory } from "./ProblemDirectory";

const googleTestProblems = getCompanyCollection("Google").problems
  .slice(0, 3)
  .map((companyProblem) => problemCatalog.find((problem) => problem.id === companyProblem.id) as Problem);

function renderDirectory(completedIds = new Set<number>(), companyName?: CompanyName) {
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
      <ProblemDirectory problems={companyName ? problemCatalog : googleTestProblems} companyName={companyName} />
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
    expect(screen.getByLabelText("Google · 3 months progress").textContent).toContain(`1 / ${googleTestProblems.length}`);
  });

  it("renders a dedicated company page with its frequency ranking and LeetCode links", async () => {
    renderDirectory(new Set(), "Amazon");

    const amazon = getCompanyCollection("Amazon");
    await screen.findByRole("heading", { name: "Amazon · 3 months" });

    expect(screen.queryByLabelText("List")).toBeNull();
    expect(idsInRows().slice(0, 3)).toEqual(amazon.problems.slice(0, 3).map((problem) => problem.id));
    expect(
      screen.getByRole("link", { name: `View #${amazon.problems[0].id} on LeetCode` }).getAttribute("href"),
    ).toBe(amazon.problems[0].sourceUrl);

    expect(screen.getByLabelText("Amazon · 3 months solved progress").textContent).toContain(
      `0 / ${amazon.problems.length} solved`,
    );
    expect(screen.getByLabelText("Easy progress").textContent).toContain(
      `0 / ${amazon.problems.filter((problem) => problem.difficulty === "Easy").length}`,
    );
    expect(screen.getByLabelText("Medium progress").textContent).toContain(
      `0 / ${amazon.problems.filter((problem) => problem.difficulty === "Medium").length}`,
    );
    expect(screen.getByLabelText("Hard progress").textContent).toContain(
      `0 / ${amazon.problems.filter((problem) => problem.difficulty === "Hard").length}`,
    );
  });
});
