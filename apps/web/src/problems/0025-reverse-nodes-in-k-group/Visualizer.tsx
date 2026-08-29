import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type ReverseKGroupExample } from "./data";
import { createReverseKGroupDryRun } from "./dryRun";

type KGroupInput = { values: number[]; k: number };

export default function ReverseKGroupVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<KGroupInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createReverseKGroupDryRun(input.values, input.k), [input]);
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

  const nodes = useMemo<Node[]>(() => [
    {
      id: "dummy",
      position: { x: -150, y: 130 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: nodeClass("dummy", frame),
      data: { label: <NodeLabel value="dummy" roles={rolesFor("dummy", frame)} /> },
    },
    ...input.values.map((value, index) => {
      const id = `node-${index}`;
      return {
        id,
        position: { x: index * 148, y: 130 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        className: nodeClass(id, frame),
        data: { label: <NodeLabel value={String(value)} roles={rolesFor(id, frame)} /> },
      };
    }),
  ], [frame, input.values]);

  const edges = useMemo<Edge[]>(() => Object.entries(frame.links).flatMap(([source, target]) => target ? [{
    id: `${source}-${target}`,
    source,
    target,
    type: "smoothstep",
    label: "next",
    labelBgBorderRadius: 6,
    labelBgPadding: [6, 3],
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: frame.activeId === source || frame.targetId === target,
    style: { stroke: frame.activeId === source ? "#d9973c" : frame.reversedIds.includes(source) ? "#268366" : "#52728e", strokeWidth: frame.reversedIds.includes(source) ? 2.5 : 1.6 },
  }] : []), [frame.activeId, frame.links, frame.reversedIds, frame.targetId]);

  function load(example: ReverseKGroupExample) {
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
      setError('Use {"values":[1,2,3,4,5],"k":2}; include up to 10 numbers and a positive integer k.');
    }
  }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>list and k JSON<textarea aria-label="list and k input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load list</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{JSON.stringify(frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel combo-flow-panel"><div className="panel-heading"><h2>In-place k-group reversal</h2><span>yellow: current rewrite</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 135, y: 50, zoom: 0.66 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]}><Background gap={22} size={1} /><Controls /></ReactFlow></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>pointer variables</h3><div className="token-list"><span>group_prev = {label(frame.groupPrevId, input.values)}</span><span>kth = {label(frame.kthId, input.values)}</span><span>prev = {label(frame.previousId, input.values)}</span><span>curr = {label(frame.currentId, input.values)}</span><span>group_next = {label(frame.groupNextId, input.values)}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function NodeLabel({ roles, value }: { roles: string[]; value: string }) { return <div className="combo-node-content"><strong>{value}</strong><span>{roles.join(" | ") || "node"}</span></div>; }
function rolesFor(id: string, frame: ReturnType<typeof createReverseKGroupDryRun>["frames"][number]): string[] { return [[frame.groupPrevId === id, "group prev"], [frame.kthId === id, "kth"], [frame.previousId === id, "prev"], [frame.currentId === id, "curr"], [frame.groupNextId === id, "group next"]].flatMap(([matches, role]) => matches ? [role as string] : []); }
function nodeClass(id: string, frame: ReturnType<typeof createReverseKGroupDryRun>["frames"][number]): string { return ["combo-node", frame.activeId === id ? "is-active" : frame.targetId === id ? "is-pointer-change" : frame.reversedIds.includes(id) ? "is-complete" : ""].filter(Boolean).join(" "); }
function label(id: string | null, values: number[]): string { return id === null ? "None" : id === "dummy" ? "dummy" : String(values[Number(id.slice(5))]); }
function isValidInput(value: unknown): value is KGroupInput { return typeof value === "object" && value !== null && "values" in value && "k" in value && Array.isArray(value.values) && value.values.length <= 10 && value.values.every((item) => typeof item === "number" && Number.isFinite(item)) && typeof value.k === "number" && Number.isInteger(value.k) && value.k > 0; }
