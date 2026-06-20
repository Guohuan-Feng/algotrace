import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position } from "reactflow";
import type { Edge, Node, ReactFlowInstance } from "reactflow";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, phoneMap, title } from "./data";
import type { LetterCombinationExample } from "./data";
import { createLetterCombinationDryRun, nodeIdForPath } from "./dryRun";
import type { CombinationTreeNode } from "./dryRun";

export function LetterCombinationsVisualizer({ onBack }: VisualizerProps) {
  const flowPanelRef = useRef<HTMLElement | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [digits, setDigits] = useState(defaultExample.digits);
  const [digitsInput, setDigitsInput] = useState(defaultExample.digits);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createLetterCombinationDryRun(digits), [digits]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const layout = useMemo(() => layoutCombinationTree(digits), [digits]);
  const nodeIds = useMemo(() => new Set(frame.nodes.map((node) => node.id)), [frame.nodes]);

  const resetTreeViewport = useCallback((duration = 0) => {
    const panelWidth = flowPanelRef.current?.clientWidth ?? 900;
    const zoom = digits.length >= 4 ? 0.56 : digits.length === 3 ? 0.78 : 1;
    flowInstanceRef.current?.setViewport(
      {
        x: panelWidth / 2,
        y: 46,
        zoom,
      },
      { duration },
    );
  }, [digits.length]);

  const flowNodes = useMemo<Node[]>(
    () =>
      frame.nodes.map((node) => {
        const position = layout.get(node.id) ?? { x: 0, y: node.depth * 112 };
        const isActive = node.id === frame.activeNodeId;
        const isPath = frame.pathIds.includes(node.id);
        const isComplete = frame.completedIds.includes(node.id);

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
          ]
            .filter(Boolean)
            .join(" "),
          data: {
            label: (
              <div className="combo-node-content">
                <strong>{node.label}</strong>
                <span>{node.path || "start"}</span>
              </div>
            ),
          },
        };
      }),
    [frame.activeNodeId, frame.completedIds, frame.nodes, frame.pathIds, layout],
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

  function loadExample(example: LetterCombinationExample) {
    setSelectedExampleId(example.id);
    setDigits(example.digits);
    setDigitsInput(example.digits);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    const normalized = digitsInput.trim();
    if (!/^[2-9]{0,4}$/.test(normalized)) {
      setError("Use 0 to 4 digits, each between 2 and 9.");
      return;
    }

    setSelectedExampleId(0);
    setDigits(normalized);
    setStep(0);
    setPlaying(false);
    setError("");
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
            <h2>Digits</h2>
            <span>{digits ? digits.split("").join(" -> ") : "empty"}</span>
          </div>

          <div className="digits-strip" aria-label="Input digits">
            {digits ? (
              digits.split("").map((digit, index) => (
                <span className={index === frame.index && frame.currentDigit === digit ? "active" : ""} key={`${digit}-${index}`}>
                  {digit}
                </span>
              ))
            ) : (
              <em>""</em>
            )}
          </div>

          <div className="phone-keypad" aria-label="Phone keypad">
            {Object.entries(phoneMap).map(([digit, letters]) => (
              <div className={frame.currentDigit === digit ? "phone-key active" : "phone-key"} key={digit}>
                <strong>{digit}</strong>
                <span>
                  {letters.split("").map((letter) => (
                    <b className={frame.currentDigit === digit && frame.currentChar === letter ? "selected" : ""} key={letter}>
                      {letter}
                    </b>
                  ))}
                </span>
              </div>
            ))}
          </div>

          <div className="input-grid">
            <label>
              digits
              <input className="text-input" value={digitsInput} onChange={(event) => setDigitsInput(event.target.value)} />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}>
              <Upload size={16} />
              Load digits
            </button>
          </div>

          <div className="expected-output">
            <span>{selectedExample ? `${selectedExample.label} output` : "Custom output"}</span>
            <code>{JSON.stringify(selectedExample?.output ?? frame.results)}</code>
          </div>
        </aside>

        <section className="flow-panel combo-flow-panel" ref={flowPanelRef}>
          <div className="panel-heading">
            <h2>DFS Tree</h2>
            <span>path: {frame.path || "empty"}</span>
          </div>
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            defaultViewport={{ x: 450, y: 46, zoom: 1 }}
            minZoom={0.2}
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
              <span>index = {frame.index}</span>
              <span>path = "{frame.path}"</span>
              {frame.letters ? <span>letters = "{frame.letters}"</span> : null}
            </div>
          </div>

          <div className="state-block">
            <h3>res</h3>
            <div className="token-list words">
              {frame.results.length ? (
                frame.results.map((result) => (
                  <span className={frame.kind === "found" && result === frame.path ? "flash" : ""} key={result}>
                    {result}
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

function layoutCombinationTree(digits: string): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const horizontalGap = digits.length >= 4 ? 70 : digits.length === 3 ? 92 : 122;
  const verticalGap = 116;
  let nextLeaf = 0;

  function measure(path: string, depth: number): number {
    const digit = digits[depth] as keyof typeof phoneMap | undefined;
    const letters = digit ? phoneMap[digit] ?? "" : "";
    if (!letters) {
      const x = nextLeaf * horizontalGap;
      positions.set(nodeIdForPath(path), { x, y: depth * verticalGap });
      nextLeaf += 1;
      return x;
    }

    const childXs = letters.split("").map((letter) => measure(path + letter, depth + 1));
    const x = (childXs[0] + childXs[childXs.length - 1]) / 2;
    positions.set(nodeIdForPath(path), { x, y: depth * verticalGap });
    return x;
  }

  measure("", 0);
  const rootPosition = positions.get(nodeIdForPath("")) ?? { x: 0, y: 0 };
  positions.forEach((position, id) => {
    positions.set(id, {
      x: position.x - rootPosition.x,
      y: position.y,
    });
  });

  return positions;
}
