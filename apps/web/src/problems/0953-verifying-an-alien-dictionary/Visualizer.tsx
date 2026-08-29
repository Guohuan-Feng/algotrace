import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type AlienDictionaryInput } from "./data";
import { createAlienDictionaryDryRun } from "./dryRun";

export default function AlienDictionaryVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [input, setInput] = useState<AlienDictionaryInput>(defaultExample.input);
  const [wordsInput, setWordsInput] = useState(JSON.stringify(defaultExample.input.words));
  const [orderInput, setOrderInput] = useState(defaultExample.input.order);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createAlienDictionaryDryRun(input.words, input.order), [input]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)]!;
  const activePosition = frame.charIndex ?? -1;

  useEffect(() => { if (!playing || step >= dryRun.frames.length - 1) { if (step >= dryRun.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 720); return () => window.clearTimeout(timer); }, [dryRun.frames.length, playing, step]);
  function loadExample(example: (typeof examples)[number]) { setSelectedExampleId(example.id); setInput(example.input); setWordsInput(JSON.stringify(example.input.words)); setOrderInput(example.input.order); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const words = JSON.parse(wordsInput) as string[]; const order = orderInput.trim(); const uniqueOrder = new Set(order); if (!Array.isArray(words) || words.length < 1 || words.length > 8 || !words.every((word) => typeof word === "string" && /^[a-z]+$/.test(word)) || !/^[a-z]{26}$/.test(order) || uniqueOrder.size !== 26) throw new Error(); setSelectedExampleId(0); setInput({ words, order }); setStep(0); setPlaying(false); setError(""); } catch { setError("Use lowercase words JSON and a 26-letter unique order string."); } }

  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div><div className="panel-heading"><h2>input</h2><span>{input.words.length} words</span></div><div className="input-grid"><label>words JSON<textarea value={wordsInput} onChange={(event) => setWordsInput(event.target.value)} /></label><label>order<input value={orderInput} onChange={(event) => setOrderInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load dictionary</button></div><div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{String(selectedExample?.output ?? frame.result ?? "pending")}</code></div></aside>
    <section className="flow-panel alien-flow-panel"><div className="panel-heading"><h2>First-Difference Comparison</h2><span>{frame.pairIndex === null ? "build rank" : `pair ${frame.pairIndex + 1}`}</span></div><div className="alien-stage"><div className="alien-pair"><WordRow label="w1" word={frame.leftWord ?? ""} activePosition={activePosition} activeCharacter={frame.leftChar} /><div className="alien-compare">{frame.leftChar && frame.rightChar ? `${frame.rank[frame.leftChar]} ${frame.rank[frame.leftChar] < frame.rank[frame.rightChar] ? "<" : frame.rank[frame.leftChar] > frame.rank[frame.rightChar] ? ">" : "="} ${frame.rank[frame.rightChar]}` : "compare"}</div><WordRow label="w2" word={frame.rightWord ?? ""} activePosition={activePosition} activeCharacter={frame.rightChar} /></div><div className="alien-order"><h3>alien rank</h3><div>{frame.order.split("").map((character, index) => <span className={character === frame.leftChar || character === frame.rightChar ? "is-active" : ""} key={character}><b>{character}</b><small>{index}</small></span>)}</div></div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>current pair</h3><div className="token-list">{frame.leftWord ? <><span>w1 = {frame.leftWord}</span><span>w2 = {frame.rightWord}</span></> : <em>not comparing yet</em>}</div></div><div className="state-block"><h3>indices</h3><div className="token-list"><span>i = {frame.pairIndex ?? "-"}</span><span>j = {frame.charIndex ?? "-"}</span></div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function WordRow({ label, word, activePosition, activeCharacter }: { label: string; word: string; activePosition: number; activeCharacter: string | null }) { return <div className="alien-word"><span>{label}</span><div>{word ? word.split("").map((character, index) => <strong className={index === activePosition && character === activeCharacter ? "is-active" : ""} key={`${character}-${index}`}>{character}</strong>) : <em>waiting</em>}</div></div>; }
