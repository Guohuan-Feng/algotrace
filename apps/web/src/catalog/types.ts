export type Difficulty = "Easy" | "Medium" | "Hard";

export type Problem = {
  id: number;
  title: string;
  cnTitle?: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  pattern: string;
  collections?: string[];
  hasVisualizer: boolean;
  summary: string;
};

export type ReadyProblemDefinition = Omit<Problem, "hasVisualizer"> & {
  hasVisualizer: true;
};
