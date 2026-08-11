export type SortListExample = {
  id: 1 | 2 | 3;
  label: string;
  values: number[];
  output: number[];
};

export const title = "Sort List: Merge Sort Visualizer";

export const examples: SortListExample[] = [
  {
    id: 1,
    label: "Example 1",
    values: [4, 2, 1, 3],
    output: [1, 2, 3, 4],
  },
  {
    id: 2,
    label: "Example 2",
    values: [-1, 5, 3, 4, 0],
    output: [-1, 0, 3, 4, 5],
  },
  {
    id: 3,
    label: "Practice",
    values: [7, -2, 4, 4, 1, 0],
    output: [-2, 0, 1, 4, 4, 7],
  },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        slow = fast = head",
  "        while fast and fast.next:",
  "            pre = slow",
  "            slow = slow.next",
  "            fast = fast.next.next",
  "        pre.next = None",
  "        return slow",
  "",
  "    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:",
  "        cur = dummy = ListNode()",
  "        while list1 and list2:",
  "            if list1.val < list2.val:",
  "                cur.next = list1",
  "                list1 = list1.next",
  "            else:",
  "                cur.next = list2",
  "                list2 = list2.next",
  "            cur = cur.next",
  "        cur.next = list1 if list1 else list2",
  "        return dummy.next",
  "",
  "    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  "        if head is None or head.next is None:",
  "            return head",
  "        head2 = self.middleNode(head)",
  "        head = self.sortList(head)",
  "        head2 = self.sortList(head2)",
  "        return self.mergeTwoLists(head, head2)",
];
