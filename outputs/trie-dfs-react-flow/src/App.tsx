import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  Position,
} from "reactflow";
import type { ReactFlowInstance } from "reactflow";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Filter,
  Pause,
  Play,
  RefreshCcw,
  Search,
  Upload,
} from "lucide-react";

type Cell = [number, number];
type FrameKind =
  | "build"
  | "start"
  | "visit"
  | "prune"
  | "found"
  | "backtrack"
  | "done";

type TrieNodeModel = {
  id: string;
  label: string;
  prefix: string;
  word: string | null;
  children: Record<string, TrieNodeModel>;
};

type Frame = {
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

type Problem = {
  id: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  pattern: string;
  hasVisualizer: boolean;
  summary: string;
};

type WordSearchExample = {
  id: 1 | 2;
  label: string;
  board: string[][];
  words: string[];
  output: string[];
};

type TrieOperation = {
  name: "Trie" | "WordDictionary" | "insert" | "search" | "startsWith" | "addWord";
  args: string[];
  output: string;
};

type TrieOperationFrame = {
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

const wordSearchExamples: WordSearchExample[] = [
  {
    id: 1,
    label: "Example 1",
    board: [
      ["o", "a", "a", "n"],
      ["e", "t", "a", "e"],
      ["i", "h", "k", "r"],
      ["i", "f", "l", "v"],
    ],
    words: ["oath", "pea", "eat", "rain"],
    output: ["eat", "oath"],
  },
  {
    id: 2,
    label: "Example 2",
    board: [
      ["a", "b"],
      ["c", "d"],
    ],
    words: ["abcb"],
    output: [],
  },
];

const defaultExample = wordSearchExamples[0];

const directions = [
  [1, 0, "down"],
  [-1, 0, "up"],
  [0, 1, "right"],
  [0, -1, "left"],
] as const;

const codeLines = [
  "root = TrieNode()",
  "",
  "for word in words:",
  "    node = root",
  "    for ch in word:",
  "        if ch not in node.children:",
  "            node.children[ch] = TrieNode()",
  "        node = node.children[ch]",
  "    node.word = word",
  "",
  "res = []",
  "visited = set()",
  "",
  "def dfs(r, c, node):",
  "    if r < 0 or r >= rows or c < 0 or c >= cols:",
  "        return",
  "",
  "    if (r, c) in visited:",
  "        return",
  "",
  "    ch = board[r][c]",
  "",
  "    if ch not in node.children:",
  "        return",
  "",
  "    next_node = node.children[ch]",
  "",
  "    if next_node.word:",
  "        res.append(next_node.word)",
  "        next_node.word = None",
  "",
  "    visited.add((r, c))",
  "",
  "    dfs(r + 1, c, next_node)",
  "    dfs(r - 1, c, next_node)",
  "    dfs(r, c + 1, next_node)",
  "    dfs(r, c - 1, next_node)",
  "",
  "    visited.remove((r, c))",
  "",
  "for r in range(rows):",
  "    for c in range(cols):",
  "        dfs(r, c, root)",
  "",
  "return res",
];

const implementTrieCodeLines = [
  "class Trie:",
  "    def __init__(self):",
  "        self.children = {}",
  "        self.isEnd = False",
  "",
  "    def insert(self, word):",
  "        node = self",
  "        for ch in word:",
  "            if ch not in node.children:",
  "                node.children[ch] = Trie()",
  "            node = node.children[ch]",
  "        node.isEnd = True",
  "",
  "    def search(self, word):",
  "        node = self",
  "        for ch in word:",
  "            if ch not in node.children:",
  "                return False",
  "            node = node.children[ch]",
  "        return node.isEnd",
  "",
  "    def startsWith(self, prefix):",
  "        node = self",
  "        for ch in prefix:",
  "            if ch not in node.children:",
  "                return False",
  "            node = node.children[ch]",
  "        return True",
];

const wordDictionaryCodeLines = [
  "class WordDictionary:",
  "    def __init__(self):",
  "        self.children = {}",
  "        self.isEnd = False",
  "",
  "    def addWord(self, word):",
  "        node = self",
  "        for ch in word:",
  "            if ch not in node.children:",
  "                node.children[ch] = WordDictionary()",
  "            node = node.children[ch]",
  "        node.isEnd = True",
  "",
  "    def search(self, word):",
  "        def dfs(i, node):",
  "            if i == len(word):",
  "                return node.isEnd",
  "            ch = word[i]",
  "            if ch == '.':",
  "                return any(dfs(i + 1, child) for child in node.children.values())",
  "            if ch not in node.children:",
  "                return False",
  "            return dfs(i + 1, node.children[ch])",
  "        return dfs(0, self)",
];

const implementTrieOperations: TrieOperation[] = [
  { name: "Trie", args: [], output: "null" },
  { name: "insert", args: ["apple"], output: "null" },
  { name: "search", args: ["apple"], output: "true" },
  { name: "search", args: ["app"], output: "false" },
  { name: "startsWith", args: ["app"], output: "true" },
  { name: "insert", args: ["app"], output: "null" },
  { name: "search", args: ["app"], output: "true" },
];

const wordDictionaryOperations: TrieOperation[] = [
  { name: "WordDictionary", args: [], output: "null" },
  { name: "addWord", args: ["bad"], output: "null" },
  { name: "addWord", args: ["dad"], output: "null" },
  { name: "addWord", args: ["mad"], output: "null" },
  { name: "search", args: ["pad"], output: "false" },
  { name: "search", args: ["bad"], output: "true" },
  { name: "search", args: [".ad"], output: "true" },
  { name: "search", args: ["b.."], output: "true" },
];

const problemCatalog: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    pattern: "Hash lookup",
    hasVisualizer: false,
    summary: "Use a hash map to find the complement for each number.",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    pattern: "Linked list simulation",
    hasVisualizer: false,
    summary: "Walk two linked lists while carrying overflow digit by digit.",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Table"],
    pattern: "Sliding window",
    hasVisualizer: false,
    summary: "Move a window while maintaining the latest index of each character.",
  },
  {
    id: 15,
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    pattern: "Sort + two pointers",
    hasVisualizer: false,
    summary: "Fix one value, then scan the remaining range with two pointers.",
  },
  {
    id: 17,
    title: "Letter Combinations of a Phone Number",
    slug: "letter-combinations-of-a-phone-number",
    difficulty: "Medium",
    tags: ["Backtracking", "String"],
    pattern: "Backtracking",
    hasVisualizer: false,
    summary: "Build one character per digit and backtrack through all choices.",
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    pattern: "Pointer merge",
    hasVisualizer: false,
    summary: "Attach the smaller current node and advance that list.",
  },
  {
    id: 22,
    title: "Generate Parentheses",
    slug: "generate-parentheses",
    difficulty: "Medium",
    tags: ["Backtracking", "String"],
    pattern: "Backtracking constraints",
    hasVisualizer: false,
    summary: "Track open and close counts while pruning invalid prefixes.",
  },
  {
    id: 33,
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    pattern: "Modified binary search",
    hasVisualizer: false,
    summary: "At each mid, decide which half is sorted and keep the target half.",
  },
  {
    id: 39,
    title: "Combination Sum",
    slug: "combination-sum",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    pattern: "Backtracking",
    hasVisualizer: false,
    summary: "Choose a candidate repeatedly while the remaining sum allows it.",
  },
  {
    id: 46,
    title: "Permutations",
    slug: "permutations",
    difficulty: "Medium",
    tags: ["Backtracking", "Array"],
    pattern: "Backtracking",
    hasVisualizer: false,
    summary: "Use each number once and backtrack over all positions.",
  },
  {
    id: 51,
    title: "N-Queens",
    slug: "n-queens",
    difficulty: "Hard",
    tags: ["Backtracking", "Matrix"],
    pattern: "Constraint backtracking",
    hasVisualizer: false,
    summary: "Place queens row by row while checking columns and diagonals.",
  },
  {
    id: 53,
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    pattern: "Kadane DP",
    hasVisualizer: false,
    summary: "Carry the best subarray ending at the current index.",
  },
  {
    id: 70,
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming"],
    pattern: "Fibonacci DP",
    hasVisualizer: false,
    summary: "The ways to reach step i come from i - 1 and i - 2.",
  },
  {
    id: 79,
    title: "Word Search",
    slug: "word-search",
    difficulty: "Medium",
    tags: ["DFS", "Backtracking", "Matrix"],
    pattern: "Grid DFS",
    hasVisualizer: false,
    summary: "Try every starting cell and walk four directions with visited marks.",
  },
  {
    id: 98,
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    difficulty: "Medium",
    tags: ["Tree", "DFS"],
    pattern: "Range DFS",
    hasVisualizer: false,
    summary: "Pass lower and upper bounds down the tree.",
  },
  {
    id: 102,
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: "Medium",
    tags: ["Tree", "BFS", "Queue"],
    pattern: "Level BFS",
    hasVisualizer: false,
    summary: "Process nodes level by level with a queue.",
  },
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    tags: ["Array", "Greedy"],
    pattern: "One-pass minimum",
    hasVisualizer: false,
    summary: "Track the cheapest price seen before selling today.",
  },
  {
    id: 127,
    title: "Word Ladder",
    slug: "word-ladder",
    difficulty: "Hard",
    tags: ["BFS", "Graph", "String"],
    pattern: "Shortest path BFS",
    hasVisualizer: false,
    summary: "Expand one-letter transformations level by level.",
  },
  {
    id: 133,
    title: "Clone Graph",
    slug: "clone-graph",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "BFS", "Hash Table"],
    pattern: "Graph traversal",
    hasVisualizer: false,
    summary: "Map original nodes to cloned nodes while traversing the graph.",
  },
  {
    id: 139,
    title: "Word Break",
    slug: "word-break",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Trie", "String"],
    pattern: "Prefix DP",
    hasVisualizer: false,
    summary: "Mark positions reachable by dictionary words.",
  },
  {
    id: 146,
    title: "LRU Cache",
    slug: "lru-cache",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List", "Design"],
    pattern: "Hash map + doubly linked list",
    hasVisualizer: false,
    summary: "Keep recent keys near the head and evict from the tail.",
  },
  {
    id: 200,
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    tags: ["DFS", "BFS", "Matrix", "Union Find"],
    pattern: "Grid flood fill",
    hasVisualizer: false,
    summary: "Start a search on every unseen land cell and mark its island.",
  },
  {
    id: 207,
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: "Medium",
    tags: ["Graph", "Topological Sort", "BFS", "DFS"],
    pattern: "Cycle detection / topo sort",
    hasVisualizer: false,
    summary: "Detect whether prerequisite edges contain a cycle.",
  },
  {
    id: 208,
    title: "Implement Trie",
    slug: "implement-trie-prefix-tree",
    difficulty: "Medium",
    tags: ["Trie", "Design", "String"],
    pattern: "Trie operations",
    hasVisualizer: true,
    summary: "Insert, search, and prefix-match by walking child pointers.",
  },
  {
    id: 211,
    title: "Design Add and Search Words Data Structure",
    slug: "design-add-and-search-words-data-structure",
    difficulty: "Medium",
    tags: ["Trie", "DFS", "Design", "String"],
    pattern: "Trie wildcard DFS",
    hasVisualizer: true,
    summary: "Store words in a Trie, then use DFS when search patterns contain '.'.",
  },
  {
    id: 212,
    title: "Word Search II",
    slug: "word-search-ii",
    difficulty: "Hard",
    tags: ["Trie", "DFS", "Backtracking", "Matrix"],
    pattern: "Trie-pruned grid DFS",
    hasVisualizer: true,
    summary: "Build a Trie for words, then DFS the board while pruning missing prefixes.",
  },
  {
    id: 215,
    title: "Kth Largest Element in an Array",
    slug: "kth-largest-element-in-an-array",
    difficulty: "Medium",
    tags: ["Heap", "Quickselect", "Array"],
    pattern: "Heap / quickselect",
    hasVisualizer: false,
    summary: "Keep a min-heap of size k or partition around a pivot.",
  },
  {
    id: 226,
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: "Easy",
    tags: ["Tree", "DFS", "BFS"],
    pattern: "Tree recursion",
    hasVisualizer: false,
    summary: "Swap left and right children recursively or by queue.",
  },
  {
    id: 236,
    title: "Lowest Common Ancestor of a Binary Tree",
    slug: "lowest-common-ancestor-of-a-binary-tree",
    difficulty: "Medium",
    tags: ["Tree", "DFS"],
    pattern: "Postorder DFS",
    hasVisualizer: false,
    summary: "Return the node where left and right searches first meet.",
  },
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Binary Search"],
    pattern: "Patience sorting",
    hasVisualizer: false,
    summary: "Maintain the smallest possible tail for each subsequence length.",
  },
  {
    id: 322,
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "BFS"],
    pattern: "Unbounded DP",
    hasVisualizer: false,
    summary: "Compute the minimum coins needed for every amount.",
  },
  {
    id: 399,
    title: "Evaluate Division",
    slug: "evaluate-division",
    difficulty: "Medium",
    tags: ["Graph", "DFS", "Union Find"],
    pattern: "Weighted graph traversal",
    hasVisualizer: false,
    summary: "Convert equations into weighted edges and search query ratios.",
  },
  {
    id: 417,
    title: "Pacific Atlantic Water Flow",
    slug: "pacific-atlantic-water-flow",
    difficulty: "Medium",
    tags: ["DFS", "BFS", "Matrix"],
    pattern: "Reverse ocean DFS",
    hasVisualizer: false,
    summary: "Search from each ocean inward and intersect reachable cells.",
  },
  {
    id: 542,
    title: "01 Matrix",
    slug: "01-matrix",
    difficulty: "Medium",
    tags: ["BFS", "Matrix", "Dynamic Programming"],
    pattern: "Multi-source BFS",
    hasVisualizer: false,
    summary: "Start BFS from all zero cells to fill nearest-zero distances.",
  },
  {
    id: 994,
    title: "Rotting Oranges",
    slug: "rotting-oranges",
    difficulty: "Medium",
    tags: ["BFS", "Matrix", "Queue"],
    pattern: "Multi-source BFS",
    hasVisualizer: false,
    summary: "Spread infection one minute per BFS level.",
  },
];

