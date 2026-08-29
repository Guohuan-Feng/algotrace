export type SymmetricTreeExample={id:number;label:string;input:Array<number|null>;output:boolean};
export const title="101. Symmetric Tree";
export const examples:SymmetricTreeExample[]=[{id:1,label:"LeetCode 1",input:[1,2,2,3,4,4,3],output:true},{id:2,label:"LeetCode 2",input:[1,2,2,null,3,null,3],output:false}];
export const defaultExample=examples[0]!;
export const codeLines=["class Solution:","    def isSymmetric(self, root: Optional[TreeNode]) -> bool:","        if not root:","            return True","","        def mirror(left, right):","            if not left and not right:","                return True","            if not left or not right or left.val != right.val:","                return False","","            return mirror(left.left, right.right) and mirror(left.right, right.left)","","        return mirror(root.left, root.right)"];
