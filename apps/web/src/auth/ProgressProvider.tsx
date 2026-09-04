import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { progressAuth, progressRepository } from "./supabase";
import type { ProgressAuth, ProgressRepository, ProgressUser } from "./types";

const pendingProblemKey = "algotrace.pending-progress-problem";

export type ProgressAuthState = "loading" | "anonymous" | "authenticated" | "unconfigured";

export type ProgressContextValue = {
  authState: ProgressAuthState;
  user: ProgressUser | null;
  completedIds: ReadonlySet<number>;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleCompletion: (problemId: number) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

type ProgressProviderProps = {
  children: ReactNode;
  auth?: ProgressAuth;
  repository?: ProgressRepository;
};

export function ProgressProvider({
  children,
  auth = progressAuth,
  repository = progressRepository,
}: ProgressProviderProps) {
  const [authState, setAuthState] = useState<ProgressAuthState>("loading");
  const [user, setUser] = useState<ProgressUser | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<number>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const userRef = useRef<ProgressUser | null>(null);

  const updateCompletion = useCallback(async (problemId: number, completed: boolean) => {
    const currentUser = userRef.current;
    if (!currentUser) {
      return;
    }

    setError(null);
    setCompletedIds((current) => withCompletion(current, problemId, completed));

    try {
      if (completed) {
        await repository.mark(currentUser.id, problemId);
      } else {
        await repository.unmark(currentUser.id, problemId);
      }
    } catch {
      setCompletedIds((current) => withCompletion(current, problemId, !completed));
      setError("Could not sync completion. Check your connection and try again.");
    }
  }, [repository]);

  useEffect(() => {
    let active = true;

    const resolveUser = async (nextUser: ProgressUser | null) => {
      if (!active) {
        return;
      }

      userRef.current = nextUser;
      setUser(nextUser);

      if (!nextUser) {
        setCompletedIds(new Set());
        setAuthState(auth.configured ? "anonymous" : "unconfigured");
        return;
      }

      setAuthState("loading");
      try {
        const nextCompleted = await repository.load(nextUser.id);
        if (active) {
          setCompletedIds(nextCompleted);
          setAuthState("authenticated");
        }
      } catch {
        if (active) {
          setCompletedIds(new Set());
          setAuthState("authenticated");
          setError("Could not load synced progress. Try refreshing the page.");
        }
      }
    };

    const unsubscribe = auth.onUserChange((nextUser) => {
      void resolveUser(nextUser);
    });

    void auth.getUser().then(resolveUser).catch(() => {
      if (active) {
        setAuthState(auth.configured ? "anonymous" : "unconfigured");
        setError("Could not restore your sign-in session. Try signing in again.");
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [auth, repository]);

  useEffect(() => {
    if (authState !== "authenticated" || !user) {
      return;
    }

    const pendingProblemId = Number(window.sessionStorage.getItem(pendingProblemKey));
    if (!Number.isInteger(pendingProblemId) || pendingProblemId <= 0) {
      return;
    }

    window.sessionStorage.removeItem(pendingProblemKey);
    void updateCompletion(pendingProblemId, true);
  }, [authState, updateCompletion, user]);

  const signIn = useCallback(async () => {
    if (!auth.configured) {
      setError("Progress sync is not configured yet. Add the Supabase public environment variables first.");
      return;
    }

    setError(null);
    try {
      await auth.signInWithGoogle();
    } catch {
      setError("Could not start Google sign-in. Try again.");
    }
  }, [auth]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await auth.signOut();
    } catch {
      setError("Could not sign out. Try again.");
    }
  }, [auth]);

  const toggleCompletion = useCallback(async (problemId: number) => {
    if (authState === "loading") {
      return;
    }

    if (authState === "unconfigured") {
      setError("Progress sync is not configured yet. Add the Supabase public environment variables first.");
      return;
    }

    if (authState === "anonymous") {
      window.sessionStorage.setItem(pendingProblemKey, String(problemId));
      await signIn();
      return;
    }

    await updateCompletion(problemId, !completedIds.has(problemId));
  }, [authState, completedIds, signIn, updateCompletion]);

  const value = useMemo<ProgressContextValue>(() => ({
    authState,
    user,
    completedIds,
    error,
    signIn,
    signOut,
    toggleCompletion,
  }), [authState, completedIds, error, signIn, signOut, toggleCompletion, user]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);

  if (!value) {
    throw new Error("useProgress must be used within ProgressProvider");
  }

  return value;
}

function withCompletion(current: ReadonlySet<number>, problemId: number, completed: boolean): Set<number> {
  const next = new Set(current);
  if (completed) {
    next.add(problemId);
  } else {
    next.delete(problemId);
  }
  return next;
}