const sortedProblems = [...problemCatalog].sort((a, b) => a.title.localeCompare(b.title));
const allTags = Array.from(new Set(problemCatalog.flatMap((problem) => problem.tags))).sort();

function makeRoot(): TrieNodeModel {
  return { id: "root", label: "root", prefix: "", word: null, children: {} };
}

function cellKey([r, c]: Cell): string {
  return `${r},${c}`;
}

function buildTrie(words: string[]): TrieNodeModel {
  const root = makeRoot();

  words.forEach((word) => {
    let node = root;
    let prefix = "";

    word.split("").forEach((ch) => {
      prefix += ch;
      if (!node.children[ch]) {
        node.children[ch] = {
          id: `trie-${prefix}`,
          label: ch,
          prefix,
          word: null,
          children: {},
        };
      }
      node = node.children[ch];
    });

    node.word = word;
  });

  return root;
}

function cloneCellSet(set: Set<string>): Cell[] {
  return [...set].map((key) => key.split(",").map(Number) as Cell);
}

function createDryRun(board: string[][], words: string[]) {
  const root = makeRoot();
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const frames: Frame[] = [];
  const visited = new Set<string>();
  const found = new Set<string>();

  const pushFrame = (frame: Omit<Frame, "activeLines" | "root" | "visited" | "results"> & { activeLines?: number[] }) => {
    frames.push({
      ...frame,
      root: cloneTrie(root),
      activeLines: frame.activeLines ?? [],
      visited: cloneCellSet(visited),
      results: [...found].sort(),
    });
  };

  pushFrame({
    kind: "build",
    title: "Create Trie root",
    detail: `Start with an empty root. Next, insert ${words.length} words from the LeetCode example one by one.`,
    activeLines: [1],
    currentCell: null,
    targetCell: null,
    activeTrieId: "root",
    stack: [],
    path: "",
    queuedWord: null,
    foundWord: null,
  });

  words.forEach((word) => {
    let node = root;
    let prefix = "";

    pushFrame({
      kind: "build",
      title: `Insert "${word}"`,
      detail: `Start from root and add each character in "${word}".`,
      activeLines: [3, 4],
      currentCell: null,
      targetCell: null,
      activeTrieId: "root",
      stack: [`insert("${word}")`],
      path: "",
      queuedWord: word,
      foundWord: null,
    });

    word.split("").forEach((ch) => {
      const nextPrefix = prefix + ch;
      pushFrame({
        kind: "build",
        title: `Check "${ch}"`,
        detail: `At prefix "${prefix || "root"}", check whether child "${ch}" already exists.`,
        activeLines: [5, 6],
        currentCell: null,
        targetCell: null,
        activeTrieId: node.id,
        stack: [`insert("${word}")`, nextPrefix],
        path: prefix,
        queuedWord: word,
        foundWord: null,
      });

      if (!node.children[ch]) {
        node.children[ch] = {
          id: `trie-${nextPrefix}`,
          label: ch,
          prefix: nextPrefix,
          word: null,
          children: {},
        };
        pushFrame({
          kind: "found",
          title: `Create node "${ch}"`,
          detail: `Create a new Trie node for prefix "${nextPrefix}".`,
          activeLines: [6, 7],
          currentCell: null,
          targetCell: null,
          activeTrieId: node.children[ch].id,
          stack: [`insert("${word}")`, nextPrefix],
          path: nextPrefix,
          queuedWord: word,
          foundWord: null,
        });
      } else {
        pushFrame({
          kind: "visit",
          title: `Reuse node "${ch}"`,
          detail: `Prefix "${nextPrefix}" already exists, so reuse that node.`,
          activeLines: [6, 8],
          currentCell: null,
          targetCell: null,
          activeTrieId: node.children[ch].id,
          stack: [`insert("${word}")`, nextPrefix],
          path: nextPrefix,
          queuedWord: word,
          foundWord: null,
        });
      }

      node = node.children[ch];
      prefix = nextPrefix;
    });

    node.word = word;
    pushFrame({
      kind: "done",
      title: `Mark word "${word}"`,
      detail: `Set node.word = "${word}" so DFS can recognize a complete word.`,
      activeLines: [9],
      currentCell: null,
      targetCell: null,
      activeTrieId: node.id,
      stack: [`insert("${word}")`, `word = "${word}"`],
      path: prefix,
      queuedWord: word,
      foundWord: null,
    });
  });

  function dfs(r: number, c: number, node: TrieNodeModel, stack: string[], path: string) {
    const label = `dfs(${r}, ${c}, "${path || "root"}")`;

    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      pushFrame({
        kind: "prune",
        title: "Prune: boundary",
        detail: `${label} stops because (${r}, ${c}) is outside the board.`,
        activeLines: [15, 16],
        currentCell: null,
        targetCell: [r, c],
        activeTrieId: node.id,
        stack,
        path,
        queuedWord: null,
        foundWord: null,
      });
      return;
    }

    const key = cellKey([r, c]);
    if (visited.has(key)) {
      pushFrame({
        kind: "prune",
        title: "Prune: already visited",
        detail: `${label} stops because this cell is already in the current DFS path.`,
        activeLines: [18, 19],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: node.id,
        stack,
        path,
        queuedWord: null,
        foundWord: null,
      });
      return;
    }

    const ch = board[r][c];
    const nextNode = node.children[ch];

    if (!nextNode) {
      pushFrame({
        kind: "prune",
        title: "Prune: Trie mismatch",
        detail: `${label} reads "${ch}", but prefix "${path}${ch}" does not exist in the Trie.`,
        activeLines: [21, 23, 24],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: node.id,
        stack,
        path,
        queuedWord: null,
        foundWord: null,
      });
      return;
    }

    visited.add(key);
    const nextPath = path + ch;
    const nextStack = [...stack, `(${r},${c}) ${ch}`];

    pushFrame({
      kind: "visit",
      title: "Visit cell",
      detail: `Take "${ch}" and move from prefix "${path || "root"}" to "${nextPath}".`,
      activeLines: [21, 26, 32],
      currentCell: [r, c],
      targetCell: [r, c],
      activeTrieId: nextNode.id,
      stack: nextStack,
      path: nextPath,
      queuedWord: null,
      foundWord: null,
    });

    if (nextNode.word && !found.has(nextNode.word)) {
      found.add(nextNode.word);
      pushFrame({
        kind: "found",
        title: "Found word",
        detail: `"${nextNode.word}" is complete at this Trie node. Add it to res and clear node.word to avoid duplicates.`,
        activeLines: [28, 29, 30],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: nextNode.id,
        stack: nextStack,
        path: nextPath,
        queuedWord: nextNode.word,
        foundWord: nextNode.word,
      });
    }

    directions.forEach(([dr, dc, name]) => {
      pushFrame({
        kind: "start",
        title: `Try ${name}`,
        detail: `From (${r}, ${c}), continue DFS to (${r + dr}, ${c + dc}).`,
        activeLines:
          name === "down" ? [34] : name === "up" ? [35] : name === "right" ? [36] : [37],
        currentCell: [r, c],
        targetCell: [r + dr, c + dc],
        activeTrieId: nextNode.id,
        stack: nextStack,
        path: nextPath,
        queuedWord: null,
        foundWord: null,
      });
      dfs(r + dr, c + dc, nextNode, nextStack, nextPath);
    });

    pushFrame({
      kind: "backtrack",
      title: "Backtrack",
      detail: `Remove (${r}, ${c}) from visited so another path can reuse it later.`,
      activeLines: [39],
      currentCell: [r, c],
      targetCell: [r, c],
      activeTrieId: nextNode.id,
      stack: nextStack.slice(0, -1),
      path,
      queuedWord: null,
      foundWord: null,
    });
    visited.delete(key);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      pushFrame({
        kind: "start",
        title: "Choose start cell",
        detail: `Start a fresh DFS from board[${r}][${c}] = "${board[r][c]}".`,
        activeLines: [41, 42, 43],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: "root",
        stack: [],
        path: "",
        queuedWord: null,
        foundWord: null,
      });
      dfs(r, c, root, [], "");
    }
  }

  pushFrame({
    kind: "done",
    title: "Done",
    detail: `All start cells have been searched. Result: [${[...found].sort().join(", ")}].`,
    activeLines: [45],
    currentCell: null,
    targetCell: null,
    activeTrieId: "root",
    stack: [],
    path: "",
    queuedWord: null,
    foundWord: null,
  });

  return { root, frames };
}

