import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type ReorderListExample } from "./data";
import { createReorderListDryRun } from "./dryRun";

type ReorderInput = { head: number[] };

export default function ReorderListVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<ReorderInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createReorderListDryRun(input.head), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selected = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) { if (step >= run.frames.length - 1) setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  const nodes = useMemo<Node[]>(() => input.head.map((value, index) => {
    const nodeId = `node-${index}`;
    const roles = [[frame.slowId === nodeId, "slow"], [frame.fastId === nodeId, "fast"], [frame.previousId === nodeId, "prev"], [frame.currentId === nodeId, "curr"], [frame.firstId === nodeId, "first"], [frame.secondId === nodeId, "second"]].flatMap(([match, role]) => match ? [role as string] : []);
    const active = [frame.slowId, frame.fastId, frame.currentId, frame.firstId, frame.secondId].includes(nodeId);
    return { id: nodeId, position: { x: index * 150, y: 150 }, sourcePosition: Position.Right, targetPosition: Position.Left, className: ["combo-node", active ? "is-active" : frame.previousId === nodeId ? "is-complete" : ""].filter(Boolean).join(" "), data: { label: <div className="combo-node-content"><strong>{value}</strong><span>{roles.join(" | ") || `node ${index}`}</span></div> } };
  }), [frame, input.head]);
  const edges = useMemo<Edge[]>(() => Object.entries(frame.links).flatMap(([source, target]) => target ? [{ id: `${source}-${target}`, source, target, type: "smoothstep", label: "next", labelBgBorderRadius: 6, labelBgPadding: [6, 3], markerEnd: { type: MarkerType.ArrowClosed }, animated: source === frame.currentId || source === frame.firstId || source === frame.secondId, style: { stroke: source === frame.previousId ? "#268366" : source === frame.currentId || source === frame.firstId || source === frame.secondId ? "#d9973c" : "#52728e", strokeWidth: source === frame.previousId ? 2.4 : 1.6 } }] : []), [frame.currentId, frame.firstId, frame.links, frame.previousId, frame.secondId]);

  function load(example: ReorderListExample) { setExampleId(example.id); setInput(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const parsed: unknown = JSON.parse(text); if (!valid(parsed)) throw new Error(); setExampleId(0); setInput(parsed); setStep(0); setPlaying(false); setError(""); } catch { setError('Use {"head":[1,2,3,4]}; include between 1 and 10 numbers.'); } }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>linked-list JSON<textarea aria-label="linked list input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load list</button></div><div className="expected-output"><span>{selected ? `${selected.label} final order` : "Current final order"}</span><code>{frame.result ? JSON.stringify(frame.result) : "pending"}</code></div></aside>
    <section className="flow-panel combo-flow-panel"><div className="panel-heading"><h2>Middle, reverse, and weave</h2><span>yellow: moving pointers, green: reversed prefix</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 135, y: 50, zoom: 0.68 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]}><Background gap={22} size={1} /><Controls /></ReactFlow></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>pointer variables</h3><div className="token-list"><span>slow = {label(frame.slowId, input.head)}</span><span>fast = {label(frame.fastId, input.head)}</span><span>prev = {label(frame.previousId, input.head)}</span><span>curr = {label(frame.currentId, input.head)}</span><span>first = {label(frame.firstId, input.head)}</span><span>second = {label(frame.secondId, input.head)}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function valid(value: unknown): value is ReorderInput { return typeof value === "object" && value !== null && "head" in value && Array.isArray(value.head) && value.head.length > 0 && value.head.length <= 10 && value.head.every((item) => typeof item === "number" && Number.isFinite(item)); }
function label(nodeId: string | null, values: number[]): string { return nodeId === null ? "None" : String(values[Number(nodeId.slice(5))]); }
