export type LinkedListCycleIIExample = { id: number; label: string; input: { values: number[]; pos: number }; output: number | null };
export const title = "142. Linked List Cycle II";
export const examples: LinkedListCycleIIExample[] = [
  { id: 1, label: "LeetCode 1", input: { values: [3, 2, 0, -4], pos: 1 }, output: 1 },
  { id: 2, label: "LeetCode 2", input: { values: [1, 2], pos: 0 }, output: 0 },
  { id: 3, label: "LeetCode 3", input: { values: [1], pos: -1 }, output: null },
];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:","    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:","        slow = fast = head","","        while fast and fast.next:","            slow = slow.next","            fast = fast.next.next","            if slow == fast:","                break","        else:","            return None","","        slow = head","        while slow != fast:","            slow = slow.next","            fast = fast.next","","        return slow"];
