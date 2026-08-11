import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  "id": 108,
  "title": "Convert Sorted Array to Binary Search Tree",
  "cnTitle": "将有序数组转换为二叉搜索树",
  "slug": "convert-sorted-array-to-binary-search-tree",
  "difficulty": "Easy",
  "tags": [
    "Array",
    "Divide and Conquer",
    "Tree",
    "Binary Search Tree",
    "Binary Tree"
  ],
  "pattern": "Middle as root",
  "collections": [
    "Hot 150"
  ],
  "hasVisualizer": true,
  "summary": "Ready visualizer: split sorted ranges by mid and grow the height-balanced BST."
} satisfies ReadyProblemDefinition;
