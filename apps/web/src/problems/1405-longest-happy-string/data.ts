export type LongestHappyStringInput = { a: number; b: number; c: number };
export const title = "1405. Longest Happy String";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { a: 1, b: 1, c: 7 }, output: "ccaccbcc" },
  { id: 2, label: "LeetCode 2", input: { a: 7, b: 1, c: 0 }, output: "aabaa" },
];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def longestDiverseString(self, a: int, b: int, c: int) -> str:", "        heap = []", "", "        if a > 0: heapq.heappush(heap, (-a, \"a\"))", "        if b > 0: heapq.heappush(heap, (-b, \"b\"))", "        if c > 0: heapq.heappush(heap, (-c, \"c\"))", "", "        ans = []", "", "        while heap:", "            freq1, char1 = heapq.heappop(heap)", "", "            # char1 会导致连续三个相同字符", "            if len(ans) >= 2 and ans[-1] == char1 and ans[-2] == char1:", "                if not heap: break", "", "                # 使用剩余数量第二多的字符", "                freq2, char2 = heapq.heappop(heap)", "                ans.append(char2)", "", "                if freq2 + 1 < 0:", "                    heapq.heappush(heap, (freq2 + 1, char2))", "", "                # char1 没有使用，原样放回", "                heapq.heappush(heap, (freq1, char1))", "", "            else:", "                ans.append(char1)", "", "                if freq1 + 1 < 0:", "                    heapq.heappush(heap, (freq1 + 1, char1))", "", "        return \"\".join(ans)"];
