import type { Difficulty } from "../types";

export type CompanyName = "Google" | "Amazon" | "TikTok";

export type CompanyProblem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  frequency: number;
  sourceUrl: string;
};

export type CompanyCollection = {
  name: CompanyName;
  label: `${CompanyName} · 3 months`;
  snapshotAt: string;
  sourceUrl: string;
  problems: readonly CompanyProblem[];
};
