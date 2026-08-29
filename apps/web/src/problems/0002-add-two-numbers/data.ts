export type AddTwoNumbersInput = { l1: number[]; l2: number[] };

export const title = "2. Add Two Numbers";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { l1: [2, 4, 3], l2: [5, 6, 4] }, output: [7, 0, 8] },
  { id: 2, label: "LeetCode 2", input: { l1: [0], l2: [0] }, output: [0] },
  { id: 3, label: "LeetCode 3", input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }, output: [8, 9, 9, 9, 0, 0, 0, 1] },
] satisfies Array<{ id: number; label: string; input: AddTwoNumbersInput; output: number[] }>;

export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def addTwoNumbers(self, l1, l2):",
  "        dummy = ListNode()",
  "        tail, carry = dummy, 0",
  "        while l1 or l2 or carry:",
  "            left = l1.val if l1 else 0",
  "            right = l2.val if l2 else 0",
  "            total = left + right + carry",
  "            carry = total // 10",
  "            tail.next = ListNode(total % 10)",
  "            tail = tail.next",
  "        return dummy.next",
];
