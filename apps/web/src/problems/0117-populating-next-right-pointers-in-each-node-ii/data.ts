export type NextPointerExample = { id: number; label: string; input: Array<number | null>; output: string[] };

export const title = "117. Populating Next Right Pointers in Each Node II";
export const examples: NextPointerExample[] = [
  { id: 1, label: "LeetCode 1", input: [1, 2, 3, 4, 5, null, 7], output: ["1 -> #", "2 -> 3 -> #", "4 -> 5 -> 7 -> #"] },
  { id: 2, label: "LeetCode 2", input: [], output: [] },
];
export const defaultExample = examples[0]!;

export const codeLines = [
  "from collections import deque",
  "",
  "class Solution:",
  "    def connect(self, root: 'Node') -> 'Node':",
  "        if not root:",
  "            return root",
  "",
  "        queue = deque([root])",
  "        while queue:",
  "            prev = None",
  "            for _ in range(len(queue)):",
  "                node = queue.popleft()",
  "                if prev:",
  "                    prev.next = node",
  "                prev = node",
  "                if node.left: queue.append(node.left)",
  "                if node.right: queue.append(node.right)",
  "",
  "        return root",
];
