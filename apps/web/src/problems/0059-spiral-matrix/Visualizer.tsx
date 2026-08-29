import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { Cell, VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type SpiralMatrixInput } from "./data";
import { createSpiralMatrixDryRun } from "./dryRun";

export default function SpiralMatrixVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<SpiralMatrixInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createSpiralMatrixDryRun(input.matrix), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selectedExample = examples.find((example) => example.id === exampleId);
  const visitIndex = new Map(frame.order.map(([row, col], index) => [row + ":" + col, index + 1]));
  const sameCell = (left: Cell | null, right: Cell) => left !== null && left[0] === right[0] && left[1] === right[1];

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 480);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function load(example: (typeof examples)[number]) { setExampleId(example.id); setInput(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() {
    try {
      const candidate = JSON.parse(text) as SpiralMatrixInput;
      const width = candidate?.matrix?.[0]?.length;
      if (!candidate || !Array.isArray(candidate.matrix) || !candidate.matrix.length || !width || !candidate.matrix.every((row) => Array.isArray(row) && row.length === width && row.every(Number.isFinite))) throw new Error();
      setInput(candidate); setExampleId(0); setStep(0); setPlaying(false); setError("");
    } catch { setError('Use a rectangular numeric matrix such as {"matrix":[[1,2,3],[4,5,6],[7,8,9]]}.'); }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load matrix</button></div><div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{JSON.stringify(frame.result ?? selectedExample?.output ?? "pending")}</code></div></aside><section className="flow-panel spiral-flow-panel"><div className="panel-heading"><h2>Clockwise Boundary Walk</h2><span>{frame.direction ?? "ready"}</span></div><div className="spiral-stage"><div className="spiral-grid" style={{ gridTemplateColumns: "repeat(" + input.matrix[0]!.length + ", minmax(0, 1fr))" }}>{input.matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => { const sequence = visitIndex.get(rowIndex + ":" + colIndex); const inBounds = rowIndex >= frame.top && rowIndex <= frame.bottom && colIndex >= frame.left && colIndex <= frame.right; return <div className={["spiral-cell", sequence ? "is-visited" : "", inBounds ? "is-unvisited" : "", sameCell(frame.current, [rowIndex, colIndex]) ? "is-current" : ""].filter(Boolean).join(" ")} key={rowIndex + "-" + colIndex}><span>{sequence ?? ""}</span><strong>{value}</strong><em>{rowIndex},{colIndex}</em></div>; }))}</div><div className="spiral-boundaries"><span>top = {frame.top}</span><span>right = {frame.right}</span><span>bottom = {frame.bottom}</span><span>left = {frame.left}</span></div><div className="spiral-output"><span>result</span><strong>{frame.order.length ? "[" + frame.order.map(([row, col]) => input.matrix[row]![col]).join(", ") + "]" : "[]"}</strong></div><div className="product-phase"><span>current action</span><strong>{frame.title}</strong><p>{frame.detail}</p></div></div></section><aside className="state-panel"><div className="state-sticky"><div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>boundaries</h3><div className="token-list"><span>top = {frame.top}</span><span>right = {frame.right}</span><span>bottom = {frame.bottom}</span><span>left = {frame.left}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}
