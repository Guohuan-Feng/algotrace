export type Difficulty = "Easy" | "Medium" | "Hard";

export type VisualizerKey =
  | "generate-parentheses"
  | "letter-combinations-of-a-phone-number"
  | "word-search"
  | "combinations"
  | "combination-sum"
  | "n-queens-ii"
  | "permutations"
  | "implement-trie-prefix-tree"
  | "design-add-and-search-words-data-structure"
  | "word-search-ii";

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
  visualizerKey?: VisualizerKey;
};

export type VisualizerProps = {
  onBack: () => void;
};

export type Cell = [number, number];

export type FrameKind =
  | "build"
  | "start"
  | "visit"
  | "prune"
  | "found"
  | "backtrack"
  | "done";

export type TrieNodeModel = {
  id: string;
  label: string;
  prefix: string;
  word: string | null;
  children: Record<string, TrieNodeModel>;
};

export type WordSearchFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  root: TrieNodeModel;
  activeLines: number[];
  currentCell: Cell | null;
  targetCell: Cell | null;
  activeTrieId: string;
  visited: Cell[];
  stack: string[];
  results: string[];
  path: string;
  queuedWord: string | null;
  foundWord: string | null;
};

export type WordSearchExample = {
  id: 1 | 2;
  label: string;
  board: string[][];
  words: string[];
  output: string[];
};

export type TrieOperationName =
  | "Trie"
  | "WordDictionary"
  | "insert"
  | "search"
  | "startsWith"
  | "addWord";

export type TrieOperation = {
  name: TrieOperationName;
  args: string[];
  output: string;
};

export type TrieOperationFrame = {
  title: string;
  detail: string;
  kind: FrameKind;
  root: TrieNodeModel;
  activeTrieId: string;
  path: string;
  activeLines: number[];
  operationIndex: number;
  stack: string[];
  results: string[];
};

export type TrieOperationMode = "trie" | "word-dictionary";
