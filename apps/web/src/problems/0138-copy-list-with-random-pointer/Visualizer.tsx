import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type CopyRandomListExample } from "./data";
import { createCopyRandomListDryRun, type RandomListInput } from "./dryRun";

export default function CopyRandomListVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [values, setValues] = useState<RandomListInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createCopyRandomListDryRun(values), [values]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selected = examples.find((example) => example.id === exampleId);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  const nodes = useMemo<Node[]>(() => values.flatMap(([value], index) => {
    const originalId = `o-${index}`;
    const copyId = `c-${index}`;
    const original: Node = {
      id: originalId,
      position: { x: index * 150, y: 95 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: ["combo-node", frame.activeId === originalId ? "is-active" : ""].filter(Boolean).join(" "),
      data: { label: <div className="combo-node-content"><strong>{value}</strong><span>{frame.currentOriginalId === originalId ? "original cur" : `original ${index}`}</span></div> },
    };
    const copy: Node[] = frame.createdIds.includes(copyId) ? [{
      id: copyId,
      position: { x: index * 150, y: 340 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: ["combo-node", frame.activeId === copyId ? "is-active" : "is-complete"].filter(Boolean).join(" "),
      data: { label: <div className="combo-node-content"><strong>{value}</strong><span>{frame.copyHeadId === copyId ? "copy head" : frame.copyTailId === copyId ? "copy tail" : `copy ${index}`}</span></div> },
    }] : [];
    return [original, ...copy];
  }), [frame.activeId, frame.copyHeadId, frame.copyTailId, frame.createdIds, frame.currentOriginalId, values]);

  const edges = useMemo<Edge[]>(() => {
    const created = new Set(frame.createdIds);
    const edges: Edge[] = [];
    Object.entries(frame.links).forEach(([source, target]) => {
      if (!target || (source.startsWith("c-") && !created.has(source))) return;
      edges.push({ id: `next-${source}-${target}`, source, target, type: "smoothstep", label: "next", labelBgBorderRadius: 6, labelBgPadding: [6, 3], markerEnd: { type: MarkerType.ArrowClosed }, animated: frame.activeId === source, style: { stroke: source.startsWith("c-") ? "#268366" : "#52728e", strokeWidth: source.startsWith("c-") ? 2.25 : 1.5 } });
    });
    Object.entries(frame.originalRandom).forEach(([source, target]) => {
      if (target) edges.push({ id: `original-random-${source}-${target}`, source, target, type: "smoothstep", label: "random", labelBgBorderRadius: 6, labelBgPadding: [6, 3], markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#8593a3", strokeDasharray: "5 4" } });
    });
    Object.entries(frame.copyRandom).forEach(([source, target]) => {
      if (target) edges.push({ id: `copy-random-${source}-${target}`, source, target, type: "smoothstep", label: "random", labelBgBorderRadius: 6, labelBgPadding: [6, 3], markerEnd: { type: MarkerType.ArrowClosed }, animated: frame.activeId === source, style: { stroke: "#3174ad", strokeDasharray: "5 4", strokeWidth: 2 } });
    });
    return edges;
  }, [frame.activeId, frame.copyRandom, frame.createdIds, frame.links, frame.originalRandom]);

  function load(example: CopyRandomListExample) {
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
      if (!isValidInput(parsed)) throw new Error();
      setExampleId(0);
      setValues(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use [[7,null],[13,0],[11,4]]; each random index must be null or point to a list index.");
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>[value, random index] JSON<textarea aria-label="random list input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load list</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{frame.result ? JSON.stringify(frame.result) : "pending"}</code></div></aside>
    <section className="flow-panel combo-flow-panel"><div className="panel-heading"><h2>Original and deep copy</h2><span>solid: next, dashed: random</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 110, y: 24, zoom: 0.7 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]}><Background gap={22} size={1} /><Controls /></ReactFlow></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>copy state</h3><div className="token-list"><span>original cur = {label(frame.currentOriginalId, values)}</span><span>copy head = {label(frame.copyHeadId, values)}</span><span>copy tail = {label(frame.copyTailId, values)}</span><span>created = {frame.createdIds.length}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function isValidInput(value: unknown): value is RandomListInput { return Array.isArray(value) && value.length <= 6 && value.every((entry) => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "number" && Number.isFinite(entry[0]) && (entry[1] === null || (typeof entry[1] === "number" && Number.isInteger(entry[1]) && entry[1] >= 0 && entry[1] < value.length))); }
function label(id: string | null, values: RandomListInput): string { return id === null ? "None" : `${id.startsWith("c-") ? "copy" : "original"}(${values[Number(id.slice(2))]?.[0] ?? "?"})`; }
