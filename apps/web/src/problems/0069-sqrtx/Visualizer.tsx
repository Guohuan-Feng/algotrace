import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SqrtExample } from "./data";
import { createSqrtDryRun } from "./dryRun";

export default function SqrtVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [x, setX] = useState(defaultExample.x);
  const [xInput, setXInput] = useState(String(defaultExample.x));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSqrtDryRun(x), [x]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const values = Array.from({ length: x + 1 }, (_, index) => index);

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 750);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: SqrtExample) {
    setSelectedExampleId(example.id);
    setX(example.x);
    setXInput(String(example.x));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    const parsed = Number(xInput);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 40) {
      setError("Use an integer x from 0 to 40 for visualization.");
      return;
    }
    setSelectedExampleId(0);
    setX(parsed);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  const output = selectedExample?.output ?? frame.result ?? "pending";
  const finalLeft = frame.result !== null ? frame.left : null;
  const finalRight = frame.result !== null ? frame.right : null;

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
            <span>Examples</span>
            <div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div>
          </div>
          <div className="panel-heading"><h2>input</h2><span>x = {x}</span></div>
          <div className="input-grid">
            <label>x<input value={xInput} onChange={(event) => setXInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load x</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current output"}</span><code>{output}</code></div>
          <div className="expected-output"><span>boundary rule</span><code>right | left</code></div>
        </aside>
        <section className="flow-panel sqrt-flow-panel">
          <div className="panel-heading"><h2>Binary Boundary</h2><span>{frame.relation}</span></div>
          <div className="sqrt-stage">
            <div className="sqrt-array">
              {values.map((value) => {
                const square = value * value;
                const isKnownTrue = value <= frame.trueMax;
                const isKnownFalse = value >= frame.falseMin;
                const inWindow = value >= frame.left && value <= frame.right;
                return (
                  <div
                    className={[
                      "sqrt-cell",
                      isKnownTrue ? "is-true-region" : "",
                      isKnownFalse ? "is-false-region" : "",
                      inWindow ? "in-window" : "",
                      frame.left === value ? "is-left" : "",
                      frame.mid === value ? "is-mid" : "",
                      frame.right === value ? "is-right" : "",
                      finalRight === value ? "is-answer" : "",
                      finalLeft === value ? "is-first-false" : "",
                    ].filter(Boolean).join(" ")}
                    key={value}
                  >
                    <strong>{value}</strong>
                    <span>{value}^2 = {square}</span>
                    <em>{square <= x ? "T" : "F"}</em>
                    <div className="pointer-tags">
                      {frame.left === value ? <em>left</em> : null}
                      {frame.mid === value ? <em>mid</em> : null}
                      {frame.right === value ? <em>right</em> : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <BoundaryBar x={x} left={frame.left} right={frame.right} trueMax={frame.trueMax} falseMin={frame.falseMin} done={frame.result !== null} />
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>pointers</h3><div className="token-list"><span>left = {frame.left}</span><span>mid = {frame.mid ?? "none"}</span><span>right = {frame.right}</span></div></div>
          <div className="state-block"><h3>boundary</h3><div className="token-list"><span>right = last True</span><span>left = first False</span><span>return = {frame.result ?? "pending"}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function BoundaryBar({ x, left, right, trueMax, falseMin, done }: { x: number; left: number; right: number; trueMax: number; falseMin: number; done: boolean }) {
  const safeTrueMax = Math.max(-1, Math.min(trueMax, x));
  const safeFalseMin = Math.max(0, Math.min(falseMin, x + 1));
  const trueWidth = ((safeTrueMax + 1) / (x + 1)) * 100;
  const falseWidth = ((x - safeFalseMin + 1) / (x + 1)) * 100;

  return (
    <div className="sqrt-boundary-card">
      <div className="sqrt-boundary-track">
        <div className="sqrt-boundary-true" style={{ width: `${trueWidth}%` }}>n^2 &lt;= x</div>
        <div className="sqrt-boundary-gap" />
        <div className="sqrt-boundary-false" style={{ width: `${falseWidth}%` }}>n^2 &gt; x</div>
      </div>
      <div className={["sqrt-crossing", done ? "is-done" : ""].filter(Boolean).join(" ")}>
        <span>right = {right}</span>
        <strong>|</strong>
        <span>left = {left}</span>
      </div>
    </div>
  );
}