function cloneTrie(node: TrieNodeModel): TrieNodeModel {
  return {
    id: node.id,
    label: node.label,
    prefix: node.prefix,
    word: node.word,
    children: Object.fromEntries(Object.entries(node.children).map(([key, child]) => [key, cloneTrie(child)])),
  };
}

function createOperationDryRun(kind: "trie" | "word-dictionary") {
  const root = makeRoot();
  const frames: TrieOperationFrame[] = [];
  const operations = kind === "trie" ? implementTrieOperations : wordDictionaryOperations;
  const code = kind === "trie" ? implementTrieCodeLines : wordDictionaryCodeLines;
  const results: string[] = [];

  const pushFrame = (frame: Omit<TrieOperationFrame, "root" | "results">) => {
    frames.push({
      ...frame,
      root: cloneTrie(root),
      results: [...results],
    });
  };

  const lineSet = (operation: TrieOperation["name"], phase: "start" | "loop" | "create" | "move" | "end" | "miss" | "dot" | "result") => {
    if (kind === "trie") {
      if (operation === "insert") {
        return phase === "start" ? [6, 7] : phase === "create" ? [8, 9, 10] : phase === "end" ? [12] : [8, 11];
      }
      if (operation === "search") {
        return phase === "miss" ? [16, 17, 18] : phase === "result" ? [20] : [14, 15, 16, 19];
      }
      return phase === "miss" ? [24, 25, 26] : phase === "result" ? [28] : [22, 23, 24, 27];
    }

    if (operation === "addWord") {
      return phase === "start" ? [6, 7] : phase === "create" ? [8, 9, 10] : phase === "end" ? [12] : [8, 11];
    }
    if (phase === "dot") {
      return [18, 19, 20];
    }
    if (phase === "miss") {
      return [21, 22];
    }
    if (phase === "result") {
      return [16, 17, 24];
    }
    return [14, 15, 18, 23];
  };

  const ensureChild = (node: TrieNodeModel, ch: string, prefix: string) => {
    if (!node.children[ch]) {
      node.children[ch] = {
        id: `trie-${prefix}`,
        label: ch,
        prefix,
        word: null,
        children: {},
      };
    }
    return node.children[ch];
  };

  function runInsert(operation: TrieOperation, operationIndex: number) {
    const word = operation.args[0];
    let node = root;
    let prefix = "";
    const methodName = operation.name === "addWord" ? "addWord" : "insert";

    pushFrame({
      kind: "start",
      title: `${methodName}("${word}")`,
      detail: `Start at root and insert "${word}" one character at a time.`,
      activeTrieId: "root",
      path: "",
      activeLines: lineSet(operation.name, "start"),
      operationIndex,
      stack: [`${methodName}("${word}")`],
    });

    for (const ch of word) {
      prefix += ch;
      const created = !node.children[ch];
      const nextNode = ensureChild(node, ch, prefix);
      pushFrame({
        kind: created ? "found" : "visit",
        title: created ? `Create node "${ch}"` : `Move to "${ch}"`,
        detail: created
          ? `"${prefix}" does not exist yet, so create a new Trie node.`
          : `"${prefix}" already exists, so reuse that node.`,
        activeTrieId: nextNode.id,
        path: prefix,
        activeLines: lineSet(operation.name, created ? "create" : "move"),
        operationIndex,
        stack: [`${methodName}("${word}")`, prefix],
      });
      node = nextNode;
    }

    node.word = word;
    results.push(operation.output);
    pushFrame({
      kind: "done",
      title: `Mark "${word}" complete`,
      detail: `Set isEnd on prefix "${word}". The operation returns ${operation.output}.`,
      activeTrieId: node.id,
      path: word,
      activeLines: lineSet(operation.name, "end"),
      operationIndex,
      stack: [`return ${operation.output}`],
    });
  }

  function runPlainLookup(operation: TrieOperation, operationIndex: number) {
    const query = operation.args[0];
    let node = root;
    let prefix = "";

    pushFrame({
      kind: "start",
      title: `${operation.name}("${query}")`,
      detail: `Start at root and walk the query characters.`,
      activeTrieId: "root",
      path: "",
      activeLines: lineSet(operation.name, "start"),
      operationIndex,
      stack: [`${operation.name}("${query}")`],
    });

    for (const ch of query) {
      const nextPrefix = prefix + ch;
      if (!node.children[ch]) {
        results.push("false");
        pushFrame({
          kind: "prune",
          title: `Missing "${ch}"`,
          detail: `Prefix "${nextPrefix}" does not exist, so return false.`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "miss"),
          operationIndex,
          stack: [`return false`],
        });
        return;
      }
      node = node.children[ch];
      prefix = nextPrefix;
      pushFrame({
        kind: "visit",
        title: `Follow "${ch}"`,
        detail: `Prefix "${prefix}" exists; continue walking.`,
        activeTrieId: node.id,
        path: prefix,
        activeLines: lineSet(operation.name, "move"),
        operationIndex,
        stack: [`${operation.name}("${query}")`, prefix],
      });
    }

    const ok = operation.name === "startsWith" ? true : Boolean(node.word);
    results.push(String(ok));
    pushFrame({
      kind: ok ? "done" : "prune",
      title: `Return ${ok}`,
      detail:
        operation.name === "startsWith"
          ? `The full prefix "${query}" exists, so startsWith returns true.`
          : `The path "${query}" ${ok ? "is" : "is not"} marked as a complete word.`,
      activeTrieId: node.id,
      path: prefix,
      activeLines: lineSet(operation.name, "result"),
      operationIndex,
      stack: [`return ${ok}`],
    });
  }

  function runWildcardSearch(operation: TrieOperation, operationIndex: number) {
    const pattern = operation.args[0];
    let matched = false;

    pushFrame({
      kind: "start",
      title: `search("${pattern}")`,
      detail: `Start DFS from root. A dot can match any child node.`,
      activeTrieId: "root",
      path: "",
      activeLines: [14, 15, 24],
      operationIndex,
      stack: [`search("${pattern}")`],
    });

    const dfs = (index: number, node: TrieNodeModel, prefix: string, stack: string[]): boolean => {
      if (index === pattern.length) {
        const ok = Boolean(node.word);
        pushFrame({
          kind: ok ? "done" : "prune",
          title: `End of pattern: ${ok}`,
          detail: `Reached "${prefix || "root"}"; isEnd is ${ok}, so this path ${ok ? "matches" : "fails"}.`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "result"),
          operationIndex,
          stack: [...stack, `return ${ok}`],
        });
        return ok;
      }

      const ch = pattern[index];
      if (ch === ".") {
        pushFrame({
          kind: "start",
          title: `Wildcard at index ${index}`,
          detail: `Try every child under prefix "${prefix || "root"}".`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "dot"),
          operationIndex,
          stack: [...stack, `.${index}`],
        });

        for (const child of Object.values(node.children)) {
          pushFrame({
            kind: "visit",
            title: `Try "${child.label}" for "."`,
            detail: `Wildcard chooses "${child.label}", moving to prefix "${child.prefix}".`,
            activeTrieId: child.id,
            path: child.prefix,
            activeLines: lineSet(operation.name, "dot"),
            operationIndex,
            stack: [...stack, `.${index} -> ${child.label}`],
          });
          if (dfs(index + 1, child, child.prefix, [...stack, child.prefix])) {
            return true;
          }
        }

        pushFrame({
          kind: "prune",
          title: "Wildcard branch failed",
          detail: `No child under "${prefix || "root"}" can complete "${pattern}".`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "miss"),
          operationIndex,
          stack: [...stack, `return false`],
        });
        return false;
      }

      if (!node.children[ch]) {
        pushFrame({
          kind: "prune",
          title: `Missing "${ch}"`,
          detail: `Prefix "${prefix + ch}" does not exist, so this DFS branch returns false.`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "miss"),
          operationIndex,
          stack: [...stack, `return false`],
        });
        return false;
      }

      const child = node.children[ch];
      pushFrame({
        kind: "visit",
        title: `Follow "${ch}"`,
        detail: `Move to prefix "${child.prefix}" and continue DFS.`,
        activeTrieId: child.id,
        path: child.prefix,
        activeLines: lineSet(operation.name, "move"),
        operationIndex,
        stack: [...stack, child.prefix],
      });
      return dfs(index + 1, child, child.prefix, [...stack, child.prefix]);
    };

    matched = dfs(0, root, "", [`dfs(0, root)`]);
    results.push(String(matched));
    pushFrame({
      kind: matched ? "done" : "prune",
      title: `search("${pattern}") returns ${matched}`,
      detail: `The official example expects ${operation.output}; the DFS result is ${matched}.`,
      activeTrieId: "root",
      path: "",
      activeLines: [24],
      operationIndex,
      stack: [`return ${matched}`],
    });
  }

  operations.forEach((operation, operationIndex) => {
    if (operation.name === "Trie" || operation.name === "WordDictionary") {
      results.push(operation.output);
      pushFrame({
        kind: "build",
        title: `${operation.name}()`,
        detail: "Create an empty root node.",
        activeTrieId: "root",
        path: "",
        activeLines: [1, 2, 3, 4],
        operationIndex,
        stack: ["constructor"],
      });
      return;
    }

    if (operation.name === "insert" || operation.name === "addWord") {
      runInsert(operation, operationIndex);
      return;
    }

    if (kind === "word-dictionary") {
      runWildcardSearch(operation, operationIndex);
      return;
    }

    runPlainLookup(operation, operationIndex);
  });

  return { frames, operations, code };
}

