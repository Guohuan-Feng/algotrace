import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import { flattenTree } from "../0094-binary-tree-inorder-traversal/dryRun";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type NextPointerExample } from "./data";
import { createConnectNextPointersDryRun } from "./dryRun";

export default function NextPointerVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [values, setValues] = useState(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createConnectNextPointersDryRun(values), [values]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const tree = useMemo(() => flattenTree(values), [values]);
  const selected = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) { if (step >= run.frames.length - 1) setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  const nodes = useMemo<Node[]>(() => tree.map((node) => ({
    id: node.id,
    position: nodePosition(node.layoutIndex),
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    className: ["combo-node", "bst-node", frame.activeId === node.id ? "is-active" : frame.targetId === node.id ? "is-pointer-change" : frame.processedIds.includes(node.id) ? "is-complete" : ""].filter(Boolean).join(" "),
    data: { label: <div className="combo-node-content"><strong>{node.value}</strong><span>{frame.activeId === node.id ? "current" : frame.targetId === node.id ? "next target" : frame.processedIds.includes(node.id) ? "visited" : `node ${node.index}`}</span></div> },
  })), [frame.activeId, frame.processedIds, frame.targetId, tree]);

  const edges = useMemo<Edge[]>(() => {
    const result: Edge[] = tree.filter((node) => node.parentId).map((node) => ({
      id: `tree-${node.parentId}-${node.id}`,
      source: node.parentId!, target: node.id, type: "straight", label: node.side,
      labelBgBorderRadius: 6, labelBgPadding: [6, 3], markerEnd: { type: MarkerType.ArrowClosed },
    }));
    for (const [source, target] of Object.entries(frame.nextLinks)) {
      if (!target) continue;
      result.push({
        id: `next-${source}-${target}`,
        source, target, type: "smoothstep", label: "next", labelBgBorderRadius: 6, labelBgPadding: [6, 3],
        markerEnd: { type: MarkerType.ArrowClosed }, animated: frame.activeId === source,
        style: { stroke: "#168b5b", strokeWidth: 2.5 },
      });
    }
    return result;
  }, [frame.activeId, frame.nextLinks, tree]);

  function load(example: NextPointerExample) { setExampleId(example.id); setValues(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length > 31 || !parsed.every((value) => value === null || (typeof value === "number" && Number.isFinite(value)))) throw new Error();
      setExampleId(0); setValues(parsed as Array<number | null>); setStep(0); setPlaying(false); setError("");
    } catch { setError("Use level-order JSON such as [1,2,3,4,5,null,7]."); }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>root JSON<textarea aria-label="tree input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load tree</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{JSON.stringify(frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel combo-flow-panel"><div className="panel-heading"><h2>Tree + next pointers</h2><span>green: next pointer</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 440, y: 52, zoom: 0.88 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]}><Background gap={22} size={1} /><Controls /></ReactFlow></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>queue</h3><div className="token-list">{frame.queue.length ? frame.queue.map((value, index) => <span key={`${value}-${index}`}>{value}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>current level</h3><div className="token-list">{frame.currentLevel.length ? frame.currentLevel.map((value, index) => <span key={`${value}-${index}`}>{value}</span>) : <em>not started</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function nodePosition(layoutIndex: number): { x: number; y: number } {
  const depth = Math.floor(Math.log2(layoutIndex + 1));
  const first = 2 ** depth - 1;
  const spacing = 180 / (2 ** Math.max(depth - 1, 0));
  return { x: (layoutIndex - first - (2 ** depth - 1) / 2) * spacing, y: depth * 132 };
}
