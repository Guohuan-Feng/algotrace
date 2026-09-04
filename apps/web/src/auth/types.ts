export type ProgressUser = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

export type ProgressAuth = {
  configured: boolean;
  getUser: () => Promise<ProgressUser | null>;
  onUserChange: (listener: (user: ProgressUser | null) => void) => () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export type ProgressRepository = {
  load: (userId: string) => Promise<Set<number>>;
  mark: (userId: string, problemId: number) => Promise<void>;
  unmark: (userId: string, problemId: number) => Promise<void>;
};
