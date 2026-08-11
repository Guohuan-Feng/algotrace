import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { ExtraCharactersExample } from "./data";
import { createExtraCharactersDryRun } from "./dryRun";

export default function ExtraCharactersVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [s, setS] = useState(defaultExample.s);
  const [sInput, setSInput] = useState(defaultExample.s);
  const [dictionary, setDictionary] = useState(defaultExample.dictionary);
  const [dictionaryInput, setDictionaryInput] = useState(JSON.stringify(defaultExample.dictionary));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createExtraCharactersDryRun(s, dictionary), [dictionary, s]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 580);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: ExtraCharactersExample) {
    setSelectedExampleId(example.id);
    setS(example.s);
    setSInput(example.s);
    setDictionary(example.dictionary);
    setDictionaryInput(JSON.stringify(example.dictionary));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedDictionary = JSON.parse(dictionaryInput);
      if (!sInput || sInput.length > 18) {
        setError("Use a non-empty string with at most 18 characters.");
        return;
      }
      if (!Array.isArray(parsedDictionary) || parsedDictionary.length > 20 || !parsedDictionary.every((word) => typeof word === "string" && word.length > 0)) {
        setError("Use a JSON array of up to 20 non-empty words.");
        return;
      }
      setSelectedExampleId(0);
      setS(sInput);
      setDictionary(parsedDictionary);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid dictionary JSON, for example [\"leet\", \"code\"].");
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
          <div className="example-switcher" aria-label="examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)}>{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>input</h2><span>n = {s.length}</span></div>
          <div className="input-grid">
            <label>s<input value={sInput} onChange={(event) => setSInput(event.target.value)} /></label>
            <label>dictionary JSON<textarea value={dictionaryInput} onChange={(event) => setDictionaryInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput}><Upload size={16} />Load input</button>
          </div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>
        <section className="flow-panel extra-characters-flow-panel">
          <div className="panel-heading"><h2>Prefix DP</h2><span>dp[{s.length}] = {frame.dp[s.length]}</span></div>
          <ExtraCharactersStage frame={frame} />
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>pointers</h3><div className="token-list"><span>i = {frame.i ?? "none"}</span><span>j = {frame.j ?? "none"}</span><span>s[j:i] = {frame.candidate ? `"${frame.candidate}"` : "none"}</span><span>{frame.matchedWord ? `match = "${frame.matchedWord}"` : "no match"}</span></div></div>
          <div className="state-block"><h3>dictionary</h3><div className="token-list words">{dictionary.map((word) => <span key={word}>{word}</span>)}</div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function ExtraCharactersStage({ frame }: { frame: ReturnType<typeof createExtraCharactersDryRun>["frames"][number] }) {
  const { i, j, matchedWord, s } = frame;
  const candidateStart = j ?? -1;
  const candidateEnd = i ?? -1;

  return (
    <div className="extra-characters-stage">
      <div className="extra-explanation"><span>prefix length</span><strong>{i === null ? "ready" : `i = ${i}`}</strong><code>{frame.candidate ? `s[${j}:${i}] = "${frame.candidate}"` : "Choose a prefix length to begin."}</code></div>
      <div className="extra-scroll" aria-label="string and dynamic-programming state">
        <div className="extra-row-label">string s</div>
        <div className="extra-strip">
          <div className="extra-start-cell"><span>0</span><strong>^</strong></div>
          {Array.from(s).map((char, index) => {
            const position = index + 1;
            const inCandidate = candidateStart >= 0 && position > candidateStart && position <= candidateEnd;
            return <div className={["extra-char-cell", position === i ? "is-current" : "", inCandidate ? "is-candidate" : "", inCandidate && matchedWord ? "is-match" : ""].filter(Boolean).join(" ")} key={`${char}-${index}`}><span>{position}</span><strong>{char}</strong></div>;
          })}
        </div>
        <div className="extra-row-label">minimum extras dp</div>
        <div className="extra-strip">{frame.dp.map((value, index) => <div className={["extra-dp-cell", index === i ? "is-current" : "", index === j ? "is-start" : "", index === i && matchedWord ? "is-match" : ""].filter(Boolean).join(" ")} key={index}><span>dp[{index}]</span><strong>{value}</strong></div>)}</div>
      </div>
      <div className={matchedWord ? "extra-match-note is-match" : "extra-match-note"}>{matchedWord ? `"${matchedWord}" contributes 0 extra characters.` : "Each prefix keeps its best extra-character count."}</div>
    </div>
  );
}
