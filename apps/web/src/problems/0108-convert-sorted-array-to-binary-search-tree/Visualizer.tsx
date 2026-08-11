import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node, ReactFlowInstance } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SortedArrayToBstExample } from "./data";
import { createSortedArrayToBstDryRun } from "./dryRun";

export default function SortedArrayToBstVisualizer({ onBack }: VisualizerProps) {
  const flowPanelRef = useRef<HTMLElement | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [nums, setNums] = useState(defaultExample.nums);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.nums));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSortedArrayToBstDryRun(nums), [nums]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const layout = useMemo(() => layoutBst(nums.length), [nums.length]);
  const nodeIds = useMemo(() => new Set(frame.nodes.map((node) => node.id)), [frame.nodes]);

  const resetTreeViewport = useCallback((duration = 0) => {
    const panelWidth = flowPanelRef.current?.clientWidth ?? 900;
    const zoom = nums.length >= 8 ? 0.56 : nums.length >= 6 ? 0.72 : 0.92;
    flowInstanceRef.current?.setViewport({ x: panelWidth / 2, y: 54, zoom }, { duration });
  }, [nums.length]);

  const flowNodes = useMemo<Node[]>(
    () =>
      frame.nodes.map((node) => {
        const position = layout.get(rangeKey(node.left, node.right)) ?? { x: 0, y: node.depth * 126 };
        const isActive = node.id === frame.activeNodeId;
        const isComplete = frame.completedIds.includes(node.id);

        return {
          id: node.id,
          position,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          type: "default",
          className: ["combo-node", "bst-node", isActive ? "is-active" : "", isComplete ? "is-complete" : ""]
            .filter(Boolean)
            .join(" "),
          data: {
            label: (
              <div className="combo-node-content">
                <strong>{node.value}</strong>
                <span>[{node.left},{node.right}] mid={node.mid}</span>
              </div>
            ),
          },
        };
      }),
    [frame.activeNodeId, frame.completedIds, frame.nodes, layout],
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      frame.nodes
        .filter((node) => node.parentId && nodeIds.has(node.parentId))
        .map((node) => ({
          id: `${node.parentId}-${node.id}`,
          source: node.parentId ?? "",
          target: node.id,
          type: "straight",
          label: node.side,
          labelBgBorderRadius: 6,
          labelBgPadding: [6, 3],
          labelBgStyle: { fill: "#f7f3ea", fillOpacity: 0.92 },
          labelStyle: { fill: "#46534b", fontSize: 12, fontWeight: 800 },
          markerEnd: { type: MarkerType.ArrowClosed },
          animated: node.id === frame.activeNodeId,
          className: node.id === frame.activeNodeId ? "edge-path" : "",
        })),
    [frame.activeNodeId, frame.nodes, nodeIds],
  );

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => resetTreeViewport());
    return () => window.cancelAnimationFrame(id);
  }, [resetTreeViewport]);

  function loadExample(example: SortedArrayToBstExample) {
    setSelectedExampleId(example.id);
    setNums(example.nums);
    setNumsInput(JSON.stringify(example.nums));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(numsInput);
      if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 10 || !parsed.every(Number.isInteger)) {
        setError("Use a JSON array of 1 to 10 integers, for example [-10,-3,0,5,9].");
        return;
      }

      const sorted = [...parsed].sort((a, b) => a - b);
      setSelectedExampleId(0);
      setNums(sorted);
      setNumsInput(JSON.stringify(sorted));
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [-10,-3,0,5,9].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}>
            <ArrowLeft size={16} />
            Catalog
          </button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">
          Step {step + 1} / {dryRun.frames.length}
        </div>
      </header>

      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>
              {examples.map((example) => (
                <button
                  className={selectedExampleId === example.id ? "active" : ""}
                  key={example.id}
                  onClick={() => loadExample(example)}
                  type="button"
                >
                  {example.id}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-heading">
            <h2>nums</h2>
            <span>len = {nums.length}</span>
          </div>

          <div className="array-strip" aria-label="Sorted numbers">
            {nums.map((value, index) => {
              const inRange = frame.activeRange ? index >= frame.activeRange[0] && index <= frame.activeRange[1] : false;
              return (
                <span
                  className={[inRange ? "in-range" : "", frame.mid === index ? "active" : ""].filter(Boolean).join(" ")}
                  key={`${value}-${index}`}
                >
                  <strong>{value}</strong>
                  <em>{index}</em>
                </span>
              );
            })}
          </div>

          <div className="expected-output">
            <span>active range</span>
            <code>{frame.activeRange ? `[${frame.activeRange[0]}, ${frame.activeRange[1]}]` : "none"}</code>
          </div>

          <div className="input-grid">
            <label>
              nums JSON
              <textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load nums
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Valid BST output"}</span>
            <code>{selectedExample?.output ?? "Any height-balanced BST is accepted."}</code>
          </div>
        </aside>

        <section className="flow-panel combo-flow-panel" ref={flowPanelRef}>
          <div className="panel-heading">
            <h2>Balanced BST</h2>
            <span>mid: {frame.mid ?? "none"}</span>
          </div>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            defaultViewport={{ x: 450, y: 54, zoom: 1 }}
            minZoom={0.18}
            maxZoom={1.6}
            nodeOrigin={[0.5, 0]}
            onInit={(instance) => {
              flowInstanceRef.current = instance;
              window.requestAnimationFrame(() => resetTreeViewport());
            }}
          >
            <Background gap={22} size={1} />
            <Controls />
          </ReactFlow>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}>
              <p className="eyebrow">{frame.kind}</p>
              <h2>{frame.title}</h2>
              <p>{frame.detail}</p>
            </div>

            <StepControls
              frameCount={dryRun.frames.length}
              playing={playing}
              step={step}
              onPlayingChange={setPlaying}
              onStepChange={setStep}
            />
          </div>

          <div className="state-block">
            <h3>call stack</h3>
            <div className="token-list">
              {frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}
            </div>
          </div>

          <div className="state-block">
            <h3>current state</h3>
            <div className="token-list">
              {frame.activeRange ? <span>left = {frame.activeRange[0]}</span> : null}
              {frame.activeRange ? <span>right = {frame.activeRange[1]}</span> : null}
              {frame.mid !== null ? <span>mid = {frame.mid}</span> : null}
              <span>return = {frame.returnValue}</span>
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function layoutBst(length: number): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const verticalGap = 126;
  const horizontalGap = length >= 8 ? 74 : 98;
  let nextLeaf = 0;

  function measure(left: number, right: number, depth: number): number {
    if (left > right) {
      const x = nextLeaf * horizontalGap;
      nextLeaf += 1;
      return x;
    }

    const mid = Math.floor((left + right) / 2);
    const leftX = measure(left, mid - 1, depth + 1);
    const rightX = measure(mid + 1, right, depth + 1);
    const x = (leftX + rightX) / 2;
    positions.set(rangeKey(left, right), { x, y: depth * verticalGap });
    return x;
  }

  measure(0, length - 1, 0);
  const root = positions.get(rangeKey(0, length - 1)) ?? { x: 0, y: 0 };
  positions.forEach((position, key) => {
    positions.set(key, { x: position.x - root.x, y: position.y });
  });

  return positions;
}

function rangeKey(left: number, right: number): string {
  return `${left}-${right}`;
}
