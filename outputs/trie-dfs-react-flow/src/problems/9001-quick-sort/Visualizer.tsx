import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { QuickSortExample } from "./data";
import { createQuickSortDryRun } from "./dryRun";

export function QuickSortVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [nums, setNums] = useState(defaultExample.nums);
  const [numsInput, setNumsInput] = useState(JSON.stringify(defaultExample.nums));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createQuickSortDryRun(nums), [nums]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const valueRange = useMemo(() => {
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return { min, span: Math.max(1, max - min) };
  }, [nums]);

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: QuickSortExample) {
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
        setError("Use a JSON array of 1 to 10 integers.");
        return;
      }
      setSelectedExampleId(0);
      setNums(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [5,2,9,1].");
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
            <span>Examples</span>
            <div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div>
          </div>
          <div className="panel-heading"><h2>nums</h2><span>len = {nums.length}</span></div>
          <div className="expected-output"><span>active range</span><code>[{frame.left}, {frame.right}]</code></div>
          <div className="input-grid">
            <label>nums JSON<textarea value={numsInput} onChange={(event) => setNumsInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load nums</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Sorted output"}</span><code>{JSON.stringify(selectedExample?.output ?? [...nums].sort((a, b) => a - b))}</code></div>
        </aside>
        <section className="flow-panel sort-flow-panel">
          <div className="panel-heading"><h2>Partition Trace</h2><span>pivot: {frame.pivotIndex ?? "none"}</span></div>
          <div className="sort-stage">
            <div className="sort-array">
              {frame.nums.map((value, index) => (
                <div className={[
                  "sort-bar",
                  index >= frame.left && index <= frame.right ? "in-range" : "",
                  frame.pivotIndex === index ? "is-pivot" : "",
                  frame.i === index ? "is-i" : "",
                  frame.j === index ? "is-j" : "",
                  frame.sorted.includes(index) ? "is-sorted" : "",
                ].filter(Boolean).join(" ")} key={`${value}-${index}`} style={{ height: `${88 + ((value - valueRange.min) / valueRange.span) * 190}px` }}>
                  <strong>{value}</strong><span>{index}</span>
                  <div className="pointer-tags">{frame.i === index ? <em>i</em> : null}{frame.j === index ? <em>j</em> : null}{frame.pivotIndex === index ? <em>pivot</em> : null}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>call stack</h3><div className="token-list">{frame.stack.length ? frame.stack.map((item) => <span key={item}>{item}</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>pointers</h3><div className="token-list"><span>left = {frame.left}</span><span>right = {frame.right}</span><span>i = {frame.i ?? "none"}</span><span>j = {frame.j ?? "none"}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}
