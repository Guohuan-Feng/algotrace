import type { TrieOperation } from "../../types";

export const title = "Add and Search Word: Trie + Wildcard DFS";

export const codeLines = [
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

export const operations: TrieOperation[] = [
  { name: "WordDictionary", args: [], output: "null" },
  { name: "addWord", args: ["bad"], output: "null" },
  { name: "addWord", args: ["dad"], output: "null" },
  { name: "addWord", args: ["mad"], output: "null" },
  { name: "search", args: ["pad"], output: "false" },
  { name: "search", args: ["bad"], output: "true" },
  { name: "search", args: [".ad"], output: "true" },
  { name: "search", args: ["b.."], output: "true" },
];
