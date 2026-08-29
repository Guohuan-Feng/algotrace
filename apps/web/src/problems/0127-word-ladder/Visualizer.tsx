import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type WordLadderInput } from "./data";
import { createWordLadderDryRun } from "./dryRun";

export default function WordLadderVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(defaultExample.id);
  const [input, setInput] = useState<WordLadderInput>(defaultExample.input);
  const [beginWordInput, setBeginWordInput] = useState(defaultExample.input.beginWord);
  const [endWordInput, setEndWordInput] = useState(defaultExample.input.endWord);
  const [wordListInput, setWordListInput] = useState(JSON.stringify(defaultExample.input.wordList));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createWordLadderDryRun(input.beginWord, input.endWord, input.wordList), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const currentWord = frame.current ?? input.beginWord;
  const candidateWord = frame.candidate ?? currentWord;

  useEffect(() => {
    if (!playing || step >= dryRun.frames.length - 1) {
      if (step >= dryRun.frames.length - 1) setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((current) => current + 1), 380);
    return () => window.clearTimeout(id);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: (typeof examples)[number]) {
    setSelectedExampleId(example.id);
    setInput(example.input);
    setBeginWordInput(example.input.beginWord);
    setEndWordInput(example.input.endWord);
    setWordListInput(JSON.stringify(example.input.wordList));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const wordList = JSON.parse(wordListInput) as string[];
      const validWord = (word: unknown) => typeof word === "string" && /^[a-z]+$/.test(word);
      if (!validWord(beginWordInput) || !validWord(endWordInput) || beginWordInput.length !== endWordInput.length || !Array.isArray(wordList) || wordList.length > 24 || !wordList.every((word) => validWord(word) && word.length === beginWordInput.length)) throw new Error();
      setSelectedExampleId(0);
      setInput({ beginWord: beginWordInput, endWord: endWordInput, wordList });
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use lowercase words of one equal length and a JSON list up to 24 words.");
    }
  }

  return <main className="app-shell">
    <header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header>
    <section className="workspace">
      <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>{input.beginWord} - {input.endWord}</span></div><div className="input-grid"><label>beginWord<input value={beginWordInput} onChange={(event) => setBeginWordInput(event.target.value)} /></label><label>endWord<input value={endWordInput} onChange={(event) => setEndWordInput(event.target.value)} /></label><label>wordList JSON<textarea value={wordListInput} onChange={(event) => setWordListInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load words</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div></aside>
      <section className="flow-panel ladder-flow-panel"><div className="panel-heading"><h2>One-Letter BFS Transform</h2><span>{frame.step === null ? "prepare search" : `current step = ${frame.step}`}</span></div><div className="ladder-stage"><div className="ladder-pair"><WordCells label="current" word={currentWord} activeIndex={null} /><div className="ladder-arrow">to</div><WordCells label="candidate" word={candidateWord} activeIndex={frame.index} /></div><div className="ladder-readout"><span>target <strong>{input.endWord}</strong></span><span>index <strong>{frame.index ?? "-"}</strong></span><span>letter <strong>{frame.letter ?? "-"}</strong></span></div><div className="ladder-dictionary"><p>word set</p><div>{frame.words.map((word) => <span className={[frame.visited.includes(word) ? "is-visited" : "", frame.queue.some(([queued]) => queued === word) ? "is-queued" : "", word === input.endWord ? "is-target" : "", word === frame.current ? "is-current" : ""].filter(Boolean).join(" ")} key={word}>{word}</span>)}</div></div></div></section>
      <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>queue</h3><div className="token-list words">{frame.queue.length ? frame.queue.map(([word, distance], index) => <span key={`${word}-${distance}-${index}`}>{word}@{distance}</span>) : <em>empty</em>}</div></div><div className="state-block"><h3>visited ({frame.visited.length})</h3><div className="token-list words">{frame.visited.length ? frame.visited.map((word) => <span key={word}>{word}</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
    </section>
  </main>;
}

function WordCells({ label, word, activeIndex }: { label: string; word: string; activeIndex: number | null }) {
  return <div className="ladder-word"><span>{label}</span><div>{word.split("").map((letter, index) => <strong className={activeIndex === index ? "is-active" : ""} key={`${letter}-${index}`}>{letter}</strong>)}</div></div>;
}
