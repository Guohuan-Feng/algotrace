import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { ConnectedComponentsExample } from "./data";
import { createConnectedComponentsDryRun } from "./dryRun";

export default function ConnectedComponentsVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [n, setN] = useState(defaultExample.n);
  const [edges, setEdges] = useState(defaultExample.edges);
  const [nInput, setNInput] = useState(String(defaultExample.n));
  const [edgesInput, setEdgesInput] = useState(JSON.stringify(defaultExample.edges));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createConnectedComponentsDryRun(n, edges), [edges, n]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: ConnectedComponentsExample) {
    setSelectedExampleId(example.id);
    setN(example.n);
    setEdges(example.edges);
    setNInput(String(example.n));
    setEdgesInput(JSON.stringify(example.edges));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedN = Number(nInput);
      const parsedEdges = JSON.parse(edgesInput);
      const valid = Number.isInteger(parsedN) && parsedN >= 1 && parsedN <= 10 && Array.isArray(parsedEdges) && parsedEdges.length <= 14 && parsedEdges.every((edge) => Array.isArray(edge) && edge.length === 2 && edge.every((node) => Number.isInteger(node) && node >= 0 && node < parsedN));
      if (!valid) {
        setError("Use n from 1-10 and edges like [[0,1],[1,2]].");
        return;
      }
      setSelectedExampleId(0);
      setN(parsedN);
      setEdges(parsedEdges);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[0,1],[1,2]].");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel">
        <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
        <div className="panel-heading"><h2>input</h2><span>nodes = {n}</span></div>
        <div className="input-grid"><label>n<input value={nInput} onChange={(event) => setNInput(event.target.value)} /></label><label>edges JSON<textarea value={edgesInput} onChange={(event) => setEdgesInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load graph</button></div>
        <div className="graph-legend"><span>white unvisited</span><span>yellow current DFS</span><span>green visited</span></div>
        <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div>
      </aside>
      <section className="flow-panel components-flow-panel">
        <div className="panel-heading"><h2>DFS components</h2><span>count = {frame.count}</span></div>
        <div className="components-stage">
          <div className="components-graph" aria-label="Connected component graph">
            <svg aria-hidden="true" className="components-edges" viewBox="0 0 100 100" preserveAspectRatio="none">{frame.edges.map(([left, right], index) => { const from = nodePosition(left, frame.n); const to = nodePosition(right, frame.n); const active = (frame.current === left && frame.target === right) || (frame.current === right && frame.target === left); return <line className={active ? "components-edge is-active" : "components-edge"} key={`${left}-${right}-${index}`} x1={from.x} x2={to.x} y1={from.y} y2={to.y} />; })}</svg>
            {Array.from({ length: frame.n }, (_, node) => { const position = nodePosition(node, frame.n); const visited = frame.visited.includes(node); const current = frame.current === node; const target = frame.target === node; return <div className={["components-node", visited ? "is-visited" : "", current ? "is-current" : "", target ? "is-target" : ""].filter(Boolean).join(" ")} key={node} style={{ left: `${position.x}%`, top: `${position.y}%` }}><strong>{node}</strong><span>{current ? `component ${frame.activeComponent ?? "?"}` : visited ? "visited" : "unvisited"}</span></div>; })}
          </div>
          <section className="edge-panel"><h3>graph[node] - neighbors</h3><div className="edge-list">{frame.graph.map((neighbors, node) => <div className="edge-row" key={node}><strong>{node}</strong><span>{neighbors.length ? neighbors.join(", ") : "[]"}</span></div>)}</div></section>
        </div>
      </section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>component count</h3><div className="component-count">{frame.count}</div></div><div className="state-block"><h3>dfs stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((node, index) => <span key={`${node}-${index}`}>dfs({node})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>visited</h3><div className="token-list words">{frame.visited.length ? frame.visited.map((node) => <span key={node}>{node}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function nodePosition(node: number, total: number) {
  if (total === 1) return { x: 50, y: 50 };
  const angle = -Math.PI / 2 + (node * Math.PI * 2) / total;
  return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
}
