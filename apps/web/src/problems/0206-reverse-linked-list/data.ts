export type ReverseLinkedListExample = {
  id: 1 | 2 | 3;
  label: string;
  values: number[];
  output: number[];
};

export const title = "206. Reverse Linked List";

export const examples: ReverseLinkedListExample[] = [
  { id: 1, label: "LeetCode 1", values: [1, 2, 3, 4, 5], output: [5, 4, 3, 2, 1] },
  { id: 2, label: "LeetCode 2", values: [1, 2], output: [2, 1] },
  { id: 3, label: "Empty", values: [], output: [] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        prev = None",
  "        cur = head",
  "",
  "        while cur:",
  "            nxt = cur.next",
  "            cur.next = prev",
  "            prev = cur",
  "            cur = nxt",
  "",
  "        return prev",
];
