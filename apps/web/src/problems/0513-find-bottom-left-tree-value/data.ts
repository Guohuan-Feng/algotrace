export type BottomLeftExample = { id: number; label: string; input: Array<number | null>; output: number };
export const title = "513. Find Bottom Left Tree Value";
export const examples: BottomLeftExample[] = [{ id: 1, label: "LeetCode 1", input: [2, 1, 3], output: 1 }, { id: 2, label: "LeetCode 2", input: [1, 2, 3, 4, null, 5, 6, null, null, 7], output: 7 }];
export const defaultExample = examples[0]!;
export const codeLines = ["class Solution:", "    def findBottomLeftValue(self, root: TreeNode) -> int:", "        queue = deque([root])", "        answer = root.val", "        while queue:", "            level_size = len(queue)", "            for index in range(level_size):", "                node = queue.popleft()", "                if index == 0:", "                    answer = node.val", "                if node.left:", "                    queue.append(node.left)", "                if node.right:", "                    queue.append(node.right)", "        return answer"];
