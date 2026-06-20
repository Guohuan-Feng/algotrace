import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { Cell, VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { NQueensExample } from "./data";
import { createNQueensDryRun } from "./dryRun";

export function NQueensIiVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [n, setN] = useState(defaultExample.n);
  const [nInput, setNInput] = useState(String(defaultExample.n));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createNQueensDryRun(n), [n]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const queenKeys = useMemo(() => new Set(frame.queens.map(cellKey)), [frame.queens]);
  const attackedKeys = useMemo(() => getAttackedCells(n, frame.queens), [frame.queens, n]);

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

  function loadExample(example: NQueensExample) {
    setSelectedExampleId(example.id);
    setN(example.n);
    setNInput(String(example.n));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    const nextN = Number(nInput);
    if (!Number.isInteger(nextN) || nextN < 1 || nextN > 6) {
      setError("Use an integer n from 1 to 6.");
      return;
    }

    setSelectedExampleId(0);
    setN(nextN);
    setStep(0);
    setPlaying(false);
    setError("");
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
            <span>n = {n}</span>
          </div>

          <div className="expected-output">
            <span>current row</span>
            <code>{frame.row < n ? frame.row : "done"}</code>
          </div>

          <div className="expected-output">
            <span>placed queens</span>
            <code>{formatCells(frame.queens)}</code>
          </div>

          <div className="input-grid">
            <label>
              n
              <input className="text-input" value={nInput} onChange={(event) => setNInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load n
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Current count"}</span>
            <code>{selectedExample?.output ?? frame.resultCount}</code>
          </div>
        </aside>

        <section className="flow-panel queen-flow-panel">
          <div className="panel-heading">
            <h2>Chessboard Trace</h2>
            <span>res = {frame.resultCount}</span>
          </div>

          <div className="queen-board-wrap">
            <div className="queen-board" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {Array.from({ length: n * n }, (_, index) => {
                const row = Math.floor(index / n);
                const col = index % n;
                const key = `${row}-${col}`;
                const hasQueen = queenKeys.has(key);
                const isTarget = frame.row === row && frame.col === col;
                const isCurrentRow = frame.row === row && frame.row < n;
                const isAttacked = attackedKeys.has(key) && !hasQueen;
                const className = [
                  "queen-cell",
                  (row + col) % 2 === 0 ? "light" : "dark",
                  hasQueen ? "has-queen" : "",
                  isCurrentRow ? "current-row" : "",
                  isAttacked ? "attacked" : "",
                  isTarget ? "target" : "",
                  isTarget && frame.kind === "prune" ? "blocked" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div className={className} key={key}>
                    {hasQueen ? <strong>Q</strong> : null}
                    {isTarget && !hasQueen ? <span>{row},{col}</span> : null}
                  </div>
                );
              })}
            </div>

            <div className="queen-legend">
              <span><b className="legend-queen" /> queen</span>
              <span><b className="legend-target" /> trying</span>
              <span><b className="legend-attack" /> attacked</span>
              <span><b className="legend-blocked" /> skipped</span>
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
            <h3>call stack</h3>
            <div className="token-list">
              {frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>sets</h3>
            <div className="token-list">
              <span>cols = {formatSet(frame.cols)}</span>
              <span>diag1 = {formatSet(frame.diag1)}</span>
              <span>diag2 = {formatSet(frame.diag2)}</span>
            </div>
          </div>

          <div className="state-block">
            <h3>current state</h3>
            <div className="token-list">
              <span>row = {frame.row}</span>
              {frame.col !== null ? <span>col = {frame.col}</span> : null}
              <span>res = {frame.resultCount}</span>
            </div>
          </div>

          <div className="state-block">
            <h3>conflict</h3>
            <div className="token-list">
              {frame.conflictReasons.length ? frame.conflictReasons.map((reason) => <span className="danger-token" key={reason}>{reason}</span>) : <em>none</em>}
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function cellKey([row, col]: Cell): string {
  return `${row}-${col}`;
}

function formatCells(cells: Cell[]): string {
  return cells.length ? `[${cells.map(([row, col]) => `(${row},${col})`).join(", ")}]` : "[]";
}

function formatSet(values: number[]): string {
  return values.length ? `{${values.join(", ")}}` : "{}";
}

function getAttackedCells(n: number, queens: Cell[]): Set<string> {
  const attacked = new Set<string>();
  queens.forEach(([queenRow, queenCol]) => {
    for (let row = 0; row < n; row += 1) {
      for (let col = 0; col < n; col += 1) {
        if (row === queenRow && col === queenCol) {
          continue;
        }
        if (col === queenCol || row - col === queenRow - queenCol || row + col === queenRow + queenCol) {
          attacked.add(`${row}-${col}`);
        }
      }
    }
  });
  return attacked;
}
