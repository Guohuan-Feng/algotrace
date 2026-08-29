export type RemoveDuplicatesListIiInput = { head: number[] };

export const title = "82. Remove Duplicates from Sorted List II";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 2, 3, 3, 4, 4, 5] }, output: [1, 2, 5] },
  { id: 2, label: "LeetCode 2", input: { head: [1, 1, 1, 2, 3] }, output: [2, 3] },
] satisfies Array<{ id: number; label: string; input: RemoveDuplicatesListIiInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        dummy = ListNode(0, head)",
  "        prev = dummy",
  "        current = head",
  "",
  "        while current:",
  "            if current.next and current.val == current.next.val:",
  "                while current.next and current.val == current.next.val:",
  "                    current = current.next",
  "                prev.next = current.next",
  "            else:",
  "                prev = prev.next",
  "            current = current.next",
  "",
  "        return dummy.next",
];
