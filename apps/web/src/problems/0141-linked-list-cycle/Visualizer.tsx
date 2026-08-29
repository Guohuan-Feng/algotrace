import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type LinkedListCycleExample } from "./data";
import { createLinkedListCycleDryRun } from "./dryRun";

type CycleInput = { values: number[]; pos: number };

export default function LinkedListCycleVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<CycleInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createLinkedListCycleDryRun(input.values, input.pos), [input]);
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

  const nodes = useMemo<Node[]>(() => input.values.map((value, index) => {
    const id = `node-${index}`;
    const roles = [frame.slowId === id ? "slow" : "", frame.fastId === id ? "fast" : "", frame.meetingId === id ? "meeting" : ""].filter(Boolean).join(" | ");
    const isCycleSource = input.pos >= 0 && index === input.values.length - 1;
    const isCycleTarget = index === input.pos;
    return { id, position: { x: index * 155, y: 150 }, sourcePosition: isCycleSource ? Position.Bottom : Position.Right, targetPosition: isCycleTarget ? Position.Bottom : Position.Left, className: ["combo-node", frame.slowId === id || frame.fastId === id ? "is-active" : frame.visitedIds.includes(id) ? "is-complete" : ""].filter(Boolean).join(" "), data: { label: <div className="combo-node-content"><strong>{value}</strong><span>{roles || `node ${index}`}</span></div> } };
  }), [frame.fastId, frame.meetingId, frame.slowId, frame.visitedIds, input.pos, input.values]);
  const edges = useMemo<Edge[]>(() => Object.entries(frame.links).flatMap(([source, target]) => target ? [{ id: `${source}-${target}`, source, target, type: Number(target.slice(5)) <= Number(source.slice(5)) ? "bezier" : "smoothstep", label: "next", labelBgBorderRadius: 6, labelBgPadding: [6, 3], markerEnd: { type: MarkerType.ArrowClosed }, animated: frame.slowId === source || frame.fastId === source, style: { stroke: Number(target.slice(5)) <= Number(source.slice(5)) ? "#d9973c" : "#52728e", strokeWidth: Number(target.slice(5)) <= Number(source.slice(5)) ? 2.35 : 1.6 } }] : []), [frame.fastId, frame.links, frame.slowId]);

  function load(example: LinkedListCycleExample) {
    setExampleId(example.id);
    setInput(example.input);
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
      setInput(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use {"values":[3,2,0,-4],"pos":1}; pos is -1 for no cycle.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>list and cycle pos JSON<textarea aria-label="cycle input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load list</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{String(frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel combo-flow-panel"><div className="panel-heading"><h2>Floyd pointer chase</h2><span>yellow: slow or fast, green: visited</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 150, y: 50, zoom: 0.75 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]}><Background gap={22} size={1} /><Controls /></ReactFlow></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>pointer variables</h3><div className="token-list"><span>slow = {label(frame.slowId, input.values)}</span><span>fast = {label(frame.fastId, input.values)}</span><span>meeting = {label(frame.meetingId, input.values)}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function isValidInput(value: unknown): value is CycleInput { return typeof value === "object" && value !== null && "values" in value && "pos" in value && Array.isArray(value.values) && value.values.length <= 10 && value.values.every((item) => typeof item === "number" && Number.isFinite(item)) && typeof value.pos === "number" && Number.isInteger(value.pos) && value.pos >= -1 && value.pos < value.values.length; }
function label(id: string | null, values: number[]): string { return id === null ? "None" : String(values[Number(id.slice(5))]); }
