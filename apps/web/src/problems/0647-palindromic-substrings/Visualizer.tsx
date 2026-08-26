import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { PalindromicSubstringsExample } from "./data";
import { createPalindromicSubstringsDryRun } from "./dryRun";

export default function PalindromicSubstringsVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [s, setS] = useState(defaultExample.s);
  const [sInput, setSInput] = useState(defaultExample.s);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createPalindromicSubstringsDryRun(s), [s]);
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

  function loadExample(example: PalindromicSubstringsExample) {
    setSelectedExampleId(example.id);
    setS(example.s);
    setSInput(example.s);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    const next = sInput.trim();
    if (!/^[a-z]+$/.test(next) || next.length > 16) {
      setError("Use 1 to 16 lowercase English letters so the trace stays readable.");
      return;
    }
    setSelectedExampleId(0);
    setS(next);
    setSInput(next);
    setStep(0);
    setPlaying(false);
    setError("");
  }

  const modeLabel = frame.mode ? `${frame.mode} center` : "waiting for a center";

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
          <div className="panel-heading"><h2>input</h2><span>length = {s.length}</span></div>
          <div className="input-grid">
            <label>s<input className="text-input" value={sInput} onChange={(event) => setSInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load string</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
          <div className="expected-output"><span>running res</span><code>{frame.res}</code></div>
          <div className="center-legend" aria-label="color legend"><span><i className="legend-success" />palindrome</span><span><i className="legend-active" />compare</span><span><i className="legend-mismatch" />mismatch</span></div>
        </aside>

        <section className="flow-panel center-expansion-flow-panel">
          <div className="panel-heading"><h2>Center Expansion</h2><span>{modeLabel}</span></div>
          <div className="center-expansion-stage">
            <div className="center-mode-row" aria-label="center type">
              <div className={frame.mode === "odd" ? "center-mode is-selected" : "center-mode"}><strong>odd</strong><span>expand(i, i)</span></div>
              <div className={frame.mode === "even" ? "center-mode is-selected" : "center-mode"}><strong>even</strong><span>expand(i, i + 1)</span></div>
            </div>
            <div className="center-string-scroll">
              <div className="center-string" aria-label={`string ${s}`}>
                {s.split("").map((char, index) => <StringCell key={index} char={char} index={index} frame={frame} />)}
              </div>
            </div>
            <div className={`center-range-caption ${frame.comparison ?? ""}`}>
              <span>l = {frame.l ?? "-"}</span><strong>{comparisonLabel(frame.comparison)}</strong><span>r = {frame.r ?? "-"}</span>
            </div>
            <div className="center-readout">
              <div><span>center</span><strong>{frame.i === null ? "-" : `i = ${frame.i}`}</strong></div>
              <div><span>local count</span><strong>{frame.localCount ?? "-"}</strong></div>
              <div><span>global res</span><strong>{frame.res}</strong></div>
            </div>
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>expand state</h3><div className="token-list"><span>i = {frame.i ?? "-"}</span><span>mode = {frame.mode ?? "-"}</span><span>l = {frame.l ?? "-"}</span><span>r = {frame.r ?? "-"}</span></div></div>
          <div className="state-block"><h3>found palindromes ({frame.palindromes.length})</h3><div className="token-list words">{frame.palindromes.length ? frame.palindromes.slice(-24).map((palindrome, index) => <span key={`${palindrome}-${index}`}>{palindrome}</span>) : <em>none yet</em>}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function StringCell({ char, index, frame }: { char: string; index: number; frame: ReturnType<typeof createPalindromicSubstringsDryRun>["frames"][number] }) {
  const isInMatchRange = frame.matchRange !== null && index >= frame.matchRange[0] && index <= frame.matchRange[1];
  const isActivePointer = frame.comparison === "match" && (index === frame.l || index === frame.r);
  const isMismatch = frame.comparison === "mismatch" && (index === frame.l || index === frame.r);
  const isCenter = frame.mode === "even" ? index === frame.i || index === (frame.i ?? -2) + 1 : index === frame.i;
  const labels = [index === frame.l ? "l" : "", index === frame.r ? "r" : ""].filter(Boolean).join(" / ");
  const className = ["center-string-cell", isCenter ? "is-center" : "", isInMatchRange ? "is-success" : "", isActivePointer ? "is-active" : "", isMismatch ? "is-mismatch" : ""].filter(Boolean).join(" ");

  return <div className={className}><span>index {index}</span><strong>{char}</strong><em>{labels || " "}</em></div>;
}

function comparisonLabel(comparison: ReturnType<typeof createPalindromicSubstringsDryRun>["frames"][number]["comparison"]) {
  if (comparison === "match") return "matching edges";
  if (comparison === "mismatch") return "mismatch";
  if (comparison === "out-of-bounds") return "outside string";
  if (comparison === "returned") return "returned to caller";
  return "center expansion";
}
