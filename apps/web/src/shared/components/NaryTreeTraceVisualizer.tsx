import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node as FlowNode, ReactFlowInstance } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type NaryTraceFrame = { kind: FrameKind; phase: string; title: string; detail: string; activeLines: number[]; activeId: string | null; completedIds: string[]; result: unknown };
type NaryInput = { value: number; children: NaryInput[] };
type Example<T> = { id: number; label: string; input: T; output: unknown };
type Props<T extends NaryInput, F extends NaryTraceFrame> = VisualizerProps & { title: string; examples: Example<T>[]; codeLines: string[]; heading: string; createRun: (input: T) => { frames: F[] }; renderState: (frame: F) => ReactNode };
type Positioned = { id: string; value: number; parentId: string | null; x: number; y: number };

export function NaryTreeTraceVisualizer<T extends NaryInput, F extends NaryTraceFrame>({ onBack, title, examples, codeLines, heading, createRun, renderState }: Props<T, F>) {
  const panelRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const [exampleId, setExampleId] = useState(examples[0]!.id), [input, setInput] = useState(examples[0]!.input), [text, setText] = useState(JSON.stringify(examples[0]!.input)), [step, setStep] = useState(0), [playing, setPlaying] = useState(false), [error, setError] = useState("");
  const run = useMemo(() => createRun(input), [createRun, input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const positioned = useMemo(() => layout(input), [input]);
  const resetViewport = useCallback(() => flowRef.current?.setViewport({ x: (panelRef.current?.clientWidth ?? 880) / 2, y: 54, zoom: positioned.length > 12 ? 0.62 : 0.88 }), [input]);
  useEffect(() => { if (!playing || step >= run.frames.length - 1) { if (step >= run.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 650); return () => window.clearTimeout(timer); }, [playing, run.frames.length, step]);
  useEffect(() => { const request = window.requestAnimationFrame(resetViewport); return () => window.cancelAnimationFrame(request); }, [resetViewport]);
  const nodes = useMemo<FlowNode[]>(() => positioned.map((node) => ({ id: node.id, position: { x: node.x, y: node.y }, sourcePosition: Position.Bottom, targetPosition: Position.Top, className: ["combo-node", "bst-node", frame.activeId === node.id ? "is-active" : "", frame.completedIds.includes(node.id) ? "is-complete" : ""].filter(Boolean).join(" "), data: { label: <div className="combo-node-content"><strong>{node.value}</strong><span>{frame.activeId === node.id ? "current" : frame.completedIds.includes(node.id) ? "counted" : node.parentId ? "child" : "root"}</span></div> } })), [frame.activeId, frame.completedIds, positioned]);
  const edges = useMemo<Edge[]>(() => positioned.filter((node) => node.parentId).map((node) => ({ id: `${node.parentId}-${node.id}`, source: node.parentId!, target: node.id, type: "straight", markerEnd: { type: MarkerType.ArrowClosed }, animated: node.id === frame.activeId })), [frame.activeId, positioned]);
  function load(example: Example<T>) { setExampleId(example.id); setInput(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const parsed: unknown = JSON.parse(text); if (!validNary(parsed)) throw new Error(); setExampleId(0); setInput(parsed as T); setStep(0); setPlaying(false); setError(""); } catch { setError('Use {"value":1,"children":[{"value":3,"children":[]}]}.'); } }
  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace"><aside className="board-panel"><div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>root JSON<textarea aria-label="N-ary tree input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load tree</button></div><div className="expected-output"><span>Current result</span><code>{JSON.stringify(frame.result)}</code></div></aside><section className="flow-panel combo-flow-panel" ref={panelRef}><div className="panel-heading"><h2>{heading}</h2><span>yellow: current, green: counted</span></div><ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 440, y: 54, zoom: 0.88 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]} onInit={(instance) => { flowRef.current = instance; window.requestAnimationFrame(resetViewport); }}><Background gap={22} size={1} /><Controls /></ReactFlow></section><aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>{renderState(frame)}<CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside></section></main>;
}

function layout(root: NaryInput): Positioned[] {
  const result: Positioned[] = []; let leaf = 0;
  function visit(node: NaryInput, id: string, parentId: string | null, depth: number): number {
    const childPositions = node.children.map((child, index) => visit(child, `${id}-${index}`, id, depth + 1));
    const x = childPositions.length ? childPositions.reduce((sum, value) => sum + value, 0) / childPositions.length : leaf++ * 170;
    result.push({ id, value: node.value, parentId, x, y: depth * 132 });
    return x;
  }
  const rootX = visit(root, "root", null, 0);
  result.forEach((node) => { node.x -= rootX; });
  return result;
}
function validNary(value: unknown): value is NaryInput { if (typeof value !== "object" || value === null) return false; const node = value as { value?: unknown; children?: unknown }; return typeof node.value === "number" && Array.isArray(node.children) && node.children.every(validNary); }
