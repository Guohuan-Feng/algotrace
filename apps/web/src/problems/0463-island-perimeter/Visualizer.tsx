import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { Cell, VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type IslandPerimeterInput } from "./data";
import { createIslandPerimeterDryRun } from "./dryRun";

const cellKey = (cell: Cell | null) => cell ? `${cell[0]}-${cell[1]}` : "";

export default function IslandPerimeterVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<IslandPerimeterInput>(defaultExample.input);
  const [gridInput, setGridInput] = useState(JSON.stringify(defaultExample.input.grid));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createIslandPerimeterDryRun(input.grid), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const cols = input.grid[0]?.length ?? 1;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 510); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setGridInput(JSON.stringify(example.input.grid)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const grid = JSON.parse(gridInput) as number[][]; if (!isBinaryGrid(grid)) throw new Error(); setSelectedExampleId(0); setInput({ grid }); setStep(0); setPlaying(false); setError(""); } catch { setError("Use a rectangular 0 / 1 grid up to 8 x 13."); } }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>grid</h2><span>{input.grid.length} x {cols}</span></div><div className="input-grid"><label>grid JSON<textarea value={gridInput} onChange={(event) => setGridInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load grid</button></div><div className="grid-legend"><span><i className="legend-square land" />unvisited land</span><span><i className="legend-square explored" />visited land</span><span><i className="legend-square water" />water</span></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel grid-traversal-flow-panel"><div className="panel-heading"><h2>DFS Edge Contributions</h2><span>perimeter = {frame.perimeter}</span></div><div className="grid-traversal-wrap"><div className="grid-traversal-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>{frame.grid.flatMap((row, i) => row.map((value, j) => { const originalLand = input.grid[i]![j] === 1; const cell: Cell = [i, j]; const classes = ["grid-traversal-cell", "island-cell", originalLand ? (value === 1 ? "is-land" : "is-explored") : "is-water", cellKey(frame.current) === cellKey(cell) ? "is-current" : "", cellKey(frame.target) === cellKey(cell) ? "is-target" : ""].filter(Boolean).join(" "); return <div className={classes} key={`${i}-${j}`}><strong>{value}</strong><span>({i}, {j})</span></div>; }))}</div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>DFS return total</h3><div className="token-list"><span>perimeter = {frame.perimeter}</span></div></div><div className="state-block"><h3>DFS stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map(([i, j], index) => <span key={`${i}-${j}-${index}`}>dfs({i}, {j})</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function isBinaryGrid(value: unknown): value is number[][] { return Array.isArray(value) && value.length >= 1 && value.length <= 8 && value.every((row) => Array.isArray(row) && row.length >= 1 && row.length <= 13 && row.length === value[0]?.length && row.every((cell) => cell === 0 || cell === 1)); }
