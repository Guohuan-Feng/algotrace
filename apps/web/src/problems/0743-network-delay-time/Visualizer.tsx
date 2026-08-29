import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type NetworkDelayInput } from "./data";
import { createNetworkDelayDryRun } from "./dryRun";

export default function NetworkDelayVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<NetworkDelayInput>(defaultExample.input);
  const [timesInput, setTimesInput] = useState(JSON.stringify(defaultExample.input.times));
  const [nInput, setNInput] = useState(String(defaultExample.input.n));
  const [kInput, setKInput] = useState(String(defaultExample.input.k));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createNetworkDelayDryRun(input.times, input.n, input.k), [input]);
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
    setTimesInput(JSON.stringify(example.input.times));
    setNInput(String(example.input.n));
    setKInput(String(example.input.k));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const times = JSON.parse(timesInput) as number[][];
      const n = Number(nInput);
      const k = Number(kInput);
      if (!Number.isInteger(n) || n < 1 || n > 10 || !Number.isInteger(k) || k < 1 || k > n || !Array.isArray(times) || times.length > 24 || !times.every((edge) => Array.isArray(edge) && edge.length === 3 && edge.every(Number.isInteger) && edge[0] >= 1 && edge[0] <= n && edge[1] >= 1 && edge[1] <= n && edge[2] >= 0)) throw new Error();
      setSelectedExampleId(0);
      setInput({ times, n, k });
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use n 1-10, a start node, and edges such as [[2,1,1],[2,3,1]].");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>start = {input.k}</span></div><div className="input-grid"><label>times JSON<textarea value={timesInput} onChange={(event) => setTimesInput(event.target.value)} /></label><label>n<input value={nInput} onChange={(event) => setNInput(event.target.value)} /></label><label>k<input value={kInput} onChange={(event) => setKInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load network</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div></aside>
      <section className="flow-panel course-flow-panel"><div className="panel-heading"><h2>Dijkstra Signal Paths</h2><span>{frame.result === null ? "in progress" : `delay = ${frame.result}`}</span></div><div className="course-stage"><div className="course-graph">{Array.from({ length: input.n }, (_, offset) => { const node = offset + 1; const distance = frame.dist[node]!; return <div className={["course-node", frame.settled.includes(node) ? "is-done" : "", frame.current === node ? "is-current" : "", frame.neighbor === node ? "is-target" : ""].filter(Boolean).join(" ")} key={node}><strong>{node}</strong><span>d = {Number.isFinite(distance) ? distance : "inf"}</span></div>; })}</div><section className="edge-panel"><h3>graph[node] - (neighbor, weight)</h3><div className="edge-list">{frame.graph.slice(1).map((neighbors, offset) => <div className="edge-row" key={offset + 1}><strong>{offset + 1}</strong><span>{neighbors.length ? neighbors.map(([node, weight]) => `(${node},${weight})`).join(" ") : "[]"}</span></div>)}</div></section></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>min heap</h3><div className="token-list">{frame.heap.length ? frame.heap.map(([distance, node], index) => <span key={`${distance}-${node}-${index}`}>({distance},{node})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>dist</h3><pre className="matrix-state">{JSON.stringify(frame.dist.map((distance) => Number.isFinite(distance) ? distance : "inf"))}</pre></div><div className="state-block"><h3>settled nodes</h3><div className="token-list">{frame.settled.length ? frame.settled.map((node) => <span key={node}>{node}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}
