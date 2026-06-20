import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import { parseBoard } from "../../lib/inputParsers";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { WordSearchExistExample } from "./data";
import { cellKey, createWordSearchExistDryRun } from "./dryRun";

export function WordSearchVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [board, setBoard] = useState(defaultExample.board);
  const [word, setWord] = useState(defaultExample.word);
  const [boardInput, setBoardInput] = useState(JSON.stringify(defaultExample.board));
  const [wordInput, setWordInput] = useState(defaultExample.word);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createWordSearchExistDryRun(board, word), [board, word]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const visitedKeys = useMemo(() => new Set(frame.visited.map(cellKey)), [frame.visited]);
  const currentKey = frame.currentCell ? cellKey(frame.currentCell) : "";
  const targetKey = frame.targetCell ? cellKey(frame.targetCell) : "";

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

  function loadExample(example: WordSearchExistExample) {
    setSelectedExampleId(example.id);
    setBoard(example.board);
    setWord(example.word);
    setBoardInput(JSON.stringify(example.board));
    setWordInput(example.word);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const nextBoard = parseBoard(boardInput);
      const nextWord = wordInput.trim();
      if (!nextWord) {
        setError("Word must be a non-empty string.");
        return;
      }
      if (nextBoard.length > 5 || nextBoard[0].length > 6 || nextWord.length > 12) {
        setError("Use a board up to 5 x 6 and a word up to 12 characters so the dry run stays readable.");
        return;
      }

      setSelectedExampleId(0);
      setBoard(nextBoard);
      setWord(nextWord);
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
            <h2>Input</h2>
            <span>{board.length} x {board[0]?.length ?? 0}</span>
          </div>

          <div className="expected-output">
            <span>word</span>
            <code>{word}</code>
          </div>

          <div className="word-strip" aria-label="Word progress">
            {word.split("").map((ch, index) => (
              <span
                className={[
                  index < frame.index ? "matched" : "",
                  index === frame.index ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={`${ch}-${index}`}
              >
                {ch}
              </span>
            ))}
          </div>

          <div className="input-grid">
            <label>
              board JSON
              <textarea value={boardInput} onChange={(event) => setBoardInput(event.target.value)} />
            </label>
            <label>
              word
              <input className="text-input" value={wordInput} onChange={(event) => setWordInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load input
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span>
            <code>{String(selectedExample?.output ?? frame.result ?? false)}</code>
          </div>
        </aside>

        <section className="flow-panel word-search-panel">
          <div className="panel-heading">
            <h2>Board DFS Trace</h2>
            <span>path: {frame.path || "empty"}</span>
          </div>

          <div className="word-board-wrap">
            <div className="word-board" style={{ gridTemplateColumns: `repeat(${board[0]?.length ?? 1}, minmax(0, 1fr))` }}>
              {board.flatMap((row, r) =>
                row.map((ch, c) => {
                  const key = cellKey([r, c]);
                  const isCurrent = key === currentKey;
                  const isTarget = key === targetKey;
                  const classes = [
                    "cell",
                    visitedKeys.has(key) ? "visited" : "",
                    isTarget ? "target" : "",
                    isCurrent ? "current" : "",
                    isTarget && frame.kind === "prune" ? "blocked" : "",
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

            <div className="queen-legend">
              <span><b className="legend-queen" /> visited path</span>
              <span><b className="legend-target" /> trying</span>
              <span><b className="legend-blocked" /> pruned</span>
            </div>
          </div>
        </section>

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
            <h3>current state</h3>
            <div className="token-list">
              <span>index = {frame.index}</span>
              <span>need = {frame.expectedChar ?? "done"}</span>
              <span>path = {frame.path || "empty"}</span>
              {frame.targetCell ? <span>target = ({frame.targetCell[0]}, {frame.targetCell[1]})</span> : null}
              {frame.result !== null ? <span>return = {String(frame.result)}</span> : null}
            </div>
          </div>

          <div className="state-block">
            <h3>visited</h3>
            <div className="token-list">
              {frame.visited.length ? frame.visited.map((cell) => <span key={cellKey(cell)}>({cell[0]}, {cell[1]})</span>) : <em>empty</em>}
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
