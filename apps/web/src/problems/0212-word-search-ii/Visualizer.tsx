import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import { TrieFlow } from "../../shared/components/TrieFlow";
import { parseBoard, parseWords } from "../../shared/lib/inputParsers";
import { cellKey } from "../../shared/lib/trieModel";
import type { VisualizerProps, WordSearchExample } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import { createWordSearchDryRun } from "./dryRun";

export default function WordSearchIiVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [board, setBoard] = useState(defaultExample.board);
  const [words, setWords] = useState(defaultExample.words);
  const [boardInput, setBoardInput] = useState(JSON.stringify(defaultExample.board));
  const [wordsInput, setWordsInput] = useState(JSON.stringify(defaultExample.words));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createWordSearchDryRun(board, words), [board, words]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  const visitedKeys = new Set(frame.visited.map(cellKey));
  const currentKey = frame.currentCell ? cellKey(frame.currentCell) : "";
  const targetKey = frame.targetCell ? cellKey(frame.targetCell) : "";

  function loadExample(example: WordSearchExample) {
    setSelectedExampleId(example.id);
    setBoard(example.board);
    setWords(example.words);
    setBoardInput(JSON.stringify(example.board));
    setWordsInput(JSON.stringify(example.words));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const nextBoard = parseBoard(boardInput);
      const nextWords = parseWords(wordsInput);
      setSelectedExampleId(0);
      setBoard(nextBoard);
      setWords(nextWords);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Input is not valid JSON.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}>
            <ArrowLeft size={16} />
            Catalog
          </button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">
          Step {step + 1} / {dryRun.frames.length}
        </div>
      </header>

      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>
              {examples.map((example) => (
                <button
                  className={selectedExampleId === example.id ? "active" : ""}
                  key={example.id}
                  onClick={() => loadExample(example)}
                  type="button"
                >
                  {example.id}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-heading">
            <h2>Board</h2>
            <span>{board.length} x {board[0]?.length ?? 0}</span>
          </div>

          <div className="board-grid" style={{ gridTemplateColumns: `repeat(${board[0]?.length ?? 1}, 1fr)` }}>
            {board.flatMap((row, r) =>
              row.map((ch, c) => {
                const key = cellKey([r, c]);
                const classes = [
                  "cell",
                  visitedKeys.has(key) ? "visited" : "",
                  key === currentKey ? "current" : "",
                  key === targetKey && frame.kind === "prune" ? "blocked" : "",
                  key === targetKey && frame.kind === "start" ? "target" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <div className={classes} key={key}>
                    <strong>{ch}</strong>
                    <span>{r},{c}</span>
                  </div>
                );
              }),
            )}
          </div>

          <div className="input-grid">
            <label>
              board JSON
              <textarea value={boardInput} onChange={(event) => setBoardInput(event.target.value)} />
            </label>
            <label>
              words JSON
              <textarea value={wordsInput} onChange={(event) => setWordsInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load input
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Custom input"}</span>
            <code>{JSON.stringify(selectedExample?.output ?? frame.results)}</code>
          </div>
        </aside>

        <TrieFlow activeTrieId={frame.activeTrieId} path={frame.path} root={frame.root} />

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}>
              <p className="eyebrow">{frame.kind}</p>
              <h2>{frame.title}</h2>
              <p>{frame.detail}</p>
            </div>

            <StepControls
              frameCount={dryRun.frames.length}
              playing={playing}
              step={step}
              onPlayingChange={setPlaying}
              onStepChange={setStep}
            />
          </div>

          <div className="state-block">
            <h3>DFS stack</h3>
            <div className="token-list">
              {frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>visited</h3>
            <div className="token-list">
              {frame.visited.length ? frame.visited.map((cell) => <span key={cellKey(cell)}>{cellKey(cell)}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>res</h3>
            <div className="token-list words">
              {frame.results.length ? frame.results.map((word) => <span className={word === frame.foundWord ? "flash" : ""} key={word}>{word}</span>) : <em>[]</em>}
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