function flattenTrie(root: TrieNodeModel) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const positions = new Map<string, { x: number; y: number }>();
  let nextLeaf = 0;
  const horizontalGap = 132;
  const verticalGap = 126;

  function measure(node: TrieNodeModel, depth: number): number {
    const children = Object.values(node.children);
    if (!children.length) {
      const x = nextLeaf * horizontalGap;
      positions.set(node.id, { x, y: depth * verticalGap });
      nextLeaf += 1;
      return x;
    }

    const childXs = children.map((child) => measure(child, depth + 1));
    const x = (childXs[0] + childXs[childXs.length - 1]) / 2;
    positions.set(node.id, { x, y: depth * verticalGap });
    return x;
  }

  function walk(node: TrieNodeModel, parentId: string | null) {
    const position = positions.get(node.id) ?? { x: 0, y: 0 };
    nodes.push({
      id: node.id,
      position,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: { label: node.label, prefix: node.prefix, word: node.word },
      type: "default",
    });

    if (parentId) {
      const parent = findTrieNode(root, parentId);
      const childIndex = parent ? Object.values(parent.children).findIndex((child) => child.id === node.id) : -1;
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: "straight",
        label: childIndex >= 0 ? node.label : "",
        labelBgBorderRadius: 6,
        labelBgPadding: [6, 3],
        labelBgStyle: { fill: "#f7f3ea", fillOpacity: 0.92 },
        labelStyle: { fill: "#46534b", fontSize: 12, fontWeight: 800 },
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: false,
      });
    }

    Object.values(node.children).forEach((child) => walk(child, node.id));
  }

  measure(root, 0);
  const rootPosition = positions.get(root.id) ?? { x: 0, y: 0 };
  positions.forEach((position, id) => {
    positions.set(id, {
      x: position.x - rootPosition.x,
      y: position.y,
    });
  });
  walk(root, null);
  return { nodes, edges };
}

