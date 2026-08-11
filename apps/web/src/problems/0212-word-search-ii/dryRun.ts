import { cellKey, cloneCellSet, cloneTrie, makeRoot } from "../../shared/lib/trieModel";
import type { Cell, TrieNodeModel, WordSearchFrame } from "../../shared/types";
import { directions } from "./data";

export function createWordSearchDryRun(board: string[][], words: string[]) {
  const root = makeRoot();
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const frames: WordSearchFrame[] = [];
  const visited = new Set<string>();
  const found = new Set<string>();

  const pushFrame = (
    frame: Omit<WordSearchFrame, "activeLines" | "root" | "visited" | "results"> & { activeLines?: number[] },
  ) => {
    frames.push({
      ...frame,
      root: cloneTrie(root),
      activeLines: frame.activeLines ?? [],
      visited: cloneCellSet(visited),
      results: [...found].sort(),
    });
  };

  pushFrame({
    kind: "build",
    title: "Create Trie root",
    detail: `Start with an empty root. Next, insert ${words.length} words from the LeetCode example one by one.`,
    activeLines: [1],
    currentCell: null,
    targetCell: null,
    activeTrieId: "root",
    stack: [],
    path: "",
    queuedWord: null,
    foundWord: null,
  });

  words.forEach((word) => {
    let node = root;
    let prefix = "";

    pushFrame({
      kind: "build",
      title: `Insert "${word}"`,
      detail: `Start from root and add each character in "${word}".`,
      activeLines: [3, 4],
      currentCell: null,
      targetCell: null,
      activeTrieId: "root",
      stack: [`insert("${word}")`],
      path: "",
      queuedWord: word,
      foundWord: null,
    });

    word.split("").forEach((ch) => {
      const nextPrefix = prefix + ch;
      pushFrame({
        kind: "build",
        title: `Check "${ch}"`,
        detail: `At prefix "${prefix || "root"}", check whether child "${ch}" already exists.`,
        activeLines: [5, 6],
        currentCell: null,
        targetCell: null,
        activeTrieId: node.id,
        stack: [`insert("${word}")`, nextPrefix],
        path: prefix,
        queuedWord: word,
        foundWord: null,
      });

      if (!node.children[ch]) {
        node.children[ch] = {
          id: `trie-${nextPrefix}`,
          label: ch,
          prefix: nextPrefix,
          word: null,
          children: {},
        };
        pushFrame({
          kind: "found",
          title: `Create node "${ch}"`,
          detail: `Create a new Trie node for prefix "${nextPrefix}".`,
          activeLines: [6, 7],
          currentCell: null,
          targetCell: null,
          activeTrieId: node.children[ch].id,
          stack: [`insert("${word}")`, nextPrefix],
          path: nextPrefix,
          queuedWord: word,
          foundWord: null,
        });
      } else {
        pushFrame({
          kind: "visit",
          title: `Reuse node "${ch}"`,
          detail: `Prefix "${nextPrefix}" already exists, so reuse that node.`,
          activeLines: [6, 8],
          currentCell: null,
          targetCell: null,
          activeTrieId: node.children[ch].id,
          stack: [`insert("${word}")`, nextPrefix],
          path: nextPrefix,
          queuedWord: word,
          foundWord: null,
        });
      }

      node = node.children[ch];
      prefix = nextPrefix;
    });

    node.word = word;
    pushFrame({
      kind: "done",
      title: `Mark word "${word}"`,
      detail: `Set node.word = "${word}" so DFS can recognize a complete word.`,
      activeLines: [9],
      currentCell: null,
      targetCell: null,
      activeTrieId: node.id,
      stack: [`insert("${word}")`, `word = "${word}"`],
      path: prefix,
      queuedWord: word,
      foundWord: null,
    });
  });

  function dfs(r: number, c: number, node: TrieNodeModel, stack: string[], path: string) {
    const label = `dfs(${r}, ${c}, "${path || "root"}")`;

    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      pushFrame({
        kind: "prune",
        title: "Prune: boundary",
        detail: `${label} stops because (${r}, ${c}) is outside the board.`,
        activeLines: [15, 16],
        currentCell: null,
        targetCell: [r, c],
        activeTrieId: node.id,
        stack,
        path,
        queuedWord: null,
        foundWord: null,
      });
      return;
    }

    const key = cellKey([r, c]);
    if (visited.has(key)) {
      pushFrame({
        kind: "prune",
        title: "Prune: already visited",
        detail: `${label} stops because this cell is already in the current DFS path.`,
        activeLines: [18, 19],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: node.id,
        stack,
        path,
        queuedWord: null,
        foundWord: null,
      });
      return;
    }

    const ch = board[r][c];
    const nextNode = node.children[ch];

    if (!nextNode) {
      pushFrame({
        kind: "prune",
        title: "Prune: Trie mismatch",
        detail: `${label} reads "${ch}", but prefix "${path}${ch}" does not exist in the Trie.`,
        activeLines: [21, 23, 24],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: node.id,
        stack,
        path,
        queuedWord: null,
        foundWord: null,
      });
      return;
    }

    visited.add(key);
    const nextPath = path + ch;
    const nextStack = [...stack, `(${r},${c}) ${ch}`];

    pushFrame({
      kind: "visit",
      title: "Visit cell",
      detail: `Take "${ch}" and move from prefix "${path || "root"}" to "${nextPath}".`,
      activeLines: [21, 26, 32],
      currentCell: [r, c],
      targetCell: [r, c],
      activeTrieId: nextNode.id,
      stack: nextStack,
      path: nextPath,
      queuedWord: null,
      foundWord: null,
    });

    if (nextNode.word && !found.has(nextNode.word)) {
      found.add(nextNode.word);
      pushFrame({
        kind: "found",
        title: "Found word",
        detail: `"${nextNode.word}" is complete at this Trie node. Add it to res and clear node.word to avoid duplicates.`,
        activeLines: [28, 29, 30],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: nextNode.id,
        stack: nextStack,
        path: nextPath,
        queuedWord: nextNode.word,
        foundWord: nextNode.word,
      });
    }

    directions.forEach(([dr, dc, name]) => {
      pushFrame({
        kind: "start",
        title: `Try ${name}`,
        detail: `From (${r}, ${c}), continue DFS to (${r + dr}, ${c + dc}).`,
        activeLines:
          name === "down" ? [34] : name === "up" ? [35] : name === "right" ? [36] : [37],
        currentCell: [r, c],
        targetCell: [r + dr, c + dc],
        activeTrieId: nextNode.id,
        stack: nextStack,
        path: nextPath,
        queuedWord: null,
        foundWord: null,
      });
      dfs(r + dr, c + dc, nextNode, nextStack, nextPath);
    });

    pushFrame({
      kind: "backtrack",
      title: "Backtrack",
      detail: `Remove (${r}, ${c}) from visited so another path can reuse it later.`,
      activeLines: [39],
      currentCell: [r, c],
      targetCell: [r, c],
      activeTrieId: nextNode.id,
      stack: nextStack.slice(0, -1),
      path,
      queuedWord: null,
      foundWord: null,
    });
    visited.delete(key);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      pushFrame({
        kind: "start",
        title: "Choose start cell",
        detail: `Start a fresh DFS from board[${r}][${c}] = "${board[r][c]}".`,
        activeLines: [41, 42, 43],
        currentCell: [r, c],
        targetCell: [r, c],
        activeTrieId: "root",
        stack: [],
        path: "",
        queuedWord: null,
        foundWord: null,
      });
      dfs(r, c, root, [], "");
    }
  }

  pushFrame({
    kind: "done",
    title: "Done",
    detail: `All start cells have been searched. Result: [${[...found].sort().join(", ")}].`,
    activeLines: [45],
    currentCell: null,
    targetCell: null,
    activeTrieId: "root",
    stack: [],
    path: "",
    queuedWord: null,
    foundWord: null,
  });

  return { frames, root };
}
