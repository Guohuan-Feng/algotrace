import type { TrieOperation } from "../../types";

export const title = "Implement Trie: Prefix Tree Operations";

export const codeLines = [
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

export const operations: TrieOperation[] = [
  { name: "Trie", args: [], output: "null" },
  { name: "insert", args: ["apple"], output: "null" },
  { name: "search", args: ["apple"], output: "true" },
  { name: "search", args: ["app"], output: "false" },
  { name: "startsWith", args: ["app"], output: "true" },
  { name: "insert", args: ["app"], output: "null" },
  { name: "search", args: ["app"], output: "true" },
];
