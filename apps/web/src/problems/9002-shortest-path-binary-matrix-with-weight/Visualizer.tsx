import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { Cell, VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { WeightedGridExample } from "./data";
import { createWeightedGridDryRun } from "./dryRun";

const key = (cell: Cell | null) => (cell ? `${cell[0]}-${cell[1]}` : "");
const format = (v: number) => (Number.isFinite(v) ? String(v) : "inf");

export default function WeightedBinaryMatrixVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [grid, setGrid] = useState(defaultExample.grid);
  const [gridInput, setGridInput] = useState(JSON.stringify(defaultExample.grid));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createWeightedGridDryRun(grid), [grid]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) { setPlaying(false); return; }
    const id = window.setTimeout(() => setStep((s) => s + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: WeightedGridExample) {
    setSelectedExampleId(example.id); setGrid(example.grid); setGridInput(JSON.stringify(example.grid)); setStep(0); setPlaying(false); setError("");
  }
  function loadInput() {
    try {
      const parsed = JSON.parse(gridInput);
      if (!Array.isArray(parsed) || parsed.length < 2 || parsed.length > 5 || parsed.some((row) => !Array.isArray(row) || row.length !== parsed.length || row.some((v) => !Number.isInteger(v)))) {
        setError("Use a square integer matrix 2x2 to 5x5. Obstacles are -1.");
        return;
      }
      setSelectedExampleId(0); setGrid(parsed); setStep(0); setPlaying(false); setError("");
    } catch { setError("Use valid JSON, for example [[1,2],[3,4]]."); }
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div><button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher"><span>Examples</span><div>{examples.map((e) => <button className={selectedExampleId === e.id ? "active" : ""} key={e.id} onClick={() => loadExample(e)}>{e.id}</button>)}</div></div>
          <div className="panel-heading"><h2>grid</h2><span>{grid.length} x {grid.length}</span></div>
          <div className="input-grid"><label>grid JSON<textarea value={gridInput} onChange={(event) => setGridInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput}><Upload size={16} />Load grid</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel word-search-panel">
          <div className="panel-heading"><h2>Dijkstra Grid</h2><span>result: {frame.result ?? "pending"}</span></div>
          <div className="word-board-wrap">
            <div className="word-board" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
              {grid.flatMap((row, r) => row.map((value, c) => {
                const k = `${r}-${c}`;
                return <div className={["cell", value === -1 ? "blocked" : "", key(frame.current) === k ? "current" : "", key(frame.target) === k ? "target" : "", key(frame.updated) === k ? "visited" : ""].filter(Boolean).join(" ")} key={k}><strong>{value === -1 ? "X" : value}</strong><span>d={format(frame.dist[r][c])}</span></div>;
              }))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>heap</h3><div className="token-list">{frame.heap.length ? frame.heap.slice(0, 12).map(([cost, r, c], i) => <span key={`${cost}-${r}-${c}-${i}`}>({cost},{r},{c})</span>) : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
