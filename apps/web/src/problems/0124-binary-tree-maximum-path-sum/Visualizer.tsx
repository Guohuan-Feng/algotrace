import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import { flattenTree } from "../0094-binary-tree-inorder-traversal/dryRun";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MaximumPathSumExample } from "./data";
import { createMaximumPathSumDryRun } from "./dryRun";

export default function MaximumPathSumVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [values, setValues] = useState(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createMaximumPathSumDryRun(values), [values]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const tree = useMemo(() => flattenTree(values), [values]);
  const selected = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  const nodes = useMemo<Node[]>(() => tree.map((node) => ({
    id: node.id,
    position: positionFor(node.layoutIndex),
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    className: ["combo-node", "bst-node", frame.activeId === node.id ? "is-active" : frame.bestPathIds.includes(node.id) ? "is-path" : frame.gains[node.id] !== undefined ? "is-complete" : ""].filter(Boolean).join(" "),
    data: { label: <div className="combo-node-content"><strong>{node.value}</strong><span>{frame.activeId === node.id ? "current" : frame.bestPathIds.includes(node.id) ? "max path" : frame.gains[node.id] !== undefined ? `gain ${frame.gains[node.id]}` : `node ${node.index}`}</span></div> },
  })), [frame.activeId, frame.bestPathIds, frame.gains, tree]);
  const edges = useMemo<Edge[]>(() => tree.filter((node) => node.parentId).map((node) => ({
    id: `${node.parentId}-${node.id}`,
    source: node.parentId!,
    target: node.id,
    type: "straight",
    label: node.side,
    labelBgBorderRadius: 6,
    labelBgPadding: [6, 3],
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: frame.activeId === node.id,
    style: { stroke: frame.bestPathIds.includes(node.parentId!) && frame.bestPathIds.includes(node.id) ? "#268366" : "#52728e", strokeWidth: frame.bestPathIds.includes(node.parentId!) && frame.bestPathIds.includes(node.id) ? 2.4 : 1.5 },
  })), [frame.activeId, frame.bestPathIds, tree]);

  function load(example: MaximumPathSumExample) {
    setExampleId(example.id);
    setValues(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length > 31 || !parsed.every((item) => item === null || (typeof item === "number" && Number.isFinite(item)))) throw new Error();
      setExampleId(0);
      setValues(parsed as Array<number | null>);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use level-order JSON such as [-10,9,20,null,null,15,7].");
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>root JSON<textarea aria-label="tree input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load tree</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{String(frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel combo-flow-panel"><div className="panel-heading"><h2>Postorder path gains</h2><span>yellow: current, green: best path</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 440, y: 52, zoom: 0.88 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]}><Background gap={22} size={1} /><Controls /></ReactFlow></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>path calculation</h3><div className="token-list"><span>left gain = {frame.leftGain ?? "-"}</span><span>right gain = {frame.rightGain ?? "-"}</span><span>through = {frame.throughSum ?? "-"}</span><span>max sum = {frame.maxSum ?? "-"}</span><span>best = [{frame.bestPathValues.join(", ")}]</span></div></div><div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((entry, index) => <span key={`${entry}-${index}`}>{entry}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function positionFor(layoutIndex: number): { x: number; y: number } { const depth = Math.floor(Math.log2(layoutIndex + 1)); const first = 2 ** depth - 1; const spacing = 180 / (2 ** Math.max(depth - 1, 0)); return { x: (layoutIndex - first - (2 ** depth - 1) / 2) * spacing, y: depth * 132 }; }
