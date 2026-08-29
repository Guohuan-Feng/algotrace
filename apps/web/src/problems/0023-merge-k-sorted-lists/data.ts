export type MergeKListsExample = { id: number; label: string; input: number[][]; output: number[] };
export const title = "23. Merge k Sorted Lists";
export const examples: MergeKListsExample[] = [
  { id: 1, label: "LeetCode 1", input: [[1, 4, 5], [1, 3, 4], [2, 6]], output: [1, 1, 2, 3, 4, 4, 5, 6] },
  { id: 2, label: "LeetCode 2", input: [], output: [] },
  { id: 3, label: "LeetCode 3", input: [[]], output: [] },
];
export const defaultExample = examples[0]!;
export const codeLines = [
  "import heapq",
  "",
  "class Solution:",
  "    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:",
  "        heap = []",
  "        for i, node in enumerate(lists):",
  "            if node: heapq.heappush(heap, (node.val, i, node))",
  "",
  "        dummy = ListNode()",
  "        cur = dummy",
  "        while heap:",
  "            _, i, node = heapq.heappop(heap)",
  "            cur.next = node",
  "            cur = cur.next",
  "            if node.next: heapq.heappush(heap, (node.next.val, i, node.next))",
  "",
  "        return dummy.next",
];
