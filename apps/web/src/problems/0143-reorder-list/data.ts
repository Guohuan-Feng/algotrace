export type ReorderListExample = { id: number; label: string; input: { head: number[] }; output: number[] };

export const title = "143. Reorder List";
export const examples: ReorderListExample[] = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 2, 3, 4] }, output: [1, 4, 2, 3] },
  { id: 2, label: "LeetCode 2", input: { head: [1, 2, 3, 4, 5] }, output: [1, 5, 2, 4, 3] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def reorderList(self, head: Optional[ListNode]) -> None:",
  "        slow = fast = head",
  "",
  "        while fast and fast.next:",
  "            slow = slow.next",
  "            fast = fast.next.next",
  "",
  "        prev = None",
  "        curr = slow",
  "",
  "        while curr:",
  "            next_node = curr.next",
  "            curr.next = prev",
  "            prev = curr",
  "            curr = next_node",
  "",
  "        first = head",
  "        second = prev",
  "",
  "        while second.next:",
  "            next_first = first.next",
  "            next_second = second.next",
  "            first.next = second",
  "            second.next = next_first",
  "            first = next_first",
  "            second = next_second",
  "",
  "        return head",
];
