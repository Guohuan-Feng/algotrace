import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { Cell, VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SwimInWaterExample } from "./data";
import { createSwimInWaterDryRun } from "./dryRun";
import type { SwimInWaterFrame } from "./dryRun";

const cellKey = (cell: Cell | null) => (cell ? `${cell[0]}-${cell[1]}` : "");

export default function SwimInRisingWaterVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [grid, setGrid] = useState(copyGrid(defaultExample.grid));
  const [gridInput, setGridInput] = useState(JSON.stringify(defaultExample.grid));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSwimInWaterDryRun(grid), [grid]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const visited = new Set(frame.visited.map(cellKey));
  const queued = new Set(frame.heap.map(([, row, col]) => `${row}-${col}`));

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 680);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: SwimInWaterExample) {
    setSelectedExampleId(example.id);
    setGrid(copyGrid(example.grid));
    setGridInput(JSON.stringify(example.grid));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(gridInput);
      if (!isValidGrid(parsed)) {
        setError("Use a square integer grid from 2x2 to 5x5.");
        return;
      }
      setSelectedExampleId(0);
      setGrid(copyGrid(parsed));
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[0,2],[1,3]].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input grid</h2><span>{grid.length} x {grid[0].length}</span></div>
          <div className="input-grid"><label>grid JSON<textarea value={gridInput} onChange={(event) => setGridInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load grid</button></div>
          <div className="swim-legend"><span>white unvisited</span><span>yellow current</span><span>green visited</span><span>blue queued</span><span>red stale entry</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>

        <section className="flow-panel swim-flow-panel">
          <div className="panel-heading"><h2>Min-Heap Water Level Search</h2><span>water level: {frame.time ?? "-"}</span></div>
          <div className="swim-stage">
            <div className="swim-grid-wrap"><div className={`swim-board size-${grid.length}`} style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
              {frame.grid.flatMap((row, rowIndex) => row.map((height, colIndex) => {
                const current = `${rowIndex}-${colIndex}`;
                const classes = ["swim-cell", visited.has(current) ? "is-visited" : "", queued.has(current) ? "is-queued" : "", cellKey(frame.neighbor) === current ? "is-neighbor" : "", cellKey(frame.current) === current ? "is-current" : "", frame.phase === "skip" && cellKey(frame.current) === current ? "is-stale" : "", rowIndex === 0 && colIndex === 0 ? "is-start" : "", rowIndex === grid.length - 1 && colIndex === grid.length - 1 ? "is-goal" : ""].filter(Boolean).join(" ");
                const label = cellKey(frame.current) === current ? frame.phase : visited.has(current) ? "visited" : queued.has(current) ? "queued" : "unvisited";
                return <div className={classes} key={current}><strong>{height}</strong><span>({rowIndex}, {colIndex})</span><em>{label}</em></div>;
              }))}
            </div></div>
            <section className="swim-heap-panel" aria-label="Min heap">
              <div className="compact-heading"><h3>heap</h3><span>(time, row, col)</span></div>
              <div className="swim-heap-items">{frame.heap.length ? frame.heap.slice(0, 16).map(([time, row, col], index) => <span className={index === 0 ? "is-top" : ""} key={`${time}-${row}-${col}-${index}`}>({time}, {row}, {col})</span>) : <p className="heap-empty">empty</p>}</div>
            </section>
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>variables</h3><div className="token-list"><span>time = {frame.time ?? "-"}</span><span>r, c = {frame.current ? `(${frame.current.join(", ")})` : "-"}</span><span>new_time = {frame.newTime ?? "-"}</span></div></div>
          <div className="state-block"><h3>visited</h3><div className="token-list">{frame.visited.length ? frame.visited.map(([row, col]) => <span key={`${row}-${col}`}>({row}, {col})</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>heap top</h3><div className="token-list">{frame.heap[0] ? <span>({frame.heap[0].join(", ")})</span> : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function isValidGrid(value: unknown): value is number[][] {
  return Array.isArray(value) && value.length >= 2 && value.length <= 5 && value.every((row) => Array.isArray(row) && row.length === value.length && row.every((height) => Number.isInteger(height) && height >= 0 && height <= 99));
}

function copyGrid(grid: number[][]) {
  return grid.map((row) => [...row]);
}
