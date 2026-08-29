export type RemoveNthInput = { head: number[]; n: number };

export const title = "19. Remove Nth Node From End of List";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 2, 3, 4, 5], n: 2 }, output: [1, 2, 3, 5] },
  { id: 2, label: "LeetCode 2", input: { head: [1], n: 1 }, output: [] },
  { id: 3, label: "LeetCode 3", input: { head: [1, 2], n: 1 }, output: [1] },
] satisfies Array<{ id: number; label: string; input: RemoveNthInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:",
  "        dummy = ListNode(0, head)",
  "        slow = fast = dummy",
  "",
  "        for _ in range(n + 1):",
  "            fast = fast.next",
  "",
  "        while fast:",
  "            fast = fast.next",
  "            slow = slow.next",
  "",
  "        slow.next = slow.next.next",
  "        return dummy.next",
];
