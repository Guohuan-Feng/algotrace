export type CloneGraphInput = { adjList: number[][] };

export type CloneGraphExample = {
  id: 1 | 2;
  label: string;
  input: CloneGraphInput;
  output: number[][];
};

export const title = "133. Clone Graph";

export const examples: CloneGraphExample[] = [
  { id: 1, label: "LeetCode 1", input: { adjList: [[2, 4], [1, 3], [2, 4], [1, 3]] }, output: [[2, 4], [1, 3], [2, 4], [1, 3]] },
  { id: 2, label: "LeetCode 2", input: { adjList: [] }, output: [] },
];

export const defaultExample = examples[0];

export const codeLines = [
  "class Solution:",
  "    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:",
  "        if not node:",
  "            return None",
  "",
  "        visited = {}",
  "",
  "        def dfs(node):",
  "            if node in visited:",
  "                return visited[node]",
  "",
  "            copy = Node(node.val)",
  "            visited[node] = copy",
  "",
  "            for nei in node.neighbors:",
  "                copy.neighbors.append(dfs(nei))",
  "",
  "            return copy",
  "",
  "        return dfs(node)",
];
