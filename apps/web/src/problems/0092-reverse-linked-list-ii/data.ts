export type ReverseLinkedListIiInput = { head: number[]; left: number; right: number };

export const title = "92. Reverse Linked List II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 2, 3, 4, 5], left: 2, right: 4 }, output: [1, 4, 3, 2, 5] },
  { id: 2, label: "LeetCode 2", input: { head: [5], left: 1, right: 1 }, output: [5] },
] satisfies Array<{ id: number; label: string; input: ReverseLinkedListIiInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:",
  "        dummy = ListNode(0, head)",
  "        prev = dummy",
  "",
  "        for _ in range(left - 1):",
  "            prev = prev.next",
  "        current = prev.next",
  "",
  "        for _ in range(right - left):",
  "            next_node = current.next",
  "            current.next = next_node.next",
  "            next_node.next = prev.next",
  "            prev.next = next_node",
  "",
  "        return dummy.next",
];
