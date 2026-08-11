import { cloneTrie, ensureTrieChild, makeRoot } from "./trieModel";
import type { TrieNodeModel, TrieOperation, TrieOperationFrame, TrieOperationMode, TrieOperationName } from "../types";

type CreateOperationDryRunOptions = {
  codeLines: string[];
  mode: TrieOperationMode;
  operations: TrieOperation[];
};

export function createOperationDryRun({ codeLines, mode, operations }: CreateOperationDryRunOptions) {
  const root = makeRoot();
  const frames: TrieOperationFrame[] = [];
  const results: string[] = [];

  const pushFrame = (frame: Omit<TrieOperationFrame, "root" | "results">) => {
    frames.push({
      ...frame,
      root: cloneTrie(root),
      results: [...results],
    });
  };

  const lineSet = (operation: TrieOperationName, phase: "start" | "create" | "move" | "end" | "miss" | "dot" | "result") => {
    if (mode === "trie") {
      if (operation === "insert") {
        return phase === "start" ? [6, 7] : phase === "create" ? [8, 9, 10] : phase === "end" ? [12] : [8, 11];
      }
      if (operation === "search") {
        return phase === "miss" ? [16, 17, 18] : phase === "result" ? [20] : [14, 15, 16, 19];
      }
      return phase === "miss" ? [24, 25, 26] : phase === "result" ? [28] : [22, 23, 24, 27];
    }

    if (operation === "addWord") {
      return phase === "start" ? [13, 14] : phase === "create" ? [16, 17, 18] : phase === "end" ? [22] : [16, 20];
    }
    if (phase === "dot") {
      return [40, 41, 42];
    }
    if (phase === "miss") {
      return [33, 34, 35];
    }
    if (phase === "result") {
      return [27, 28, 46];
    }
    return [24, 26, 30, 33, 37];
  };

  function runInsert(operation: TrieOperation, operationIndex: number) {
    const word = operation.args[0];
    let node = root;
    let prefix = "";
    const methodName = operation.name === "addWord" ? "addWord" : "insert";

    pushFrame({
      kind: "start",
      title: `${methodName}("${word}")`,
      detail: `Start at root and insert "${word}" one character at a time.`,
      activeTrieId: "root",
      path: "",
      activeLines: lineSet(operation.name, "start"),
      operationIndex,
      stack: [`${methodName}("${word}")`],
    });

    for (const ch of word) {
      prefix += ch;
      const created = !node.children[ch];
      const nextNode = ensureTrieChild(node, ch, prefix);
      pushFrame({
        kind: created ? "found" : "visit",
        title: created ? `Create node "${ch}"` : `Move to "${ch}"`,
        detail: created
          ? `"${prefix}" does not exist yet, so create a new Trie node.`
          : `"${prefix}" already exists, so reuse that node.`,
        activeTrieId: nextNode.id,
        path: prefix,
        activeLines: lineSet(operation.name, created ? "create" : "move"),
        operationIndex,
        stack: [`${methodName}("${word}")`, prefix],
      });
      node = nextNode;
    }

    node.word = word;
    results.push(operation.output);
    pushFrame({
      kind: "done",
      title: `Mark "${word}" complete`,
      detail: `Set is_end on prefix "${word}". The operation returns ${operation.output}.`,
      activeTrieId: node.id,
      path: word,
      activeLines: lineSet(operation.name, "end"),
      operationIndex,
      stack: [`return ${operation.output}`],
    });
  }

  function runPlainLookup(operation: TrieOperation, operationIndex: number) {
    const query = operation.args[0];
    let node = root;
    let prefix = "";

    pushFrame({
      kind: "start",
      title: `${operation.name}("${query}")`,
      detail: `Start at root and walk the query characters.`,
      activeTrieId: "root",
      path: "",
      activeLines: lineSet(operation.name, "start"),
      operationIndex,
      stack: [`${operation.name}("${query}")`],
    });

    for (const ch of query) {
      const nextPrefix = prefix + ch;
      if (!node.children[ch]) {
        results.push("false");
        pushFrame({
          kind: "prune",
          title: `Missing "${ch}"`,
          detail: `Prefix "${nextPrefix}" does not exist, so return false.`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "miss"),
          operationIndex,
          stack: ["return false"],
        });
        return;
      }
      node = node.children[ch];
      prefix = nextPrefix;
      pushFrame({
        kind: "visit",
        title: `Follow "${ch}"`,
        detail: `Prefix "${prefix}" exists; continue walking.`,
        activeTrieId: node.id,
        path: prefix,
        activeLines: lineSet(operation.name, "move"),
        operationIndex,
        stack: [`${operation.name}("${query}")`, prefix],
      });
    }

    const ok = operation.name === "startsWith" ? true : Boolean(node.word);
    results.push(String(ok));
    pushFrame({
      kind: ok ? "done" : "prune",
      title: `Return ${ok}`,
      detail:
        operation.name === "startsWith"
          ? `The full prefix "${query}" exists, so startsWith returns true.`
          : `The path "${query}" ${ok ? "is" : "is not"} marked as a complete word.`,
      activeTrieId: node.id,
      path: prefix,
      activeLines: lineSet(operation.name, "result"),
      operationIndex,
      stack: [`return ${ok}`],
    });
  }

  function runWildcardSearch(operation: TrieOperation, operationIndex: number) {
    const pattern = operation.args[0];

    pushFrame({
      kind: "start",
      title: `search("${pattern}")`,
      detail: "Start DFS from root. A dot can match any child node.",
      activeTrieId: "root",
      path: "",
      activeLines: [24, 26, 46],
      operationIndex,
      stack: [`search("${pattern}")`],
    });

    const dfs = (index: number, node: TrieNodeModel, prefix: string, stack: string[]): boolean => {
      if (index === pattern.length) {
        const ok = Boolean(node.word);
        pushFrame({
          kind: ok ? "done" : "prune",
          title: `End of pattern: ${ok}`,
          detail: `Reached "${prefix || "root"}"; is_end is ${ok}, so this path ${ok ? "matches" : "fails"}.`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "result"),
          operationIndex,
          stack: [...stack, `return ${ok}`],
        });
        return ok;
      }

      const ch = pattern[index];
      if (ch === ".") {
        pushFrame({
          kind: "start",
          title: `Wildcard at index ${index}`,
          detail: `Try every child under prefix "${prefix || "root"}".`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "dot"),
          operationIndex,
          stack: [...stack, `.${index}`],
        });

        for (const child of Object.values(node.children)) {
          pushFrame({
            kind: "visit",
            title: `Try "${child.label}" for "."`,
            detail: `Wildcard chooses "${child.label}", moving to prefix "${child.prefix}".`,
            activeTrieId: child.id,
            path: child.prefix,
            activeLines: lineSet(operation.name, "dot"),
            operationIndex,
            stack: [...stack, `.${index} -> ${child.label}`],
          });
          if (dfs(index + 1, child, child.prefix, [...stack, child.prefix])) {
            return true;
          }
        }

        pushFrame({
          kind: "prune",
          title: "Wildcard branch failed",
          detail: `No child under "${prefix || "root"}" can complete "${pattern}".`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "miss"),
          operationIndex,
          stack: [...stack, "return false"],
        });
        return false;
      }

      if (!node.children[ch]) {
        pushFrame({
          kind: "prune",
          title: `Missing "${ch}"`,
          detail: `Prefix "${prefix + ch}" does not exist, so this DFS branch returns false.`,
          activeTrieId: node.id,
          path: prefix,
          activeLines: lineSet(operation.name, "miss"),
          operationIndex,
          stack: [...stack, "return false"],
        });
        return false;
      }

      const child = node.children[ch];
      pushFrame({
        kind: "visit",
        title: `Follow "${ch}"`,
        detail: `Move to prefix "${child.prefix}" and continue DFS.`,
        activeTrieId: child.id,
        path: child.prefix,
        activeLines: lineSet(operation.name, "move"),
        operationIndex,
        stack: [...stack, child.prefix],
      });
      return dfs(index + 1, child, child.prefix, [...stack, child.prefix]);
    };

    const matched = dfs(0, root, "", ["dfs(0, root)"]);
    results.push(String(matched));
    pushFrame({
      kind: matched ? "done" : "prune",
      title: `search("${pattern}") returns ${matched}`,
      detail: `The official example expects ${operation.output}; the DFS result is ${matched}.`,
      activeTrieId: "root",
      path: "",
      activeLines: [46],
      operationIndex,
      stack: [`return ${matched}`],
    });
  }

  operations.forEach((operation, operationIndex) => {
    if (operation.name === "Trie" || operation.name === "WordDictionary") {
      results.push(operation.output);
      pushFrame({
        kind: "build",
        title: `${operation.name}()`,
        detail: "Create an empty root node.",
        activeTrieId: "root",
        path: "",
        activeLines: mode === "word-dictionary" ? [1, 2, 3, 5, 8, 10, 11] : [1, 2, 3, 4],
        operationIndex,
        stack: ["constructor"],
      });
      return;
    }

    if (operation.name === "insert" || operation.name === "addWord") {
      runInsert(operation, operationIndex);
      return;
    }

    if (mode === "word-dictionary") {
      runWildcardSearch(operation, operationIndex);
      return;
    }

    runPlainLookup(operation, operationIndex);
  });

  return { code: codeLines, frames, operations };
}
