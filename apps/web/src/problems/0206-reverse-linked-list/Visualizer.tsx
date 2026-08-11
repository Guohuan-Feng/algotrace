import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { ReverseLinkedListExample } from "./data";
import { createReverseLinkedListDryRun } from "./dryRun";

export default function ReverseLinkedListVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [values, setValues] = useState(defaultExample.values);
  const [valuesInput, setValuesInput] = useState(JSON.stringify(defaultExample.values));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createReverseLinkedListDryRun(values), [values]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 700);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: ReverseLinkedListExample) {
    setSelectedExampleId(example.id);
    setValues(example.values);
    setValuesInput(JSON.stringify(example.values));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(valuesInput);
      if (!Array.isArray(parsed) || parsed.length > 10 || !parsed.every(Number.isInteger)) {
        setError("Use a JSON array of at most 10 integers.");
        return;
      }
      setSelectedExampleId(0);
      setValues(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [1,2,3,4,5].");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack}><ArrowLeft size={16} />Catalog</button>
          <p className="eyebrow">AlgoTrace dry run</p>
          <h1>{title}</h1>
        </div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="examples">
            <span>LeetCode examples</span>
            <div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div>
          </div>
          <div className="panel-heading"><h2>head</h2><span>len = {values.length}</span></div>
          <div className="input-grid">
            <label>list JSON<textarea value={valuesInput} onChange={(event) => setValuesInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load list</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current output"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result)}</code></div>
        </aside>
        <section className="flow-panel list-flow-panel">
          <div className="panel-heading"><h2>Pointer Reversal</h2><span>{frame.phase}</span></div>
          <div className="list-stage">
            <SingleLinkedListFrame
              changedIndex={frame.changedIndex}
              curIndex={frame.curIndex}
              nextPointers={frame.nextPointers}
              prevIndex={frame.prevIndex}
              nxtIndex={frame.nxtIndex}
              values={frame.original}
            />
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>pointers</h3><div className="token-list"><span>prev = {valueAt(frame.original, frame.prevIndex)}</span><span>cur = {valueAt(frame.original, frame.curIndex)}</span><span>nxt = {valueAt(frame.original, frame.nxtIndex)}</span></div></div>
          <div className="state-block"><h3>result</h3><div className="token-list words"><span>{JSON.stringify(frame.result)}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function valueAt(values: number[], index: number | null) {
  return index === null ? "None" : values[index];
}

function collectProcessed(nextPointers: Array<number | null>, prevIndex: number | null) {
  const processed = new Set<number>();
  let index = prevIndex;
  while (index !== null && !processed.has(index)) {
    processed.add(index);
    index = nextPointers[index];
  }
  return processed;
}

function SingleLinkedListFrame({
  changedIndex,
  curIndex,
  nextPointers,
  prevIndex,
  nxtIndex,
  values,
}: {
  changedIndex: number | null;
  curIndex: number | null;
  nextPointers: Array<number | null>;
  prevIndex: number | null;
  nxtIndex: number | null;
  values: number[];
}) {
  if (!values.length) {
    return <div className="reverse-list-empty">head = None</div>;
  }

  const nodeGap = 96;
  const nodeRadius = 29;
  const leftPad = 58;
  const nodeY = 110;
  const width = Math.max(520, leftPad * 2 + nodeGap * (values.length - 1));
  const height = 220;
  const processed = collectProcessed(nextPointers, prevIndex);
  const xFor = (index: number) => leftPad + index * nodeGap;

  return (
    <div className="reverse-list-stage">
      <div className="reverse-list-scroll" style={{ minWidth: width }}>
        <svg className="reverse-list-svg" height={height} viewBox={`0 0 ${width} ${height}`} width={width} aria-hidden="true">
          <defs>
            <marker id="reverse-arrow-forward" markerHeight="8" markerWidth="9" orient="auto" refX="8" refY="4">
              <path d="M0,0 L9,4 L0,8 Z" fill="#53615a" />
            </marker>
            <marker id="reverse-arrow-backward" markerHeight="8" markerWidth="9" orient="auto" refX="8" refY="4">
              <path d="M0,0 L9,4 L0,8 Z" fill="#2f9b57" />
            </marker>
            <marker id="reverse-arrow-active" markerHeight="9" markerWidth="10" orient="auto" refX="9" refY="4.5">
              <path d="M0,0 L10,4.5 L0,9 Z" fill="#d9973c" />
            </marker>
          </defs>
          {nextPointers.map((target, source) => {
            if (target === null) return null;
            const sourceX = xFor(source);
            const targetX = xFor(target);
            const isBackward = target < source;
            const isChanged = changedIndex === source;
            const startX = isBackward ? sourceX - nodeRadius : sourceX + nodeRadius;
            const endX = isBackward ? targetX + nodeRadius : targetX - nodeRadius;
            const middle = (startX + endX) / 2;
            const arcY = isBackward ? nodeY - 66 : nodeY;
            const path = isBackward
              ? `M ${startX} ${nodeY} C ${middle} ${arcY}, ${middle} ${arcY}, ${endX} ${nodeY}`
              : `M ${startX} ${nodeY} L ${endX} ${nodeY}`;
            const marker = isChanged ? "url(#reverse-arrow-active)" : isBackward ? "url(#reverse-arrow-backward)" : "url(#reverse-arrow-forward)";
            return <path className={["reverse-edge", isBackward ? "is-backward" : "is-forward", isChanged ? "is-changed" : ""].filter(Boolean).join(" ")} d={path} key={`${source}-${target}`} markerEnd={marker} />;
          })}
        </svg>
        <div className="reverse-list-nodes" style={{ height, width }}>
          {values.map((value, index) => (
            <div className="reverse-node-slot" key={`${value}-${index}`} style={{ left: xFor(index), top: nodeY }}>
              <div
                className={[
                  "list-node",
                  processed.has(index) ? "tone-green" : "",
                  curIndex === index ? "is-cur" : "",
                  nxtIndex === index ? "is-next" : "",
                  prevIndex === index ? "is-pre" : "",
                  changedIndex === index ? "is-pointer-change" : "",
                ].filter(Boolean).join(" ")}
              >
                <strong>{value}</strong>
                <span>i={index}</span>
              </div>
              <div className="pointer-tags reverse-tags">
                {prevIndex === index ? <em>prev</em> : null}
                {curIndex === index ? <em>cur</em> : null}
                {nxtIndex === index ? <em>nxt</em> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="reverse-legend">
        <span><i className="legend-dot unvisited" />not processed</span>
        <span><i className="legend-dot processed" />processed</span>
        <span><i className="legend-dot current" />cur</span>
        <span><i className="legend-line forward" />original next</span>
        <span><i className="legend-line backward" />reversed next</span>
      </div>
    </div>
  );
}
