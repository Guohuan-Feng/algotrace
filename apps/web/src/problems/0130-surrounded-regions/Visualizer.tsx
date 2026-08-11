import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { Cell, VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SurroundedRegionsExample } from "./data";
import { createSurroundedRegionsDryRun } from "./dryRun";

export default function SurroundedRegionsVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [board, setBoard] = useState(defaultExample.board);
  const [boardInput, setBoardInput] = useState(JSON.stringify(defaultExample.board));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSurroundedRegionsDryRun(board), [board]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const cols = board[0]?.length ?? 1;

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: SurroundedRegionsExample) {
    setSelectedExampleId(example.id);
    setBoard(example.board);
    setBoardInput(JSON.stringify(example.board));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(boardInput);
      if (!isBoard(parsed)) {
        setError("Use a rectangular X/O matrix from 1 x 1 to 5 x 5.");
        return;
      }
      setSelectedExampleId(0);
      setBoard(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use valid JSON, for example [["X","O"],["O","X"]].');
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel">
        <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
        <div className="panel-heading"><h2>board</h2><span>{board.length} x {cols}</span></div>
        <div className="input-grid"><label>board JSON<textarea value={boardInput} onChange={(event) => setBoardInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load board</button></div>
        <div className="grid-legend"><span>X blocked</span><span>O open</span><span>T boundary-safe</span></div>
        <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? frame.board)}</code></div>
      </aside>
      <section className="flow-panel grid-traversal-flow-panel">
        <div className="panel-heading"><h2>Boundary DFS</h2><span>{frame.phase}</span></div>
        <div className="grid-traversal-wrap"><div className="grid-traversal-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>{frame.board.flatMap((row, rowIndex) => row.map((value, colIndex) => <div className={cellClass(value, [rowIndex, colIndex], frame.currentCell, frame.targetCell)} key={`${rowIndex}-${colIndex}`}><strong>{value}</strong><span>({rowIndex}, {colIndex})</span></div>))}</div></div>
      </section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>dfs stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map(([row, col], index) => <span key={`${row}-${col}-${index}`}>dfs({row}, {col})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>coordinates</h3><div className="token-list"><span>current = {formatCell(frame.currentCell)}</span><span>next = {formatCell(frame.targetCell)}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function isBoard(value: unknown): value is string[][] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 5 && value.every((row) => Array.isArray(row) && row.length >= 1 && row.length <= 5 && row.length === value[0]?.length && row.every((cell) => cell === "X" || cell === "O"));
}

function cellClass(value: string, cell: Cell, current: Cell | null, target: Cell | null) {
  const key = `${cell[0]}-${cell[1]}`;
  return ["grid-traversal-cell", value === "X" ? "is-wall" : "", value === "O" ? "is-open" : "", value === "T" ? "is-marked" : "", `${current?.[0]}-${current?.[1]}` === key ? "is-current" : "", `${target?.[0]}-${target?.[1]}` === key ? "is-target" : ""].filter(Boolean).join(" ");
}

function formatCell(cell: Cell | null) {
  return cell ? `(${cell[0]}, ${cell[1]})` : "none";
}
