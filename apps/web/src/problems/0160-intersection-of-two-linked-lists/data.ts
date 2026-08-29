export type IntersectionInput = { aPrefix: number[]; bPrefix: number[]; shared: number[] };
export const title = "160. Intersection of Two Linked Lists";
export const examples = [
  { id: 1, label: "LeetCode 1", input: { aPrefix: [4, 1], bPrefix: [5, 6, 1], shared: [8, 4, 5] }, output: 8 },
  { id: 2, label: "LeetCode 2", input: { aPrefix: [1, 9, 1], bPrefix: [3], shared: [2, 4] }, output: 2 },
  { id: 3, label: "LeetCode 3", input: { aPrefix: [2, 6, 4], bPrefix: [1, 5], shared: [] }, output: null },
] satisfies Array<{ id: number; label: string; input: IntersectionInput; output: number | null }>;
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:", "        pointerA, pointerB = headA, headB", "", "        while pointerA != pointerB:", "            pointerA = pointerA.next if pointerA else headB", "            pointerB = pointerB.next if pointerB else headA", "", "        return pointerA"];
