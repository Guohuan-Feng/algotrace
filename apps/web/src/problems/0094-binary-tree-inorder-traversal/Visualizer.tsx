import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node, ReactFlowInstance } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type InorderTraversalExample } from "./data";
import { createInorderTraversalDryRun, flattenTree } from "./dryRun";

export default function BinaryTreeInorderTraversalVisualizer({ onBack }: VisualizerProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [values, setValues] = useState(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createInorderTraversalDryRun(values), [values]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const treeNodes = useMemo(() => flattenTree(values), [values]);
  const selected = examples.find((example) => example.id === exampleId);

  const resetViewport = useCallback(() => {
    const width = panelRef.current?.clientWidth ?? 880;
    const depth = values.length > 15 ? 0.62 : 0.88;
    flowRef.current?.setViewport({ x: width / 2, y: 54, zoom: depth });
  }, [values.length]);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  useEffect(() => {
    const request = window.requestAnimationFrame(resetViewport);
    return () => window.cancelAnimationFrame(request);
  }, [resetViewport]);

  const nodes = useMemo<Node[]>(() => treeNodes.map((node) => ({
    id: node.id,
    position: treePosition(node.layoutIndex),
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    className: ["combo-node", "bst-node", frame.activeId === node.id ? "is-active" : "", frame.visitedIds.includes(node.id) ? "is-complete" : ""].filter(Boolean).join(" "),
    data: { label: <div className="combo-node-content"><strong>{node.value}</strong><span>{frame.activeId === node.id ? "current" : frame.visitedIds.includes(node.id) ? "in res" : `node ${node.index}`}</span></div> },
  })), [frame.activeId, frame.visitedIds, treeNodes]);

  const edges = useMemo<Edge[]>(() => treeNodes.filter((node) => node.parentId).map((node) => ({
    id: `${node.parentId}-${node.id}`,
    source: node.parentId!,
    target: node.id,
    type: "straight",
    label: node.side,
    labelBgBorderRadius: 6,
    labelBgPadding: [6, 3],
    labelBgStyle: { fill: "#f7f3ea", fillOpacity: 0.94 },
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: node.id === frame.activeId,
    className: node.id === frame.activeId ? "edge-path" : "",
  })), [frame.activeId, treeNodes]);

  function load(example: InorderTraversalExample) {
    setExampleId(example.id); setValues(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length > 31 || !parsed.every((value) => value === null || (typeof value === "number" && Number.isFinite(value)))) throw new Error();
      const normalized = parsed as Array<number | null>;
      setExampleId(0); setValues(normalized); setText(JSON.stringify(normalized)); setStep(0); setPlaying(false); setError("");
    } catch {
      setError("Use a level-order JSON array such as [1,null,2,3].");
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>Tree input</h2><span>level order</span></div><div className="input-grid"><label>root JSON<textarea aria-label="tree input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load tree</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current output"}</span><code>{JSON.stringify(frame.result)}</code></div><div className="state-block"><h3>Inorder rule</h3><div className="token-list"><span>1. left subtree</span><span>2. root</span><span>3. right subtree</span></div></div></aside><section className="flow-panel combo-flow-panel" ref={panelRef}><div className="panel-heading"><h2>Binary tree</h2><span>yellow: current, green: in res</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 440, y: 54, zoom: 0.88 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]} onInit={(instance) => { flowRef.current = instance; window.requestAnimationFrame(resetViewport); }}><Background gap={22} size={1} /><Controls /></ReactFlow></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>recursive stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((entry, index) => <span key={`${entry}-${index}`}>{entry}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>result so far</h3><div className="token-list">{frame.result.length ? frame.result.map((value, index) => <span key={`${value}-${index}`}>res[{index}] = {value}</span>) : <em>res = []</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}

function treePosition(index: number): { x: number; y: number } {
  const depth = Math.floor(Math.log2(index + 1));
  const firstAtDepth = 2 ** depth - 1;
  const offset = index - firstAtDepth;
  const spacing = 180 / (2 ** Math.max(depth - 1, 0));
  return { x: (offset - (2 ** depth - 1) / 2) * spacing, y: depth * 132 };
}
