import type { FrameKind } from "../../shared/types";

export type WordLadderFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  words: string[];
  queue: Array<[string, number]>;
  visited: string[];
  current: string | null;
  step: number | null;
  index: number | null;
  letter: string | null;
  candidate: string | null;
  queuedWord: string | null;
  result: number | null;
};

export function createWordLadderDryRun(beginWord: string, endWord: string, wordList: string[]): { frames: WordLadderFrame[] } {
  const words = new Set(wordList);
  const queue: Array<[string, number]> = [];
  const visited = new Set<string>();
  const frames: WordLadderFrame[] = [];
  const push = (frame: Omit<WordLadderFrame, "words" | "queue" | "visited">) => frames.push({
    ...frame,
    words: [...words].sort(),
    queue: queue.map(([word, step]) => [word, step]),
    visited: [...visited].sort(),
  });

  push({ kind: "start", title: "Build the word set", detail: "The set makes every candidate-word lookup constant time.", activeLines: [3], current: null, step: null, index: null, letter: null, candidate: null, queuedWord: null, result: null });
  if (!words.has(endWord)) {
    push({ kind: "done", title: `${endWord} is absent`, detail: "The first guard returns 0 before BFS can begin.", activeLines: [5, 6], current: beginWord, step: 0, index: null, letter: null, candidate: null, queuedWord: null, result: 0 });
    return { frames };
  }

  queue.push([beginWord, 1]);
  visited.add(beginWord);
  push({ kind: "build", title: `Start from ${beginWord}`, detail: "queue contains the starting word with step count 1.", activeLines: [8, 9], current: beginWord, step: 1, index: null, letter: null, candidate: null, queuedWord: beginWord, result: null });

  while (queue.length) {
    const [word, step] = queue.shift()!;
    push({ kind: "visit", title: `Dequeue ${word}`, detail: `${word} is currently ${step} word${step === 1 ? "" : "s"} long from the start ladder.`, activeLines: [11, 12], current: word, step, index: null, letter: null, candidate: null, queuedWord: null, result: null });
    if (word === endWord) {
      push({ kind: "done", title: `Reach ${endWord}`, detail: "The dequeued word equals endWord, so return its step count.", activeLines: [14, 15], current: word, step, index: null, letter: null, candidate: null, queuedWord: null, result: step });
      return { frames };
    }

    for (let index = 0; index < word.length; index += 1) {
      push({ kind: "visit", title: `Replace letter at index ${index}`, detail: `Keep all other characters of ${word} fixed while trying the alphabet here.`, activeLines: [17], current: word, step, index, letter: null, candidate: null, queuedWord: null, result: null });
      for (const letter of "abcdefghijklmnopqrstuvwxyz") {
        const candidate = `${word.slice(0, index)}${letter}${word.slice(index + 1)}`;
        const usable = words.has(candidate) && !visited.has(candidate);
        if (usable) {
          visited.add(candidate);
          queue.push([candidate, step + 1]);
          push({ kind: "found", title: `Enqueue ${candidate}`, detail: `${candidate} is a new dictionary word, so add it at step ${step + 1}.`, activeLines: [18, 19, 21, 22, 23], current: word, step, index, letter, candidate, queuedWord: candidate, result: null });
        } else {
          push({ kind: "prune", title: `Skip ${candidate}`, detail: words.has(candidate) ? `${candidate} was already visited.` : `${candidate} is not in the word set.`, activeLines: [18, 19, 21], current: word, step, index, letter, candidate, queuedWord: null, result: null });
        }
      }
    }
  }

  push({ kind: "done", title: "No ladder exists", detail: "BFS exhausted every reachable word, so return 0.", activeLines: [25], current: null, step: null, index: null, letter: null, candidate: null, queuedWord: null, result: 0 });
  return { frames };
}
