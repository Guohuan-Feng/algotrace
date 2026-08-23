import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { SummaryRangesExample } from "./data";
import { createSummaryRangesDryRun, formatRange, formatRanges } from "./dryRun";
import type { SummaryRange, SummaryRangesFrame } from "./dryRun";

export default function SummaryRangesVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [values, setValues] = useState<number[]>([...defaultExample.values]);
  const [valuesInput, setValuesInput] = useState(JSON.stringify(defaultExample.values));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createSummaryRangesDryRun(values), [values]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 720);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: SummaryRangesExample) {
    setSelectedExampleId(example.id);
    setValues([...example.values]);
    setValuesInput(JSON.stringify(example.values));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(valuesInput);
      if (!isValidValueStream(parsed)) {
        setError("Enter a JSON list of 1 to 10 integers, for example [1,3,7,2,6].");
        return;
      }
      setSelectedExampleId(0);
      setValues(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Enter valid JSON, for example [1,3,7,2,6].");
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
          <div className="example-switcher" aria-label="LeetCode examples">
            <span>LeetCode examples</span>
            <div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div>
          </div>
          <div className="panel-heading"><h2>input stream</h2><span>{values.length} calls</span></div>
          <div className="input-grid">
            <label>addNum values JSON<textarea value={valuesInput} onChange={(event) => setValuesInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load stream</button>
          </div>
          <div className="summary-ranges-legend">
            <span className="is-pending">white pending</span>
            <span className="is-current">yellow current</span>
            <span className="is-new">blue new</span>
            <span className="is-result">green committed</span>
          </div>
          <div className="expected-output"><span>{selectedExample ? selectedExample.label + " output" : "Current output"}</span><code>{formatRanges(selectedExample?.output ?? frame.result)}</code></div>
        </aside>

        <section className="flow-panel summary-ranges-flow-panel">
          <div className="panel-heading"><h2>Rebuild Disjoint Intervals</h2><span>{frame.value === null ? "getIntervals()" : "addNum(" + frame.value + ")"}</span></div>
          <div className="summary-ranges-stage">
            <section className="stream-track">
              <div className="summary-track-heading"><h3>input stream</h3><span>one value per addNum call</span></div>
              <div className="stream-values">
                {frame.values.map((item, index) => <div className={["stream-value", index < frame.operationIndex ? "is-added" : "", index === frame.operationIndex ? "is-current" : ""].filter(Boolean).join(" ")} key={item + "-" + index}><strong>{item}</strong><span>#{index + 1}</span></div>)}
              </div>
            </section>
            <RangeTrack frame={frame} label="existing intervals" ranges={frame.intervals} tone="existing" />
            <RangeTrack frame={frame} label="mutable new" ranges={frame.newInterval ? [frame.newInterval] : []} tone="new" />
            <RangeTrack frame={frame} label="rebuilt res" ranges={frame.res} tone="result" />
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={"event-card " + frame.kind}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>operation</h3><div className="token-list"><span>value = {frame.value ?? "done"}</span><span>call = {frame.operationIndex < 0 ? "constructor" : frame.operationIndex + 1}</span><span>branch = {frame.branch ?? "waiting"}</span></div></div>
          <div className="state-block"><h3>scan</h3><div className="token-list">{frame.scannedInterval ? <span>left, right = {formatRange(frame.scannedInterval)}</span> : <em>no active interval</em>}</div></div>
          <div className="state-block"><h3>new</h3><pre className="matrix-state">{frame.newInterval ? formatRange(frame.newInterval) : "None"}</pre></div>
          <div className="state-block"><h3>res</h3><pre className="matrix-state">{formatRanges(frame.res)}</pre></div>
          <div className="state-block"><h3>self.intervals</h3><pre className="matrix-state">{formatRanges(frame.intervals)}</pre></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function RangeTrack({ frame, label, ranges, tone }: { frame: SummaryRangesFrame; label: string; ranges: SummaryRange[]; tone: "existing" | "new" | "result" }) {
  const domain = getDomain(frame);
  return (
    <section className={"summary-range-track tone-" + tone}>
      <div className="summary-track-heading"><h3>{label}</h3><span>{ranges.length ? formatRanges(ranges) : "[]"}</span></div>
      <div className="summary-range-rail">
        {ranges.length ? ranges.map((range, index) => <div className={["summary-range-segment", tone === "existing" && sameRange(range, frame.scannedInterval) ? "is-scanned" : ""].filter(Boolean).join(" ")} key={range[0] + "-" + range[1] + "-" + index} style={rangeStyle(range, domain)}><span>{formatRange(range)}</span></div>) : <span className="summary-range-empty">empty</span>}
      </div>
    </section>
  );
}

function isValidValueStream(value: unknown): value is number[] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 10 && value.every(Number.isInteger);
}

function sameRange(left: SummaryRange, right: SummaryRange | null) {
  return right !== null && left[0] === right[0] && left[1] === right[1];
}

function getDomain(frame: SummaryRangesFrame) {
  const values = [
    ...frame.values,
    ...frame.intervals.flat(),
    ...(frame.newInterval ?? []),
    ...frame.res.flat(),
    ...(frame.scannedInterval ?? []),
  ];
  if (!values.length) return { min: 0, max: 1 };
  return { min: Math.min(...values) - 1, max: Math.max(...values) + 1 };
}

function rangeStyle(range: SummaryRange, domain: { min: number; max: number }) {
  const start = range[0];
  const end = range[1];
  const span = domain.max - domain.min;
  const left = ((start - domain.min) / span) * 100;
  const width = Math.max(8, ((end - start + 1) / span) * 100);
  return { left: left + "%", width: width + "%" };
}
