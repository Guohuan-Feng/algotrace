import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node, ReactFlowInstance } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { flattenTree } from "../../problems/0094-binary-tree-inorder-traversal/dryRun";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { FrameKind, VisualizerProps } from "../types";

export type BinaryTreeSnapshotFrame = {
  kind: FrameKind;
  phase: string;
  title: string;
  detail: string;
  activeLines: number[];
  tree: Array<number | null>;
  result: unknown;
};

type Example<T> = { id: number; label: string; input: T; output: unknown };
type Props<T, F extends BinaryTreeSnapshotFrame> = VisualizerProps & {
  title: string;
  examples: Example<T>[];
  codeLines: string[];
  heading: string;
  inputLabel: string;
  errorMessage: string;
  parseInput: (value: unknown) => T | null;
  createRun: (input: T) => { frames: F[] };
  getActiveValues?: (frame: F) => number[];
  getCompletedValues?: (frame: F) => number[];
  getActiveIndices?: (frame: F) => number[];
  getCompletedIndices?: (frame: F) => number[];
  renderState: (frame: F) => ReactNode;
};

export function BinaryTreeTraceVisualizer<T, F extends BinaryTreeSnapshotFrame>({
  onBack,
  title,
  examples,
  codeLines,
  heading,
  inputLabel,
  errorMessage,
  parseInput,
  createRun,
  getActiveValues = () => [],
  getCompletedValues = () => [],
  getActiveIndices = () => [],
  getCompletedIndices = () => [],
  renderState,
}: Props<T, F>) {
  const panelRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const [exampleId, setExampleId] = useState(examples[0]!.id);
  const [input, setInput] = useState(examples[0]!.input);
  const [text, setText] = useState(JSON.stringify(examples[0]!.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createRun(input), [createRun, input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const tree = useMemo(() => flattenTree(frame.tree), [frame.tree]);
  const activeValues = getActiveValues(frame);
  const completedValues = getCompletedValues(frame);
  const activeIndices = getActiveIndices(frame);
  const completedIndices = getCompletedIndices(frame);
  const selected = examples.find((example) => example.id === exampleId);
  const resetViewport = useCallback(() => {
    flowRef.current?.setViewport({
      x: (panelRef.current?.clientWidth ?? 880) / 2,
      y: 54,
      zoom: frame.tree.length > 15 ? 0.62 : 0.88,
    });
  }, [input]);

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

  const nodes = useMemo<Node[]>(() => tree.map((node) => {
    const current = activeIndices.length ? activeIndices.includes(node.index) : activeValues.includes(node.value);
    const complete = !current && (completedIndices.length ? completedIndices.includes(node.index) : completedValues.includes(node.value));
    return {
      id: node.id,
      position: treePosition(node.layoutIndex),
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      className: ["combo-node", "bst-node", current ? "is-active" : "", complete ? "is-complete" : ""].filter(Boolean).join(" "),
      data: { label: <div className="combo-node-content"><strong>{node.value}</strong><span>{current ? "current" : complete ? "confirmed" : node.side ?? "root"}</span></div> },
    };
  }), [activeIndices, activeValues, completedIndices, completedValues, tree]);
  const edges = useMemo<Edge[]>(() => tree.filter((node) => node.parentId).map((node) => ({
    id: `${node.parentId}-${node.id}`,
    source: node.parentId!,
    target: node.id,
    type: "straight",
    label: node.side,
    labelBgBorderRadius: 6,
    labelBgPadding: [6, 3],
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: activeIndices.length ? activeIndices.includes(node.index) : activeValues.includes(node.value),
  })), [activeIndices, activeValues, tree]);

  function load(example: Example<T>) {
    setExampleId(example.id);
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = parseInput(JSON.parse(text));
      if (!parsed) throw new Error();
      setExampleId(0);
      setInput(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError(errorMessage);
    }
  }

  return <main className="app-shell">
    <header className="topbar">
      <div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
      <div className="step-pill">Step {step + 1} / {run.frames.length}</div>
    </header>
    <section className="workspace">
      <aside className="board-panel">
        <div className="example-switcher"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div>
        <div className="input-grid"><label>{inputLabel}<textarea aria-label={`${title} input JSON`} value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div>
        <div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{JSON.stringify(frame.result)}</code></div>
      </aside>
      <section className="flow-panel combo-flow-panel" ref={panelRef}>
        <div className="panel-heading"><h2>{heading}</h2><span>yellow: current, green: confirmed</span></div>
        <ReactFlow nodes={nodes} edges={edges} defaultViewport={{ x: 440, y: 54, zoom: 0.88 }} minZoom={0.18} maxZoom={1.6} nodeOrigin={[0.5, 0]} onInit={(instance) => { flowRef.current = instance; window.requestAnimationFrame(resetViewport); }}><Background gap={22} size={1} /><Controls /></ReactFlow>
      </section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>{renderState(frame)}<CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function treePosition(index: number): { x: number; y: number } {
  const depth = Math.floor(Math.log2(index + 1));
  const first = 2 ** depth - 1;
  const spacing = 180 / (2 ** Math.max(depth - 1, 0));
  return { x: (index - first - (2 ** depth - 1) / 2) * spacing, y: depth * 132 };
}
