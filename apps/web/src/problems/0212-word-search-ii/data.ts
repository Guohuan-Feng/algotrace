import type { WordSearchExample } from "../../shared/types";

export const title = "Word Search II: Trie + DFS Visualizer";

export const examples: WordSearchExample[] = [
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

export const defaultExample = examples[0];

export const directions = [
  [1, 0, "down"],
  [-1, 0, "up"],
  [0, 1, "right"],
  [0, -1, "left"],
] as const;

export const codeLines = [
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
