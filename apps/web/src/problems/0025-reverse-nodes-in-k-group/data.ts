export type ReverseKGroupExample = { id: number; label: string; input: { values: number[]; k: number }; output: number[] };

export const title = "25. Reverse Nodes in k-Group";
export const examples: ReverseKGroupExample[] = [
  { id: 1, label: "LeetCode 1", input: { values: [1, 2, 3, 4, 5], k: 2 }, output: [2, 1, 4, 3, 5] },
  { id: 2, label: "LeetCode 2", input: { values: [1, 2, 3, 4, 5], k: 3 }, output: [3, 2, 1, 4, 5] },
  { id: 3, label: "LeetCode 3", input: { values: [1, 2, 3, 4, 5], k: 1 }, output: [1, 2, 3, 4, 5] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:",
  "        dummy = ListNode(0, head)",
  "        group_prev = dummy",
  "",
  "        while True:",
  "            kth = group_prev",
  "            for _ in range(k):",
  "                kth = kth.next",
  "                if not kth:",
  "                    return dummy.next",
  "",
  "            group_next = kth.next",
  "            prev, curr = group_next, group_prev.next",
  "            while curr != group_next:",
  "                tmp = curr.next",
  "                curr.next = prev",
  "                prev = curr",
  "                curr = tmp",
  "",
  "            tmp = group_prev.next",
  "            group_prev.next = kth",
  "            group_prev = tmp",
  "",
  "        return dummy.next",
];