function findTrieNode(node: TrieNodeModel, id: string): TrieNodeModel | null {
  if (node.id === id) {
    return node;
  }

  for (const child of Object.values(node.children)) {
    const found = findTrieNode(child, id);
    if (found) {
      return found;
    }
  }

  return null;
}

function parseBoard(value: string): string[][] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Board must be a non-empty 2D array.");
  }
  const width = parsed[0]?.length;
  if (!width) {
    throw new Error("Board rows cannot be empty.");
  }
  parsed.forEach((row) => {
    if (!Array.isArray(row) || row.length !== width) {
      throw new Error("Every board row must have the same length.");
    }
    row.forEach((cell) => {
      if (typeof cell !== "string" || cell.length !== 1) {
        throw new Error("Every board cell must be one character.");
      }
    });
  });
  return parsed;
}

function parseWords(value: string): string[] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.some((word) => typeof word !== "string" || !word)) {
    throw new Error("Words must be a JSON array of non-empty strings.");
  }
  return parsed;
}

function getProblemSlugFromHash(): string | null {
  const match = window.location.hash.match(/^#\/problems\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function App() {
  const [activeSlug, setActiveSlug] = useState(getProblemSlugFromHash);
  const activeProblem = activeSlug
    ? problemCatalog.find((problem) => problem.slug === activeSlug)
    : null;

  useEffect(() => {
    const onHashChange = () => setActiveSlug(getProblemSlugFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (activeProblem?.slug === "word-search-ii") {
    return <WordSearchVisualizer onBack={() => { window.location.hash = "#/"; }} />;
  }

  if (activeProblem?.slug === "implement-trie-prefix-tree") {
    return <OperationTrieVisualizer kind="trie" onBack={() => { window.location.hash = "#/"; }} />;
  }

  if (activeProblem?.slug === "design-add-and-search-words-data-structure") {
    return <OperationTrieVisualizer kind="word-dictionary" onBack={() => { window.location.hash = "#/"; }} />;
  }

  if (activeProblem) {
    return <ProblemPlaceholder problem={activeProblem} onBack={() => { window.location.hash = "#/"; }} />;
  }

  return <ProblemDirectory />;
}

function ProblemDirectory() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState<"All" | "Ready" | "Missing">("All");

  const visibleProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return sortedProblems.filter((problem) => {
      const matchesSearch =
        !normalized ||
        problem.title.toLowerCase().includes(normalized) ||
        String(problem.id).includes(normalized) ||
        problem.tags.some((problemTag) => problemTag.toLowerCase().includes(normalized)) ||
        problem.pattern.toLowerCase().includes(normalized);
      const matchesTag = tag === "All" || problem.tags.includes(tag);
      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;
      const matchesStatus =
        status === "All" ||
        (status === "Ready" && problem.hasVisualizer) ||
        (status === "Missing" && !problem.hasVisualizer);

      return matchesSearch && matchesTag && matchesDifficulty && matchesStatus;
    });
  }, [difficulty, query, status, tag]);

  const groupedProblems = useMemo(() => {
    return visibleProblems.reduce<Record<string, Problem[]>>((groups, problem) => {
      const letter = problem.title[0].toUpperCase();
      groups[letter] = groups[letter] ? [...groups[letter], problem] : [problem];
      return groups;
    }, {});
  }, [visibleProblems]);

  const readyCount = problemCatalog.filter((problem) => problem.hasVisualizer).length;

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Algorithm visualizer library</p>
          <h1>AlgoTrace</h1>
          <p className="catalog-subtitle">
            A growing index for algorithm dry-run animations. Ready items open a full visual trace; missing items stay in the roadmap.
          </p>
        </div>
        <div className="catalog-stats" aria-label="Catalog progress">
          <span>{problemCatalog.length} indexed</span>
          <strong>{readyCount} ready</strong>
        </div>
      </header>

      <section className="catalog-toolbar" aria-label="Problem filters">
        <label className="search-field">
          <Search size={17} />
          <input
            placeholder="Search title, id, tag, or pattern"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <Filter size={15} />
          <select value={tag} onChange={(event) => setTag(event.target.value)}>
            <option value="All">All topics</option>
            {allTags.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label>
          Animation
          <select value={status} onChange={(event) => setStatus(event.target.value as "All" | "Ready" | "Missing")}>
            <option value="All">All problems</option>
            <option value="Ready">Ready only</option>
            <option value="Missing">Missing only</option>
          </select>
        </label>
      </section>

      <section className="catalog-content">
        <aside className="topic-rail">
          <h2>Topics</h2>
          <button className={tag === "All" ? "topic-chip active" : "topic-chip"} onClick={() => setTag("All")}>
            All
          </button>
          {allTags.map((item) => (
            <button
              className={tag === item ? "topic-chip active" : "topic-chip"}
              key={item}
              onClick={() => setTag(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <div className="problem-groups">
          {Object.entries(groupedProblems).map(([letter, problems]) => (
            <section className="letter-group" key={letter}>
              <div className="letter-heading">{letter}</div>
              <div className="problem-list">
                {problems.map((problem) => (
                  <a className="problem-row" href={`#/problems/${problem.slug}`} key={problem.slug}>
                    <div className="problem-main">
                      <span className="problem-id">#{problem.id}</span>
                      <div>
                        <h2>{problem.title}</h2>
                        <p>{problem.summary}</p>
                      </div>
                    </div>
                    <div className="problem-meta">
                      <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                      <span className={problem.hasVisualizer ? "status ready" : "status missing"}>
                        {problem.hasVisualizer ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        {problem.hasVisualizer ? "已有动画" : "待补动画"}
                      </span>
                    </div>
                    <div className="tag-list">
                      {problem.tags.map((problemTag) => (
                        <span key={problemTag}>{problemTag}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}

          {!visibleProblems.length ? (
            <div className="empty-state">
              <BookOpen size={24} />
              <h2>No matching problems</h2>
              <p>Try clearing the filters or choosing a broader topic.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function ProblemPlaceholder({ problem, onBack }: { problem: Problem; onBack: () => void }) {
  return (
    <main className="placeholder-shell">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to catalog
      </button>
      <section className="placeholder-panel">
        <p className="eyebrow">Animation not built yet</p>
        <h1>{problem.title}</h1>
        <p>{problem.summary}</p>
        <div className="placeholder-grid">
          <span>#{problem.id}</span>
          <span>{problem.difficulty}</span>
          <span>{problem.pattern}</span>
        </div>
        <div className="tag-list large">
          {problem.tags.map((problemTag) => (
            <span key={problemTag}>{problemTag}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

function OperationTrieVisualizer({ kind, onBack }: { kind: "trie" | "word-dictionary"; onBack: () => void }) {
  const flowPanelRef = useRef<HTMLElement | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const dryRun = useMemo(() => createOperationDryRun(kind), [kind]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const trieGraph = useMemo(() => flattenTrie(frame.root), [frame.root]);
  const isWordDictionary = kind === "word-dictionary";
  const title = isWordDictionary
    ? "Add and Search Word: Trie + Wildcard DFS"
    : "Implement Trie: Prefix Tree Operations";
  const activeOperation = dryRun.operations[frame.operationIndex];

  const resetTrieViewport = useCallback((duration = 0) => {
    const panelWidth = flowPanelRef.current?.clientWidth ?? 900;
    flowInstanceRef.current?.setViewport(
      {
        x: panelWidth / 2,
        y: 42,
        zoom: 1,
      },
      { duration },
    );
  }, []);

  const flowNodes = useMemo(
    () =>
      trieGraph.nodes.map((node) => {
        const isActive = node.id === frame.activeTrieId;
        const isInPath =
          node.data.prefix && frame.path && frame.path.startsWith(node.data.prefix);
        const isWord = Boolean(node.data.word);

        return {
          ...node,
          className: [
            "trie-node",
            isActive ? "is-active" : "",
            isInPath ? "is-path" : "",
            isWord ? "is-word" : "",
          ]
            .filter(Boolean)
            .join(" "),
          data: {
            label: (
              <div className="trie-node-content">
                <strong>{node.data.label === "root" ? "root" : node.data.label}</strong>
                <span>{node.data.prefix || "root"}</span>
              </div>
            ),
          },
        };
      }),
    [frame.activeTrieId, frame.path, trieGraph.nodes],
  );

  const flowEdges = useMemo(
    () =>
      trieGraph.edges.map((edge) => ({
        ...edge,
        animated: flowNodes.some((node) => node.id === edge.target && node.className?.includes("is-path")),
        className: flowNodes.some((node) => node.id === edge.target && node.className?.includes("is-path"))
          ? "edge-path"
          : "",
      })),
    [flowNodes, trieGraph.edges],
  );

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => resetTrieViewport());
    return () => window.cancelAnimationFrame(id);
  }, [resetTrieViewport, trieGraph.nodes.length]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}>
            <ArrowLeft size={16} />
            Catalog
          </button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">
          Step {step + 1} / {dryRun.frames.length}
        </div>
      </header>

      <section className="workspace">
        <aside className="board-panel">
          <div className="panel-heading">
            <h2>LeetCode Example</h2>
            <span>official sample</span>
          </div>

          <div className="operation-list">
            {dryRun.operations.map((operation, index) => (
              <button
                className={index === frame.operationIndex ? "operation-row active" : "operation-row"}
                key={`${operation.name}-${index}`}
                onClick={() => {
                  const nextStep = dryRun.frames.findIndex((item) => item.operationIndex === index);
                  if (nextStep >= 0) {
                    setStep(nextStep);
                    setPlaying(false);
                  }
                }}
                type="button"
              >
                <span>#{index}</span>
                <strong>{operation.name}({operation.args.map((arg) => `"${arg}"`).join(", ")})</strong>
                <code>{operation.output}</code>
              </button>
            ))}
          </div>

          <div className="expected-output">
            <span>Input</span>
            <code>{JSON.stringify(dryRun.operations.map((operation) => operation.name))}</code>
          </div>
          <div className="expected-output">
            <span>Arguments</span>
            <code>{JSON.stringify(dryRun.operations.map((operation) => operation.args))}</code>
          </div>
          <div className="expected-output">
            <span>Output</span>
            <code>{JSON.stringify(dryRun.operations.map((operation) => operation.output === "null" ? null : operation.output === "true"))}</code>
          </div>
        </aside>

        <section className="flow-panel" ref={flowPanelRef}>
          <div className="panel-heading">
            <h2>Trie</h2>
            <span>active prefix: {frame.path || "root"}</span>
          </div>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            defaultViewport={{ x: 450, y: 42, zoom: 1 }}
            minZoom={0.25}
            maxZoom={1.8}
            nodeOrigin={[0.5, 0]}
            onInit={(instance) => {
              flowInstanceRef.current = instance;
              window.requestAnimationFrame(() => resetTrieViewport());
            }}
          >
            <Background gap={22} size={1} />
            <Controls />
          </ReactFlow>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}>
              <p className="eyebrow">{activeOperation.name}</p>
              <h2>{frame.title}</h2>
              <p>{frame.detail}</p>
            </div>

            <div className="controls-row">
              <button className="icon-button" onClick={() => setStep((value) => Math.max(0, value - 1))} aria-label="Previous step">
                <ChevronLeft size={18} />
              </button>
              <button className="icon-button primary" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="icon-button" onClick={() => setStep((value) => Math.min(dryRun.frames.length - 1, value + 1))} aria-label="Next step">
                <ChevronRight size={18} />
              </button>
              <button className="icon-button" onClick={() => { setStep(0); setPlaying(false); }} aria-label="Reset">
                <RefreshCcw size={18} />
              </button>
            </div>

            <input
              aria-label="Step slider"
              className="slider"
              max={dryRun.frames.length - 1}
              min={0}
              onChange={(event) => setStep(Number(event.target.value))}
              type="range"
              value={step}
            />
          </div>

          <div className="state-block">
            <h3>call stack</h3>
            <div className="token-list">
              {frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>outputs so far</h3>
            <div className="token-list words">
              {frame.results.map((result, index) => (
                <span key={`${result}-${index}`}>{result}</span>
              ))}
            </div>
          </div>

          <div className="code-window">
            <div className="code-title">
              <h3>Code trace</h3>
              <span>{frame.activeLines.length ? `line ${frame.activeLines.join(", ")}` : "idle"}</span>
            </div>
            <div className="active-snippet">
              {frame.activeLines.map((lineNumber) => (
                <div key={lineNumber}>
                  <span>{lineNumber}</span>
                  <code>{dryRun.code[lineNumber - 1]}</code>
                </div>
              ))}
            </div>
            <pre>
              {dryRun.code.map((line, index) => {
                const lineNumber = index + 1;
                const isActive = frame.activeLines.includes(lineNumber);
                return (
                  <span className={isActive ? "code-line active" : "code-line"} key={`${lineNumber}-${line}`}>
                    <span className="code-number">{lineNumber}</span>
                    <code>{line || " "}</code>
                  </span>
                );
              })}
            </pre>
          </div>
        </aside>
      </section>
    </main>
  );
}

function WordSearchVisualizer({ onBack }: { onBack: () => void }) {
  const flowPanelRef = useRef<HTMLElement | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [board, setBoard] = useState(defaultExample.board);
  const [words, setWords] = useState(defaultExample.words);
  const [boardInput, setBoardInput] = useState(JSON.stringify(defaultExample.board));
  const [wordsInput, setWordsInput] = useState(JSON.stringify(defaultExample.words));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = wordSearchExamples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createDryRun(board, words), [board, words]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const trieGraph = useMemo(() => flattenTrie(frame.root), [frame.root]);

  const resetTrieViewport = useCallback((duration = 0) => {
    const panelWidth = flowPanelRef.current?.clientWidth ?? 900;
    flowInstanceRef.current?.setViewport(
      {
        x: panelWidth / 2,
        y: 42,
        zoom: 1,
      },
      { duration },
    );
  }, []);

  const flowNodes = useMemo(
    () =>
      trieGraph.nodes.map((node) => {
        const isActive = node.id === frame.activeTrieId;
        const isInPath =
          node.data.prefix && frame.path && frame.path.startsWith(node.data.prefix);
        const isWord = Boolean(node.data.word);

        return {
          ...node,
          className: [
            "trie-node",
            isActive ? "is-active" : "",
            isInPath ? "is-path" : "",
            isWord ? "is-word" : "",
          ]
            .filter(Boolean)
            .join(" "),
          data: {
            label: (
              <div className="trie-node-content">
                <strong>{node.data.label === "root" ? "root" : node.data.label}</strong>
                <span>{node.data.prefix || "root"}</span>
              </div>
            ),
          },
        };
      }),
    [frame.activeTrieId, frame.path, trieGraph.nodes],
  );

  const flowEdges = useMemo(
    () =>
      trieGraph.edges.map((edge) => ({
        ...edge,
        animated: flowNodes.some((node) => node.id === edge.target && node.className?.includes("is-path")),
        className: flowNodes.some((node) => node.id === edge.target && node.className?.includes("is-path"))
          ? "edge-path"
          : "",
      })),
    [flowNodes, trieGraph.edges],
  );

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => resetTrieViewport());
    return () => window.cancelAnimationFrame(id);
  }, [resetTrieViewport, trieGraph.nodes.length]);

  const visitedKeys = new Set(frame.visited.map(cellKey));
  const currentKey = frame.currentCell ? cellKey(frame.currentCell) : "";
  const targetKey = frame.targetCell ? cellKey(frame.targetCell) : "";

  function loadExample(example: WordSearchExample) {
    setSelectedExampleId(example.id);
    setBoard(example.board);
    setWords(example.words);
    setBoardInput(JSON.stringify(example.board));
    setWordsInput(JSON.stringify(example.words));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const nextBoard = parseBoard(boardInput);
      const nextWords = parseWords(wordsInput);
      setSelectedExampleId(0);
      setBoard(nextBoard);
      setWords(nextWords);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Input is not valid JSON.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}>
            <ArrowLeft size={16} />
            Catalog
          </button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>Word Search II: Trie + DFS Visualizer</h1>
        </div>
        <div className="step-pill">
          Step {step + 1} / {dryRun.frames.length}
        </div>
      </header>

      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>
              {wordSearchExamples.map((example) => (
                <button
                  className={selectedExampleId === example.id ? "active" : ""}
                  key={example.id}
                  onClick={() => loadExample(example)}
                  type="button"
                >
                  {example.id}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-heading">
            <h2>Board</h2>
            <span>{board.length} x {board[0]?.length ?? 0}</span>
          </div>

          <div className="board-grid" style={{ gridTemplateColumns: `repeat(${board[0]?.length ?? 1}, 1fr)` }}>
            {board.flatMap((row, r) =>
              row.map((ch, c) => {
                const key = cellKey([r, c]);
                const classes = [
                  "cell",
                  visitedKeys.has(key) ? "visited" : "",
                  key === currentKey ? "current" : "",
                  key === targetKey && frame.kind === "prune" ? "blocked" : "",
                  key === targetKey && frame.kind === "start" ? "target" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <div className={classes} key={key}>
                    <strong>{ch}</strong>
                    <span>{r},{c}</span>
                  </div>
                );
              }),
            )}
          </div>

          <div className="input-grid">
            <label>
              board JSON
              <textarea value={boardInput} onChange={(event) => setBoardInput(event.target.value)} />
            </label>
            <label>
              words JSON
              <textarea value={wordsInput} onChange={(event) => setWordsInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load input
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Custom input"}</span>
            <code>{JSON.stringify(selectedExample?.output ?? frame.results)}</code>
          </div>
        </aside>

        <section className="flow-panel" ref={flowPanelRef}>
          <div className="panel-heading">
            <h2>Trie</h2>
            <span>active prefix: {frame.path || "root"}</span>
          </div>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            defaultViewport={{ x: 450, y: 42, zoom: 1 }}
            minZoom={0.25}
            maxZoom={1.8}
            nodeOrigin={[0.5, 0]}
            onInit={(instance) => {
              flowInstanceRef.current = instance;
              window.requestAnimationFrame(() => resetTrieViewport());
            }}
          >
            <Background gap={22} size={1} />
            <Controls />
          </ReactFlow>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}>
              <p className="eyebrow">{frame.kind}</p>
              <h2>{frame.title}</h2>
              <p>{frame.detail}</p>
            </div>

            <div className="controls-row">
              <button className="icon-button" onClick={() => setStep((value) => Math.max(0, value - 1))} aria-label="Previous step">
                <ChevronLeft size={18} />
              </button>
              <button className="icon-button primary" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="icon-button" onClick={() => setStep((value) => Math.min(dryRun.frames.length - 1, value + 1))} aria-label="Next step">
                <ChevronRight size={18} />
              </button>
              <button className="icon-button" onClick={() => { setStep(0); setPlaying(false); }} aria-label="Reset">
                <RefreshCcw size={18} />
              </button>
            </div>

            <input
              aria-label="Step slider"
              className="slider"
              max={dryRun.frames.length - 1}
              min={0}
              onChange={(event) => setStep(Number(event.target.value))}
              type="range"
              value={step}
            />
          </div>

          <div className="state-block">
            <h3>DFS stack</h3>
            <div className="token-list">
              {frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>visited</h3>
            <div className="token-list">
              {frame.visited.length ? frame.visited.map((cell) => <span key={cellKey(cell)}>{cellKey(cell)}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>res</h3>
            <div className="token-list words">
              {frame.results.length ? frame.results.map((word) => <span className={word === frame.foundWord ? "flash" : ""} key={word}>{word}</span>) : <em>[]</em>}
            </div>
          </div>

          <div className="code-window">
            <div className="code-title">
              <h3>Code trace</h3>
              <span>{frame.activeLines.length ? `line ${frame.activeLines.join(", ")}` : "idle"}</span>
            </div>
            <div className="active-snippet">
              {frame.activeLines.length ? (
                frame.activeLines.map((lineNumber) => (
                  <div key={lineNumber}>
                    <span>{lineNumber}</span>
                    <code>{codeLines[lineNumber - 1]}</code>
                  </div>
                ))
              ) : (
                <div>
                  <span>-</span>
                  <code>Waiting for the next dry-run step</code>
                </div>
              )}
            </div>
            <pre>
              {codeLines.map((line, index) => {
                const lineNumber = index + 1;
                const isActive = frame.activeLines.includes(lineNumber);
                return (
                  <span className={isActive ? "code-line active" : "code-line"} key={`${lineNumber}-${line}`}>
                    <span className="code-number">{lineNumber}</span>
                    <code>{line || " "}</code>
                  </span>
                );
              })}
            </pre>
          </div>
        </aside>
      </section>
    </main>
  );
}
