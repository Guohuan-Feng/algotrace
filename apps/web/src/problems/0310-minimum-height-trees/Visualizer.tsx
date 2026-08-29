import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MinimumHeightTreesInput } from "./data";
import { createMinimumHeightTreesDryRun } from "./dryRun";

export default function MinimumHeightTreesVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<MinimumHeightTreesInput>(defaultExample.input);
  const [nInput, setNInput] = useState(String(defaultExample.input.n));
  const [edgesInput, setEdgesInput] = useState(JSON.stringify(defaultExample.input.edges));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createMinimumHeightTreesDryRun(input.n, input.edges), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: (typeof examples)[number]) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setNInput(String(example.input.n));
    setEdgesInput(JSON.stringify(example.input.edges));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const n = Number(nInput);
      const edges = JSON.parse(edgesInput) as number[][];
      if (!Number.isInteger(n) || n < 1 || n > 10 || !Array.isArray(edges) || edges.length > 12 || !edges.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every((node) => Number.isInteger(node) && node >= 0 && node < n))) throw new Error();
      setSelectedExampleId(0);
      setInput({ n, edges });
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use n 1-10 and edges such as [[1,0],[1,2],[1,3]].");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>nodes = {input.n}</span></div><div className="input-grid"><label>n<input value={nInput} onChange={(event) => setNInput(event.target.value)} /></label><label>edges JSON<textarea value={edgesInput} onChange={(event) => setEdgesInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load tree</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
      <section className="flow-panel course-flow-panel"><div className="panel-heading"><h2>Leaf-Trimming BFS</h2><span>remaining = {frame.remaining}</span></div><div className="course-stage"><div className="course-graph">{Array.from({ length: input.n }, (_, node) => <div className={["course-node", frame.queue.includes(node) ? "is-leaf" : "", frame.current === node ? "is-current" : "", frame.neighbor === node ? "is-target" : ""].filter(Boolean).join(" ")} key={node}><strong>{node}</strong><span>degree = {frame.degree[node]}</span></div>)}</div><section className="edge-panel"><h3>graph[node] - neighbors</h3><div className="edge-list">{frame.graph.map((neighbors, node) => <div className="edge-row" key={node}><strong>{node}</strong><span>{neighbors.length ? neighbors.join(", ") : "[]"}</span></div>)}</div></section></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>leaf queue</h3><div className="token-list">{frame.queue.length ? frame.queue.map((node, index) => <span key={`${node}-${index}`}>{node}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>degree</h3><pre className="matrix-state">{JSON.stringify(frame.degree)}</pre></div><div className="state-block"><h3>remaining</h3><div className="token-list"><span>{frame.remaining}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}
