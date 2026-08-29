import type { RandomListInput } from "./dryRun";

export type CopyRandomListExample = { id: number; label: string; input: RandomListInput; output: RandomListInput };

export const title = "138. Copy List with Random Pointer";
export const examples: CopyRandomListExample[] = [
  { id: 1, label: "LeetCode 1", input: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]], output: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] },
  { id: 2, label: "LeetCode 2", input: [[1, 1], [2, 1]], output: [[1, 1], [2, 1]] },
  { id: 3, label: "LeetCode 3", input: [[3, null], [3, 0], [3, null]], output: [[3, null], [3, 0], [3, null]] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "class Solution:",
  "    def copyRandomList(self, head: Optional[Node]) -> Optional[Node]:",
  "        if not head:",
  "            return None",
  "",
  "        cur = head",
  "        while cur:",
  "            copy = Node(cur.val, cur.next)",
  "            cur.next = copy",
  "            cur = copy.next",
  "",
  "        cur = head",
  "        while cur:",
  "            if cur.random:",
  "                cur.next.random = cur.random.next",
  "            cur = cur.next.next",
  "",
  "        dummy = Node(0)",
  "        copy_cur = dummy",
  "        cur = head",
  "        while cur:",
  "            copy = cur.next",
  "            cur.next = copy.next",
  "            copy_cur.next = copy",
  "            copy_cur = copy",
  "            cur = cur.next",
  "",
  "        return dummy.next",
];
