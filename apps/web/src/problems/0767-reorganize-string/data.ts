export const title = "767. Reorganize String";
export const examples = [
  { id: 1, label: "LeetCode 1", input: "aab", output: "aba" },
  { id: 2, label: "LeetCode 2", input: "aaab", output: "" },
];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def reorganizeString(self, s: str) -> str:", "        count = Counter(s)", "", "        heap = []", "", "        for char, freq in count.items():", "            heapq.heappush(heap, (-freq, char))", "", "        ans = []", "        prev_freq = 0", "        prev_char = \"\"", "", "        while heap:", "            freq, char = heapq.heappop(heap)", "", "            ans.append(char)", "            freq += 1", "", "            if prev_freq < 0:", "                heapq.heappush(heap, (prev_freq, prev_char))", "", "            prev_freq = freq", "            prev_char = char", "", "        if prev_freq < 0:", "            return \"\"", "", "        return \"\".join(ans)"];
