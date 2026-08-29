import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MaximumProductInput } from "./data";
import { createMaximumProductDryRun } from "./dryRun";

export default function MaximumProductVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<MaximumProductInput>(defaultExample.input);
  const [inputText, setInputText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createMaximumProductDryRun(input.nums), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 620);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: (typeof examples)[number]) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setInputText(JSON.stringify(example.input));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const nextInput = JSON.parse(inputText) as MaximumProductInput;
      if (!Array.isArray(nextInput.nums) || nextInput.nums.length === 0) throw new Error();
      setInput(nextInput);
      setSelectedExampleId(0);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use JSON such as {\"nums\":[2,3,-2,4]}.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
        <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
      </header>
      <section className="workspace">
        <aside className="board-panel">
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>nums = [{input.nums.join(", ")}]</span></div>
          <div className="input-grid"><label>input JSON<textarea aria-label="input JSON" value={inputText} onChange={(event) => setInputText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load input</button></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result}</code></div>
          <div className="product-legend"><span><i className="product-current-key" />current number</span><span><i className="product-state-key" />rolling state</span></div>
        </aside>
        <section className="flow-panel product-flow-panel">
          <div className="panel-heading"><h2>Rolling Product States</h2><span>res = {frame.result}</span></div>
          <div className="product-stage">
            <div className="product-numbers" aria-label="input numbers">{frame.nums.map((value, index) => <div className={`product-number ${index === frame.index ? "is-current" : ""}`} key={`${index}-${value}`}><span>nums[{index}]</span><strong>{value}</strong></div>)}</div>
            <div className="product-phase"><span>current line</span><strong>{frame.index === null ? "return result" : `num = ${frame.num}`}</strong><p>{frame.detail}</p></div>
            <div className="product-state-grid">
              <ProductState name="old_max" value={frame.oldMax} muted={frame.oldMax === null} />
              <ProductState name="cur_max" value={frame.curMax} emphasized />
              <ProductState name="cur_min" value={frame.curMin} />
              <ProductState name="res" value={frame.result} result />
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>loop state</h3><div className="token-list"><span>index = {frame.index ?? "-"}</span><span>num = {frame.num ?? "-"}</span><span>phase = {frame.phase}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function ProductState({ name, value, emphasized = false, result = false, muted = false }: { name: string; value: number | null; emphasized?: boolean; result?: boolean; muted?: boolean }) {
  return <div className={`product-state ${emphasized ? "is-emphasized" : ""} ${result ? "is-result" : ""} ${muted ? "is-muted" : ""}`}><span>{name}</span><strong>{value ?? "-"}</strong></div>;
}
