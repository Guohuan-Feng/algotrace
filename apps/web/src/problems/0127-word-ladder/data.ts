export type WordLadderInput = { beginWord: string; endWord: string; wordList: string[] };

export const title = "127. Word Ladder";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, output: 5 },
  { id: 2, label: "LeetCode 2", input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log"] }, output: 0 },
] satisfies Array<{ id: number; label: string; input: WordLadderInput; output: number }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:",
  "        words = set(wordList)",
  "",
  "        if endWord not in words:",
  "            return 0",
  "",
  "        queue = deque([(beginWord, 1)])",
  "        visited = {beginWord}",
  "",
  "        while queue:",
  "            word, step = queue.popleft()",
  "",
  "            if word == endWord:",
  "                return step",
  "",
  "            for i in range(len(word)):",
  "                for c in \"abcdefghijklmnopqrstuvwxyz\":",
  "                    new_word = word[:i] + c + word[i + 1:]",
  "",
  "                    if new_word in words and new_word not in visited:",
  "                        visited.add(new_word)",
  "                        queue.append((new_word, step + 1))",
  "",
  "        return 0",
];
