import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type ContainerWaterInput } from "./data";
import { createContainerWaterDryRun } from "./dryRun";

export default function ContainerWaterVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<ContainerWaterInput>(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createContainerWaterDryRun(input.height), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selectedExample = examples.find((example) => example.id === exampleId);
  const maxHeight = Math.max(...input.height, 1);

  useEffect(() => {
    if (!playing || step >= run.frames.length - 1) {
      if (step >= run.frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 620);
    return () => window.clearTimeout(timer);
  }, [playing, run.frames.length, step]);

  function load(example: (typeof examples)[number]) {
    setExampleId(example.id);
    setInput(example.input);
    setText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const candidate = JSON.parse(text) as ContainerWaterInput;
      if (!candidate || !Array.isArray(candidate.height) || candidate.height.length < 2 || !candidate.height.every((value) => Number.isFinite(value) && value >= 0)) throw new Error();
      setInput(candidate);
      setExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError('Use JSON such as {"height":[1,8,6,2,5,4,8,3,7]}.');
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
        <div className="step-pill">Step {step + 1} / {run.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div>
          </div>
          <div className="input-grid">
            <label>input JSON<textarea aria-label="input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load heights</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current result"}</span><code>{frame.result ?? selectedExample?.output ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel water-flow-panel">
          <div className="panel-heading"><h2>Two-Pointer Container</h2><span>max area = {frame.maxArea}</span></div>
          <div className="water-stage">
            <div className="water-bars" style={{ gridTemplateColumns: "repeat(" + input.height.length + ", minmax(44px, 1fr))" }}>
              {input.height.map((height, index) => {
                const isBoundary = index === frame.left || index === frame.right;
                const isInside = index > frame.left && index < frame.right;
                return (
                  <div className={["water-column", isBoundary ? "is-boundary" : "", isInside ? "is-inside" : ""].filter(Boolean).join(" ")} key={index}>
                    <div className="water-pointer">{index === frame.left ? "left" : index === frame.right ? "right" : ""}</div>
                    <div className="water-track">
                      {isInside && frame.containerHeight !== null ? <div className="water-fill" style={{ height: (frame.containerHeight / maxHeight) * 100 + "%" }} /> : null}
                      <div className="water-bar" style={{ height: Math.max(7, (height / maxHeight) * 100) + "%" }}><strong>{height}</strong></div>
                    </div>
                    <span>i = {index}</span>
                  </div>
                );
              })}
            </div>
            <div className="water-readout">
              <div><span>width</span><strong>{frame.width ?? "-"}</strong></div>
              <div><span>limiting height</span><strong>{frame.containerHeight ?? "-"}</strong></div>
              <div><span>current area</span><strong>{frame.area ?? "-"}</strong></div>
            </div>
            <div className="product-phase"><span>current decision</span><strong>{frame.left < frame.right ? "[" + frame.left + ", " + frame.right + "]" : "pointers meet"}</strong><p>{frame.detail}</p></div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={"event-card " + frame.kind}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>two-pointer state</h3><div className="token-list"><span>left = {frame.left}</span><span>right = {frame.right}</span><span>area = {frame.area ?? "-"}</span><span>max_area = {frame.maxArea}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
