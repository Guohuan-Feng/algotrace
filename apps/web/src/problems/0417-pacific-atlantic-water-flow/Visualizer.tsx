import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { Cell, VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { PacificAtlanticExample } from "./data";
import { createPacificAtlanticDryRun } from "./dryRun";

const cellKey = (cell: Cell | null) => (cell ? `${cell[0]}-${cell[1]}` : "");

export default function PacificAtlanticVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [heights, setHeights] = useState(defaultExample.heights);
  const [heightsInput, setHeightsInput] = useState(JSON.stringify(defaultExample.heights));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createPacificAtlanticDryRun(heights), [heights]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const cols = heights[0]?.length ?? 1;

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: PacificAtlanticExample) {
    setSelectedExampleId(example.id);
    setHeights(example.heights);
    setHeightsInput(JSON.stringify(example.heights));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(heightsInput);
      if (!isHeightGrid(parsed)) {
        setError("Use a rectangular integer matrix from 1 x 1 to 5 x 5.");
        return;
      }
      setSelectedExampleId(0);
      setHeights(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[1,2],[4,3]].");
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
          <div className="panel-heading"><h2>heights</h2><span>{heights.length} x {cols}</span></div>
          <div className="input-grid"><label>heights JSON<textarea value={heightsInput} onChange={(event) => setHeightsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load heights</button></div>
          <div className="grid-legend" aria-label="ocean legend"><span><i className="legend-square pacific" />Pacific</span><span><i className="legend-square atlantic" />Atlantic</span><span><i className="legend-square both" />both</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current answer"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? frame.answer)}</code></div>
        </aside>
        <section className="flow-panel grid-traversal-flow-panel">
          <div className="panel-heading"><h2>Reverse-flow DFS</h2><span>{frame.phase}</span></div>
          <div className="grid-traversal-wrap">
            <div className="grid-traversal-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {heights.flatMap((row, i) => row.map((height, j) => {
                const key = `${i}-${j}`;
                const reachabilityClass = frame.pacific[i][j] && frame.atlantic[i][j] ? "is-both-oceans" : frame.pacific[i][j] ? "is-pacific" : frame.atlantic[i][j] ? "is-atlantic" : "";
                const className = ["grid-traversal-cell", "ocean-cell", reachabilityClass, cellKey(frame.current) === key ? "is-current" : "", cellKey(frame.target) === key ? "is-target" : ""].filter(Boolean).join(" ");
                return <div className={className} key={key}><strong>{height}</strong><span>({i}, {j})</span></div>;
              }))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>DFS variables</h3><div className="token-list"><span>i, j = {formatCell(frame.current)}</span><span>ni, nj = {formatCell(frame.target)}</span></div></div>
          <div className="state-block"><h3>recursion stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map(([i, j], index) => <span key={`${i}-${j}-${index}`}>({i}, {j})</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>ans</h3><div className="token-list">{frame.answer.length ? frame.answer.map(([i, j]) => <span key={`${i}-${j}`}>[{i}, {j}]</span>) : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function isHeightGrid(value: unknown): value is number[][] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 5 && value.every((row) => Array.isArray(row) && row.length >= 1 && row.length <= 5 && row.length === value[0]?.length && row.every(Number.isInteger));
}

function formatCell(cell: Cell | null) {
  return cell ? `(${cell[0]}, ${cell[1]})` : "none";
}
