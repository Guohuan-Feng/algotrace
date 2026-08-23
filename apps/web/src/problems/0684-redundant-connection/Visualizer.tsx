import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { RedundantConnectionExample } from "./data";
import { createRedundantConnectionDryRun } from "./dryRun";

export default function RedundantConnectionVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [edges, setEdges] = useState<number[][]>(defaultExample.edges.map((edge) => [...edge]));
  const [edgesInput, setEdgesInput] = useState(JSON.stringify(defaultExample.edges));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createRedundantConnectionDryRun(edges), [edges]);
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

  function loadExample(example: RedundantConnectionExample) {
    setSelectedExampleId(example.id);
    setEdges(example.edges.map((edge) => [...edge]));
    setEdgesInput(JSON.stringify(example.edges));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(edgesInput);
      if (!isValidEdgeList(parsed)) {
        setError("Use 3-10 edges with labels from 1 through the edge count.");
        return;
      }
      setSelectedExampleId(0);
      setEdges(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[1,2],[1,3],[2,3]].");
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
          <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>n = {edges.length}</span></div>
          <div className="input-grid">
            <label>edges JSON<textarea value={edgesInput} onChange={(event) => setEdgesInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load edges</button>
          </div>
          <div className="graph-legend"><span>white pending</span><span>yellow current edge</span><span>green merged</span><span>red redundant</span><span>blue compressed parent</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? "pending")}</code></div>
        </aside>

        <section className="flow-panel redundant-flow-panel">
          <div className="panel-heading"><h2>Union-Find</h2><span>edge {frame.edgeIndex === null ? "-" : frame.edgeIndex + 1} / {frame.edges.length}</span></div>
          <div className="redundant-stage">
            <div className="redundant-graph" aria-label="Undirected graph with Union-Find edge states">
              <svg aria-hidden="true" className="redundant-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
                {frame.edges.map(([left, right], index) => {
                  const from = nodePosition(left, frame.n);
                  const to = nodePosition(right, frame.n);
                  const accepted = index < frame.acceptedEdges.length;
                  const redundant = frame.edgeIndex === index && frame.redundantEdge !== null;
                  const current = frame.edgeIndex === index && !accepted && !redundant;
                  return <line className={["redundant-edge", current ? "is-current" : "", accepted ? "is-accepted" : "", redundant ? "is-redundant" : ""].filter(Boolean).join(" ")} key={`${left}-${right}-${index}`} x1={from.x} x2={to.x} y1={from.y} y2={to.y} />;
                })}
              </svg>
              {Array.from({ length: frame.n }, (_, index) => index + 1).map((node) => {
                const position = nodePosition(node, frame.n);
                const current = frame.currentFind === node;
                const endpoint = frame.currentEdge?.includes(node) ?? false;
                const compressed = frame.compressingNode === node;
                return <div className={["redundant-node", endpoint ? "is-endpoint" : "", compressed ? "is-compressed" : "", current ? "is-current" : ""].filter(Boolean).join(" ")} key={node} style={{ left: `${position.x}%`, top: `${position.y}%` }}><strong>{node}</strong><span>{current ? `find(${node})` : frame.parent[node] === node ? "root" : `parent ${frame.parent[node]}`}</span></div>;
              })}
            </div>
            <section className="parent-panel" aria-label="Parent array">
              <div className="parent-panel-heading"><h3>parent[x]</h3><span>index - parent</span></div>
              <div className="parent-grid">{frame.parent.map((parentValue, node) => <div className={["parent-cell", node === 0 ? "is-zero" : "", frame.currentFind === node ? "is-current" : "", frame.compressingNode === node ? "is-compressed" : ""].filter(Boolean).join(" ")} key={node}><span>{node}</span><strong>{parentValue}</strong><em>{node === 0 ? "unused" : parentValue === node ? "root" : `to ${parentValue}`}</em></div>)}</div>
            </section>
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>edge</h3><div className="token-list">{frame.currentEdge ? <span>[{frame.currentEdge[0]}, {frame.currentEdge[1]}]</span> : <em>waiting</em>}</div></div>
          <div className="state-block"><h3>roots</h3><div className="token-list"><span>pa = {frame.pa ?? "pending"}</span><span>pb = {frame.pb ?? "pending"}</span></div></div>
          <div className="state-block"><h3>find stack</h3><div className="token-list">{frame.findStack.length ? frame.findStack.map((node, index) => <span key={`${node}-${index}`}>find({node})</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>parent</h3><pre className="matrix-state">[{frame.parent.join(", ")}]</pre></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function isValidEdgeList(value: unknown): value is number[][] {
  return Array.isArray(value) && value.length >= 3 && value.length <= 10 && value.every((edge) => Array.isArray(edge) && edge.length === 2 && edge.every((node) => Number.isInteger(node) && node >= 1 && node <= value.length));
}

function nodePosition(node: number, total: number) {
  if (total === 1) return { x: 50, y: 50 };
  const angle = -Math.PI / 2 + ((node - 1) * Math.PI * 2) / total;
  return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
}
