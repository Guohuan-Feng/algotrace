import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { MinCostConnectPointsExample } from "./data";
import { createMinCostConnectPointsDryRun } from "./dryRun";
import type { MinCostConnectPointsFrame, MstCandidate, Point } from "./dryRun";

export default function MinCostConnectPointsVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [points, setPoints] = useState<number[][]>(copyPoints(defaultExample.points));
  const [pointsInput, setPointsInput] = useState(JSON.stringify(defaultExample.points));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createMinCostConnectPointsDryRun(points), [points]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const visited = new Set(frame.visited);

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: MinCostConnectPointsExample) {
    setSelectedExampleId(example.id);
    setPoints(copyPoints(example.points));
    setPointsInput(JSON.stringify(example.points));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(pointsInput);
      if (!isValidPoints(parsed)) {
        setError("Use 2-9 integer coordinate pairs, for example [[0,0],[2,2],[5,2]].");
        return;
      }
      setSelectedExampleId(0);
      setPoints(copyPoints(parsed));
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[0,0],[2,2],[5,2]].");
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
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input points</h2><span>n = {points.length}</span></div>
          <div className="input-grid"><label>points JSON<textarea value={pointsInput} onChange={(event) => setPointsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load points</button></div>
          <div className="mst-legend"><span>white unvisited</span><span>yellow current</span><span>green MST</span><span>blue heap top</span><span>red stale entry</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>

        <section className="flow-panel min-cost-flow-panel">
          <div className="panel-heading"><h2>Prim's Minimum Spanning Tree</h2><span>res = {frame.res}</span></div>
          <div className="min-cost-stage">
            <PointGraph frame={frame} />
            <section className="mst-heap-panel" aria-label="Min heap candidates">
              <div className="compact-heading"><h3>heap</h3><span>(cost, point index)</span></div>
              <div className="mst-heap-items">{frame.heap.length ? frame.heap.map((candidate, index) => <HeapCandidate candidate={candidate} current={frame} index={index} key={`${candidate.cost}-${candidate.point}-${candidate.from}-${index}`} />) : <p className="heap-empty">empty</p>}</div>
            </section>
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>variables</h3><div className="token-list"><span>cost = {frame.candidateCost ?? "-"}</span><span>cur = {frame.current === null ? "-" : `P${frame.current}`}</span><span>res = {frame.res}</span></div></div>
          <div className="state-block"><h3>visited / MST nodes</h3><div className="token-list">{frame.visited.length ? frame.visited.map((id) => <span key={id}>P{id}</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>MST edges</h3><div className="mst-edge-list">{frame.mstEdges.length ? frame.mstEdges.map((edge, index) => <span key={`${edge.from}-${edge.to}-${index}`}>P{edge.from} - P{edge.to} <b>+{edge.cost}</b></span>) : <em>waiting for first connection</em>}</div></div>
          <div className="state-block"><h3>heap top</h3><div className="token-list">{frame.heap[0] ? <span>({frame.heap[0].cost}, P{frame.heap[0].point})</span> : <em>empty</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function PointGraph({ frame }: { frame: MinCostConnectPointsFrame }) {
  const positions = pointPositions(frame.points);
  const visited = new Set(frame.visited);
  const activeCandidate = frame.candidate !== null && frame.candidateFrom !== null && frame.candidateCost !== null
    ? { cost: frame.candidateCost, point: frame.candidate, from: frame.candidateFrom }
    : null;
  const heapTop = frame.heap[0] ?? null;
  const heapTopEdge = isLinkedCandidate(heapTop) ? heapTop : null;
  const showHeapTop = heapTopEdge !== null && !sameCandidate(heapTopEdge, activeCandidate);

  return <section className="mst-canvas" aria-label="Point graph and current minimum spanning tree">
    <svg className="mst-svg" viewBox="0 0 100 100" role="img" aria-label="Points connected by MST edges">
      <g className="mst-grid" aria-hidden="true">{[12, 30, 48, 66, 84].flatMap((value) => [<line key={`v-${value}`} x1={value} x2={value} y1="8" y2="92" />, <line key={`h-${value}`} x1="8" x2="92" y1={value} y2={value} />])}</g>
      {frame.mstEdges.map((edge, index) => <GraphEdge edge={edge} from={positions[edge.from]} key={`${edge.from}-${edge.to}-${index}`} to={positions[edge.to]} variant="mst" />)}
      {showHeapTop && heapTopEdge ? <GraphEdge edge={heapTopEdge} from={positions[heapTopEdge.from]} to={positions[heapTopEdge.point]} variant="heap" /> : null}
      {activeCandidate ? <GraphEdge edge={activeCandidate} from={positions[activeCandidate.from]} to={positions[activeCandidate.point]} variant={frame.phase === "skip" ? "stale" : "current"} /> : null}
      {frame.points.map((point) => {
        const isCurrent = point.id === frame.current;
        const classes = ["mst-node", visited.has(point.id) ? "is-visited" : "", isCurrent ? "is-current" : "", point.id === 0 ? "is-start" : ""].filter(Boolean).join(" ");
        const position = positions[point.id];
        return <g className={classes} key={point.id} transform={`translate(${position.x} ${position.y})`}><circle r="5.4" /><text className="mst-node-id" y="1.2">P{point.id}</text><text className="mst-node-coordinate" y="10">({point.x}, {point.y})</text></g>;
      })}
    </svg>
  </section>;
}

function GraphEdge({ edge, from, to, variant }: { edge: MstCandidate | { from: number; to: number; cost: number }; from: PlotPosition; to: PlotPosition; variant: "mst" | "heap" | "current" | "stale" }) {
  const target = "to" in edge ? edge.to : edge.point;
  return <g className={`mst-graph-edge is-${variant}`}><line x1={from.x} x2={to.x} y1={from.y} y2={to.y} /><text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 2}>{edge.cost}</text><title>{`P${edge.from} -> P${target}: ${edge.cost}`}</title></g>;
}

function HeapCandidate({ candidate, current, index }: { candidate: MstCandidate; current: MinCostConnectPointsFrame; index: number }) {
  const classes = ["mst-heap-item", index === 0 ? "is-top" : "", current.phase === "skip" && sameCandidate(candidate, currentCandidate(current)) ? "is-stale" : "", sameCandidate(candidate, currentCandidate(current)) ? "is-current" : ""].filter(Boolean).join(" ");
  return <span className={classes}><strong>({candidate.cost}, P{candidate.point})</strong>{candidate.from === null ? <em>start</em> : <em>via P{candidate.from}</em>}</span>;
}

function currentCandidate(frame: MinCostConnectPointsFrame): MstCandidate | null {
  return frame.candidate !== null && frame.candidateFrom !== null && frame.candidateCost !== null
    ? { cost: frame.candidateCost, point: frame.candidate, from: frame.candidateFrom }
    : null;
}

function sameCandidate(left: MstCandidate | null, right: MstCandidate | null) {
  return left !== null && right !== null && left.cost === right.cost && left.point === right.point && left.from === right.from;
}

function isLinkedCandidate(candidate: MstCandidate | null): candidate is MstCandidate & { from: number } {
  return candidate?.from !== null;
}

type PlotPosition = { x: number; y: number };

function pointPositions(points: Point[]): Record<number, PlotPosition> {
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const rangeX = Math.max(1, maxX - minX);
  const rangeY = Math.max(1, maxY - minY);

  return Object.fromEntries(points.map((point) => [point.id, {
    x: 12 + ((point.x - minX) / rangeX) * 76,
    y: 84 - ((point.y - minY) / rangeY) * 68,
  }]));
}

function isValidPoints(value: unknown): value is number[][] {
  return Array.isArray(value) && value.length >= 2 && value.length <= 9 && value.every((point) => Array.isArray(point) && point.length === 2 && point.every((coordinate) => Number.isInteger(coordinate) && Math.abs(coordinate) <= 100));
}

function copyPoints(points: number[][]) {
  return points.map((point) => [...point]);
}
