export type GroupAnagramsInput = { strs: string[] };

export const title = "49. Group Anagrams";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
  { id: 2, label: "LeetCode 2", input: { strs: [""] }, output: [[""]] },
  { id: 3, label: "LeetCode 3", input: { strs: ["a"] }, output: [["a"]] },
] satisfies Array<{ id: number; label: string; input: GroupAnagramsInput; output: string[][] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:",
  "        groups = defaultdict(list)",
  "",
  "        for word in strs:",
  "            key = ''.join(sorted(word))",
  "            groups[key].append(word)",
  "",
  "        return list(groups.values())",
];
