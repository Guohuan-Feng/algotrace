export type RemoveLinkedListElementsInput = { head: number[]; val: number };
export const title = "203. Remove Linked List Elements";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 2, 6, 3, 4, 5, 6], val: 6 }, output: [1, 2, 3, 4, 5] },
  { id: 2, label: "LeetCode 2", input: { head: [], val: 1 }, output: [] },
  { id: 3, label: "LeetCode 3", input: { head: [7, 7, 7, 7], val: 7 }, output: [] },
] satisfies Array<{ id: number; label: string; input: RemoveLinkedListElementsInput; output: number[] }>;
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def removeElements(self, head: Optional[ListNode], val: int) -> Optional[ListNode]:",
  "        dummy = ListNode(next=head)",
  "        prev, current = dummy, head",
  "",
  "        while current:",
  "            if current.val == val:",
  "                prev.next = current.next",
  "            else:",
  "                prev = current",
  "            current = current.next",
  "",
  "        return dummy.next",
];
