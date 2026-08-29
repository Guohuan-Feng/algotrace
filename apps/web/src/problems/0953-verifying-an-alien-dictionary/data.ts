export type AlienDictionaryInput = { words: string[]; order: string };

export type AlienDictionaryExample = {
  id: 1 | 2 | 3;
  label: string;
  input: AlienDictionaryInput;
  output: boolean;
};

export const title = "953. Verifying an Alien Dictionary";

export const examples: AlienDictionaryExample[] = [
  { id: 1, label: "LeetCode 1", input: { words: ["hello", "leetcode"], order: "hlabcdefgijkmnopqrstuvwxyz" }, output: true },
  { id: 2, label: "LeetCode 2", input: { words: ["word", "world", "row"], order: "worldabcefghijkmnpqstuvxyz" }, output: false },
  { id: 3, label: "LeetCode 3", input: { words: ["apple", "app"], order: "abcdefghijklmnopqrstuvwxyz" }, output: false },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def isAlienSorted(self, words: List[str], order: str) -> bool:",
  "        rank = {c:i for i, c in enumerate(order)}",
  "",
  "        for i in range(len(words) - 1):",
  "            w1 = words[i]",
  "            w2 = words[i + 1]",
  "",
  "            for j in range(min(len(w1), len(w2))):",
  "                if w1[j] != w2[j]:",
  "                    if rank[w1[j]] > rank[w2[j]]:",
  "                        return False",
  "                    break",
  "",
  "            else:",
  "                if len(w1) > len(w2):",
  "                    return False",
  "",
  "        return True",
];
