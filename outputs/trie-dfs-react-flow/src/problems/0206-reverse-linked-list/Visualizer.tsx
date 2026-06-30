import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { ReverseLinkedListExample } from "./data";
import { createReverseLinkedListDryRun } from "./dryRun";

export function ReverseLinkedListVisualizer({ onBack }: VisualizerProps) {
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
            <section className="list-zone">
              <div className="panel-heading compact-heading"><h3>reversed / prev</h3><span>{frame.reversed.length ? "new head on the left" : "prev = None"}</span></div>
              <LinkedList values={frame.reversed} tone="green" prevHead={frame.reversed.length > 0} />
            </section>
            <section className="list-zone">
              <div className="panel-heading compact-heading"><h3>remaining / cur</h3><span>{frame.remaining.length ? "nodes not processed yet" : "cur = None"}</span></div>
              <LinkedList values={frame.remaining} curHead={frame.remaining.length > 0} nextHead={frame.remaining.length > 1} />
            </section>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>pointers</h3><div className="token-list"><span>prev = {frame.reversed[0] ?? "None"}</span><span>cur = {frame.remaining[0] ?? "None"}</span><span>nxt = {frame.remaining[1] ?? "None"}</span></div></div>
          <div className="state-block"><h3>result</h3><div className="token-list words"><span>{JSON.stringify(frame.result)}</span></div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function LinkedList({ values, tone, curHead = false, nextHead = false, prevHead = false }: { values: number[]; tone?: "green"; curHead?: boolean; nextHead?: boolean; prevHead?: boolean }) {
  if (!values.length) {
    return <div className="linked-list empty-list">None</div>;
  }
  return (
    <div className="linked-list">
      {values.map((value, index) => (
        <div className="list-node-wrap" key={`${value}-${index}`}>
          <div className={["list-node", tone ? `tone-${tone}` : "", curHead && index === 0 ? "is-cur" : "", nextHead && index === 1 ? "is-next" : "", prevHead && index === 0 ? "is-pre" : ""].filter(Boolean).join(" ")}>
            <strong>{value}</strong>
            <span>{index}</span>
            <div className="pointer-tags">
              {prevHead && index === 0 ? <em>prev</em> : null}
              {curHead && index === 0 ? <em>cur</em> : null}
              {nextHead && index === 1 ? <em>nxt</em> : null}
            </div>
          </div>
          {index < values.length - 1 ? <div className="list-arrow" /> : null}
        </div>
      ))}
    </div>
  );
}
