import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node, ReactFlowInstance } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { CombinationSumExample } from "./data";
import { createCombinationSumDryRun, nodeIdForPath } from "./dryRun";

export default function CombinationSumVisualizer({ onBack }: VisualizerProps) {
  const flowPanelRef = useRef<HTMLElement | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [candidates, setCandidates] = useState(defaultExample.candidates);
  const [target, setTarget] = useState(defaultExample.target);
  const [candidatesInput, setCandidatesInput] = useState(JSON.stringify(defaultExample.candidates));
  const [targetInput, setTargetInput] = useState(String(defaultExample.target));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createCombinationSumDryRun(candidates, target), [candidates, target]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const layout = useMemo(() => layoutCombinationSumTree(candidates, target), [candidates, target]);
  const nodeIds = useMemo(() => new Set(frame.nodes.map((node) => node.id)), [frame.nodes]);

  const resetTreeViewport = useCallback((duration = 0) => {
    const panelWidth = flowPanelRef.current?.clientWidth ?? 900;
    const zoom = target >= 12 ? 0.36 : target >= 9 ? 0.5 : 0.72;
    flowInstanceRef.current?.setViewport(
      {
        x: panelWidth / 2,
        y: 46,
        zoom,
      },
      { duration },
    );
  }, [target]);

  const flowNodes = useMemo<Node[]>(
    () =>
      frame.nodes.map((node) => {
        const position = layout.get(node.id) ?? { x: 0, y: node.depth * 116 };
        const isActive = node.id === frame.activeNodeId;
        const isPath = frame.pathIds.includes(node.id);
        const isComplete = frame.completedIds.includes(node.id);
        const isPruned = frame.prunedIds.includes(node.id);

        return {
          id: node.id,
          position,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          type: "default",
          className: [
            "combo-node",
            isActive ? "is-active" : "",
            isPath ? "is-path" : "",
            isComplete ? "is-complete" : "",
            isPruned ? "is-pruned" : "",
          ]
            .filter(Boolean)
            .join(" "),
          data: {
            label: (
              <div className="combo-node-content">
                <strong>{node.label}</strong>
                <span>{node.path.length ? `sum=${node.total}` : "start"}</span>
              </div>
            ),
          },
        };
      }),
    [frame.activeNodeId, frame.completedIds, frame.nodes, frame.pathIds, frame.prunedIds, layout],
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      frame.nodes
        .filter((node) => node.parentId && nodeIds.has(node.parentId))
        .map((node) => {
          const isPathEdge = frame.pathIds.includes(node.id);
          return {
            id: `${node.parentId}-${node.id}`,
            source: node.parentId ?? "",
            target: node.id,
            type: "straight",
            label: node.label,
            labelBgBorderRadius: 6,
            labelBgPadding: [6, 3],
            labelBgStyle: { fill: "#f7f3ea", fillOpacity: 0.92 },
            labelStyle: { fill: "#46534b", fontSize: 12, fontWeight: 800 },
            markerEnd: { type: MarkerType.ArrowClosed },
            animated: isPathEdge,
            className: isPathEdge ? "edge-path" : "",
          };
        }),
    [frame.nodes, frame.pathIds, nodeIds],
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

  function loadExample(example: CombinationSumExample) {
    setSelectedExampleId(example.id);
    setCandidates(example.candidates);
    setTarget(example.target);
    setCandidatesInput(JSON.stringify(example.candidates));
    setTargetInput(String(example.target));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedCandidates = JSON.parse(candidatesInput);
      const parsedTarget = Number(targetInput);

      if (
        !Array.isArray(parsedCandidates) ||
        parsedCandidates.length < 1 ||
        parsedCandidates.length > 6 ||
        !parsedCandidates.every((value) => Number.isInteger(value) && value > 0)
      ) {
        setError("Use a JSON array of 1 to 6 positive integers, for example [2,3,6,7].");
        return;
      }

      if (new Set(parsedCandidates).size !== parsedCandidates.length) {
        setError("LeetCode 39 uses distinct candidates, so every number must be unique.");
        return;
      }

      if (!Number.isInteger(parsedTarget) || parsedTarget < 1 || parsedTarget > 30) {
        setError("Use an integer target from 1 to 30.");
        return;
      }

      const sortedCandidates = [...parsedCandidates].sort((a, b) => a - b);
      setSelectedExampleId(0);
      setCandidates(sortedCandidates);
      setCandidatesInput(JSON.stringify(sortedCandidates));
      setTarget(parsedTarget);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [2,3,6,7].");
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
            <h2>candidates</h2>
            <span>target = {target}</span>
          </div>

          <div className="digits-strip number-strip" aria-label="Candidate numbers">
            {candidates.map((value, index) => (
              <span
                className={[
                  frame.currentI === index ? "active" : "",
                  frame.path.includes(value) ? "used" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={value}
              >
                {value}
              </span>
            ))}
          </div>

          <div className="expected-output">
            <span>current path</span>
            <code>[{frame.path.join(", ")}]</code>
          </div>

          <div className="expected-output">
            <span>current total</span>
            <code>
              {frame.total} / {target}
            </code>
          </div>

          <div className="input-grid">
            <label>
              candidates JSON
              <textarea value={candidatesInput} onChange={(event) => setCandidatesInput(event.target.value)} />
            </label>
            <label>
              target
              <input className="text-input" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load input
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Custom output"}</span>
            <code>{JSON.stringify(selectedExample?.output ?? frame.results)}</code>
          </div>
        </aside>

        <section className="flow-panel combo-flow-panel" ref={flowPanelRef}>
          <div className="panel-heading">
            <h2>Reusable Choice Tree</h2>
            <span>
              total: {frame.total} / {target}
            </span>
          </div>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            defaultViewport={{ x: 450, y: 46, zoom: 1 }}
            minZoom={0.1}
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
              <span>start = {frame.start}</span>
              <span>path = [{frame.path.join(", ")}]</span>
              <span>total = {frame.total}</span>
              {frame.currentI !== null ? <span>i = {frame.currentI}</span> : null}
              {frame.currentCandidate !== null ? <span>candidate = {frame.currentCandidate}</span> : null}
            </div>
          </div>

          <div className="state-block">
            <h3>res</h3>
            <div className="token-list words">
              {frame.results.length ? (
                frame.results.map((result) => (
                  <span className={frame.kind === "found" && result.join(",") === frame.path.join(",") ? "flash" : ""} key={result.join("-")}>
                    [{result.join(", ")}]
                  </span>
                ))
              ) : (
                <em>[]</em>
              )}
            </div>
          </div>

          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function layoutCombinationSumTree(candidates: number[], target: number): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const horizontalGap = target >= 12 ? 42 : target >= 9 ? 58 : 94;
  const verticalGap = 116;
  let nextLeaf = 0;

  function measure(start: number, path: number[], total: number): number {
    if (total >= target) {
      const x = nextLeaf * horizontalGap;
      positions.set(nodeIdForPath(path), { x, y: path.length * verticalGap });
      nextLeaf += 1;
      return x;
    }

    const childXs: number[] = [];
    for (let i = start; i < candidates.length; i += 1) {
      childXs.push(measure(i, [...path, candidates[i]], total + candidates[i]));
    }

    const x = childXs.length ? (childXs[0] + childXs[childXs.length - 1]) / 2 : nextLeaf * horizontalGap;
    positions.set(nodeIdForPath(path), { x, y: path.length * verticalGap });
    return x;
  }

  measure(0, [], 0);
  const rootPosition = positions.get(nodeIdForPath([])) ?? { x: 0, y: 0 };
  positions.forEach((position, id) => {
    positions.set(id, {
      x: position.x - rootPosition.x,
      y: position.y,
    });
  });

  return positions;
}
