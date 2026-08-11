import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { Cell, VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { RottingOrangesExample } from "./data";
import { createRottingOrangesDryRun } from "./dryRun";

const cellKey = (cell: Cell | null) => (cell ? `${cell[0]}-${cell[1]}` : "");

export function RottingOrangesVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [grid, setGrid] = useState(defaultExample.grid);
  const [gridInput, setGridInput] = useState(JSON.stringify(defaultExample.grid));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createRottingOrangesDryRun(grid), [grid]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const cols = grid[0]?.length ?? 1;

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: RottingOrangesExample) {
    setSelectedExampleId(example.id);
    setGrid(example.grid);
    setGridInput(JSON.stringify(example.grid));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(gridInput);
      if (!isOrangeGrid(parsed)) {
        setError("Use a rectangular 0 / 1 / 2 matrix from 1 x 1 to 5 x 5.");
        return;
      }
      setSelectedExampleId(0);
      setGrid(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[2,1,1],[1,1,0]].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>grid</h2><span>{grid.length} x {cols}</span></div>
          <div className="input-grid"><label>grid JSON<textarea value={gridInput} onChange={(event) => setGridInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load grid</button></div>
          <div className="grid-legend" aria-label="oranges legend"><span><i className="legend-square empty" />0 empty</span><span><i className="legend-square fresh" />1 fresh</span><span><i className="legend-square rotten" />2 rotten</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div>
        </aside>
        <section className="flow-panel grid-traversal-flow-panel">
          <div className="panel-heading"><h2>Level-order BFS</h2><span>minute: {frame.minutes}</span></div>
          <div className="grid-traversal-wrap">
            <div className="grid-traversal-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {frame.grid.flatMap((row, i) => row.map((value, j) => {
                const key = `${i}-${j}`;
                const className = ["grid-traversal-cell", "orange-cell", value === 0 ? "is-empty" : "", value === 1 ? "is-fresh" : "", value === 2 ? "is-rotten" : "", cellKey(frame.current) === key ? "is-current" : "", cellKey(frame.updated) === key ? "is-updated" : ""].filter(Boolean).join(" ");
                const label = value === 0 ? "empty" : value === 1 ? "fresh" : "rotten";
                return <div className={className} key={key}><strong>{value}</strong><span>{label}</span></div>;
              }))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>queue</h3><div className="token-list">{frame.queue.length ? frame.queue.map(([i, j], index) => <span key={`${i}-${j}-${index}`}>({i}, {j})</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>level state</h3><div className="token-list"><span>fresh = {frame.fresh}</span><span>minutes = {frame.minutes}</span><span>len(queue) = {frame.levelSize ?? "idle"}</span></div></div>
          <div className="state-block"><h3>coordinates</h3><div className="token-list"><span>i, j = {formatCell(frame.current)}</span><span>ni, nj = {formatCell(frame.target)}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function isOrangeGrid(value: unknown): value is number[][] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 5 && value.every((row) => Array.isArray(row) && row.length >= 1 && row.length <= 5 && row.length === value[0]?.length && row.every((cell) => Number.isInteger(cell) && cell >= 0 && cell <= 2));
}

function formatCell(cell: Cell | null) {
  return cell ? `(${cell[0]}, ${cell[1]})` : "none";
}
