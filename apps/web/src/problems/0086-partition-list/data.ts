export type PartitionListInput = { head: number[]; x: number };

export const title = "86. Partition List";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { head: [1, 4, 3, 2, 5, 2], x: 3 }, output: [1, 2, 2, 4, 3, 5] },
  { id: 2, label: "LeetCode 2", input: { head: [2, 1], x: 2 }, output: [1, 2] },
] satisfies Array<{ id: number; label: string; input: PartitionListInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:",
  "        small_dummy = ListNode(0)",
  "        large_dummy = ListNode(0)",
  "        small = small_dummy",
  "        large = large_dummy",
  "",
  "        while head:",
  "            if head.val < x:",
  "                small.next = head",
  "                small = small.next",
  "            else:",
  "                large.next = head",
  "                large = large.next",
  "            head = head.next",
  "",
  "        large.next = None",
  "        small.next = large_dummy.next",
  "",
  "        return small_dummy.next",
];
