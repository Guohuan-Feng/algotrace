import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProgressProvider, useProgress } from "./ProgressProvider";
import type { ProgressAuth, ProgressRepository, ProgressUser } from "./types";

function ProgressToggle({ problemId }: { problemId: number }) {
  const { authState, error, completedIds, toggleCompletion } = useProgress();
  const completed = completedIds.has(problemId);

  return (
    <>
      <span data-testid="auth-state">{authState}</span>
      <button
        aria-label={`Mark ${problemId} ${completed ? "incomplete" : "complete"}`}
        aria-pressed={completed}
        onClick={() => void toggleCompletion(problemId)}
      />
      {error ? <p role="alert">{error}</p> : null}
    </>
  );
}

function createAuth(initialUser: ProgressUser | null) {
  let listener: ((user: ProgressUser | null) => void) | undefined;
  const auth: ProgressAuth = {
    configured: true,
    getUser: vi.fn(async () => initialUser),
    onUserChange: vi.fn((nextListener) => {
      listener = nextListener;
      return () => {
        listener = undefined;
      };
    }),
    signInWithGoogle: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
  };

  return { auth, emitUser: (user: ProgressUser | null) => listener?.(user) };
}

function createRepository(overrides: Partial<ProgressRepository> = {}): ProgressRepository {
  return {
    load: vi.fn(async () => new Set<number>()),
    mark: vi.fn(async () => undefined),
    unmark: vi.fn(async () => undefined),
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

describe("ProgressProvider", () => {
  it("defers an anonymous completion until Google sign-in resolves", async () => {
    const user = userEvent.setup();
    const { auth, emitUser } = createAuth(null);
    const repository = createRepository();

    render(
      <ProgressProvider auth={auth} repository={repository}>
        <ProgressToggle problemId={4} />
      </ProgressProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("auth-state").textContent).toBe("anonymous"));
    await user.click(screen.getByRole("button", { name: "Mark 4 complete" }));

    expect(auth.signInWithGoogle).toHaveBeenCalledOnce();
    expect(window.sessionStorage.getItem("algotrace.pending-progress-problem")).toBe("4");

    emitUser({ id: "user-1", email: "learner@example.com" });

    await waitFor(() => expect(repository.mark).toHaveBeenCalledWith("user-1", 4));
    expect(screen.getByRole("button", { name: "Mark 4 incomplete" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("reverts an optimistic completion after a failed write", async () => {
    const user = userEvent.setup();
    const { auth } = createAuth({ id: "user-1", email: "learner@example.com" });
    const repository = createRepository({ mark: vi.fn(async () => Promise.reject(new Error("offline"))) });

    render(
      <ProgressProvider auth={auth} repository={repository}>
        <ProgressToggle problemId={4} />
      </ProgressProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("auth-state").textContent).toBe("authenticated"));
    await user.click(screen.getByRole("button", { name: "Mark 4 complete" }));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Could not sync completion"));
    expect(screen.getByRole("button", { name: "Mark 4 complete" }).getAttribute("aria-pressed")).toBe("false");
  });
});
