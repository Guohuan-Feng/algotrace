export type MergeTwoListsInput = { list1: number[]; list2: number[] };

export const title = "21. Merge Two Sorted Lists";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
  { id: 2, label: "LeetCode 2", input: { list1: [], list2: [] }, output: [] },
  { id: 3, label: "LeetCode 3", input: { list1: [], list2: [0] }, output: [0] },
] satisfies Array<{ id: number; label: string; input: MergeTwoListsInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:",
  "        dummy = ListNode()",
  "        cur = dummy",
  "",
  "        while list1 and list2:",
  "            if list1.val < list2.val:",
  "                cur.next = list1",
  "                list1 = list1.next",
  "            else:",
  "                cur.next = list2",
  "                list2 = list2.next",
  "            cur = cur.next",
  "",
  "        cur.next = list1 or list2",
  "        return dummy.next",
];
