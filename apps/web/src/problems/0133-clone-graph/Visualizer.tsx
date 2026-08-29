import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type CloneGraphInput } from "./data";
import { createCloneGraphDryRun } from "./dryRun";

export default function CloneGraphVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<CloneGraphInput>(defaultExample.input);
  const [adjListInput, setAdjListInput] = useState(JSON.stringify(defaultExample.input.adjList));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createCloneGraphDryRun(input.adjList), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const nodes = Array.from({ length: input.adjList.length }, (_, index) => index + 1);

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setAdjListInput(JSON.stringify(example.input.adjList)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() {
    try {
      const adjList = JSON.parse(adjListInput) as number[][];
      if (!Array.isArray(adjList) || adjList.length > 8 || !adjList.every((neighbors) => Array.isArray(neighbors) && neighbors.every((node) => Number.isInteger(node) && node >= 1 && node <= adjList.length))) throw new Error();
      setSelectedExampleId(0); setInput({ adjList }); setStep(0); setPlaying(false); setError("");
    } catch { setError("Use an adjacency list such as [[2,4],[1,3],[2,4],[1,3]]."); }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>adjList</h2><span>{nodes.length} nodes</span></div><div className="input-grid"><label>adjList JSON<textarea value={adjListInput} onChange={(event) => setAdjListInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load graph</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Clone adjacency"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
      <section className="flow-panel clone-flow-panel"><div className="panel-heading"><h2>DFS Clone Map</h2><span>{frame.current ? `dfs(${frame.current})` : "ready"}</span></div><div className="clone-stage"><div className="clone-canvas"><svg aria-hidden="true" className="query-edges" viewBox="0 0 100 100" preserveAspectRatio="none">{frame.adjacency.flatMap((neighbors, offset) => neighbors.filter((neighbor) => offset + 1 <= neighbor).map((neighbor) => { const from = positionOf(offset, nodes.length); const to = positionOf(neighbor - 1, nodes.length); const active = frame.current === offset + 1 && frame.neighbor === neighbor; return <line className={active ? "query-edge is-active" : "query-edge"} key={`${offset + 1}-${neighbor}`} x1={from.x} x2={to.x} y1={from.y} y2={to.y} />; }))}</svg>{nodes.map((node, index) => { const position = positionOf(index, nodes.length); return <div className={["query-node", "clone-node", frame.cloneMap.includes(node) ? "is-visited" : "", frame.current === node ? "is-current" : "", frame.neighbor === node ? "is-target" : ""].filter(Boolean).join(" ")} key={node} style={{ left: `${position.x}%`, top: `${position.y}%` }}><strong>{node}</strong><span>{frame.cloneMap.includes(node) ? "mapped" : "original"}</span></div>; })}</div><div className="clone-map-panel"><h3>visited: original -&gt; copy</h3><div>{nodes.length ? nodes.map((node) => <span className={frame.cloneMap.includes(node) ? "is-mapped" : ""} key={node}>{node} -&gt; {frame.cloneMap.includes(node) ? node : "?"}</span>) : <em>empty graph</em>}</div></div></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>recursion stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((node, index) => <span key={`${node}-${index}`}>dfs({node})</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>clone adjacency</h3><pre className="matrix-state">{JSON.stringify(frame.cloneAdjacency)}</pre></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function positionOf(index: number, total: number) { if (total <= 1) return { x: 50, y: 50 }; const angle = -Math.PI / 2 + (index * Math.PI * 2) / total; return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 }; }
