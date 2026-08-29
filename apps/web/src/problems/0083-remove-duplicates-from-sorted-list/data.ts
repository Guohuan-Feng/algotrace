export type RemoveDuplicatesListInput = { head: number[] };

export const title = "83. Remove Duplicates from Sorted List";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 1, 2] }, output: [1, 2] },
  { id: 2, label: "LeetCode 2", input: { head: [1, 1, 2, 3, 3] }, output: [1, 2, 3] },
] satisfies Array<{ id: number; label: string; input: RemoveDuplicatesListInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        current = head",
  "",
  "        while current and current.next:",
  "            if current.val == current.next.val:",
  "                current.next = current.next.next",
  "            else:",
  "                current = current.next",
  "",
  "        return head",
];
