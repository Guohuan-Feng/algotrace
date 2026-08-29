export type LinkedListCycleExample = { id: number; label: string; input: { values: number[]; pos: number }; output: boolean };

export const title = "141. Linked List Cycle";
export const examples: LinkedListCycleExample[] = [
  { id: 1, label: "LeetCode 1", input: { values: [3, 2, 0, -4], pos: 1 }, output: true },
  { id: 2, label: "LeetCode 2", input: { values: [1, 2], pos: 0 }, output: true },
  { id: 3, label: "LeetCode 3", input: { values: [1], pos: -1 }, output: false },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def hasCycle(self, head: Optional[ListNode]) -> bool:",
  "        slow = fast = head",
  "",
  "        while fast and fast.next:",
  "            slow = slow.next",
  "            fast = fast.next.next",
  "            if slow == fast:",
  "                return True",
  "",
  "        return False",
];
