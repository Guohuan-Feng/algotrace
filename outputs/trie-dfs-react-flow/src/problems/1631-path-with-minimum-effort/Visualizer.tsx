import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { Cell, VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { MinimumEffortExample } from "./data";
import { createMinimumEffortDryRun } from "./dryRun";

const key = (cell: Cell | null) => (cell ? `${cell[0]}-${cell[1]}` : "");
const format = (v: number) => (Number.isFinite(v) ? String(v) : "inf");

export function MinimumEffortPathVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [heights, setHeights] = useState(defaultExample.heights);
  const [heightsInput, setHeightsInput] = useState(JSON.stringify(defaultExample.heights));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createMinimumEffortDryRun(heights), [heights]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) { setPlaying(false); return; }
    const id = window.setTimeout(() => setStep((s) => s + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: MinimumEffortExample) {
    setSelectedExampleId(example.id); setHeights(example.heights); setHeightsInput(JSON.stringify(example.heights)); setStep(0); setPlaying(false); setError("");
  }
  function loadInput() {
    try {
      const parsed = JSON.parse(heightsInput);
      if (!Array.isArray(parsed) || parsed.length < 2 || parsed.length > 5 || !Array.isArray(parsed[0]) || parsed[0].length < 2 || parsed[0].length > 5 || parsed.some((row) => !Array.isArray(row) || row.length !== parsed[0].length || row.some((v) => !Number.isInteger(v)))) {
        setError("Use an integer matrix from 2x2 to 5x5.");
        return;
      }
      setSelectedExampleId(0); setHeights(parsed); setStep(0); setPlaying(false); setError("");
    } catch { setError("Use valid JSON, for example [[1,2],[3,4]]."); }
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div><button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((e) => <button className={selectedExampleId === e.id ? "active" : ""} key={e.id} onClick={() => loadExample(e)}>{e.id}</button>)}</div></div>
          <div className="panel-heading"><h2>heights</h2><span>{heights.length} x {heights[0].length}</span></div>
          <div className="input-grid"><label>heights JSON<textarea value={heightsInput} onChange={(event) => setHeightsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput}><Upload size={16} />Load heights</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel word-search-panel">
          <div className="panel-heading"><h2>Minimum Effort Dijkstra</h2><span>result: {frame.result ?? "pending"}</span></div>
          <div className="word-board-wrap">
            <div className="word-board" style={{ gridTemplateColumns: `repeat(${heights[0].length}, minmax(0, 1fr))` }}>
              {heights.flatMap((row, r) => row.map((value, c) => {
                const k = `${r}-${c}`;
                return <div className={["cell", key(frame.current) === k ? "current" : "", key(frame.target) === k ? "target" : "", key(frame.updated) === k ? "visited" : ""].filter(Boolean).join(" ")} key={k}><strong>{value}</strong><span>e={format(frame.dist[r][c])}</span></div>;
              }))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>heap</h3><div className="token-list">{frame.heap.length ? frame.heap.slice(0, 12).map(([effort, r, c], i) => <span key={`${effort}-${r}-${c}-${i}`}>({effort},{r},{c})</span>) : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
