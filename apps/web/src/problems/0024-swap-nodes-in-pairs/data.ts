export type SwapPairsExample = { id: number; label: string; input: number[]; output: number[] };
export const title = "24. Swap Nodes in Pairs";
export const examples: SwapPairsExample[] = [
  { id: 1, label: "LeetCode 1", input: [1, 2, 3, 4], output: [2, 1, 4, 3] },
  { id: 2, label: "LeetCode 2", input: [], output: [] },
  { id: 3, label: "LeetCode 3", input: [1], output: [1] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        dummy = ListNode(0)",
  "        dummy.next = head",
  "        prev = dummy",
  "",
  "        while prev.next and prev.next.next:",
  "            first = prev.next",
  "            second = first.next",
  "",
  "            prev.next = second",
  "            first.next = second.next",
  "            second.next = first",
  "            prev = first",
  "",
  "        return dummy.next",
];
