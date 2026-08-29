import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title, type MergeKListsExample } from "./data";
import { createMergeKListsDryRun } from "./dryRun";

export default function MergeKListsVisualizer({ onBack }: VisualizerProps) {
  const [exampleId, setExampleId] = useState(defaultExample.id);
  const [lists, setLists] = useState(defaultExample.input);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const run = useMemo(() => createMergeKListsDryRun(lists), [lists]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const selected = examples.find((example) => example.id === exampleId);
  const heapIds = new Set(frame.heap.map((item) => item.id));

  useEffect(() => { if (!playing || step >= run.frames.length - 1) { if (step >= run.frames.length - 1) setPlaying(false); return; } const timer = window.setTimeout(() => setStep((current) => current + 1), 650); return () => window.clearTimeout(timer); }, [playing, run.frames.length, step]);
  function load(example: MergeKListsExample) { setExampleId(example.id); setLists(example.input); setText(JSON.stringify(example.input)); setStep(0); setPlaying(false); setError(""); }
  function loadInput() { try { const parsed: unknown = JSON.parse(text); if (!Array.isArray(parsed) || parsed.length > 6 || !parsed.every((list) => Array.isArray(list) && list.every((value) => typeof value === "number" && Number.isFinite(value)) && list.every((value, index) => index === 0 || list[index - 1] <= value))) throw new Error(); setExampleId(0); setLists(parsed as number[][]); setStep(0); setPlaying(false); setError(""); } catch { setError("Use up to 6 sorted lists, for example [[1,4,5],[1,3,4],[2,6]]."); } }
  return <main className="app-shell"><header className="topbar"><div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div><div className="step-pill">Step {step + 1} / {run.frames.length}</div></header><section className="workspace">
    <aside className="board-panel"><div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={example.id === exampleId ? "active" : ""} key={example.id} onClick={() => load(example)} type="button">{example.id}</button>)}</div></div><div className="input-grid"><label>lists JSON<textarea aria-label="lists input JSON" value={text} onChange={(event) => setText(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load lists</button></div><div className="expected-output"><span>{selected ? `${selected.label} output` : "Current result"}</span><code>{JSON.stringify(frame.result)}</code></div></aside>
    <section className="flow-panel merge-lists-flow-panel"><div className="panel-heading"><h2>K-way heap merge</h2><span>merged = {frame.result.length}</span></div><div className="merge-lists-stage">{lists.map((values, listIndex) => <SourceList key={listIndex} activeId={frame.activeId} heapIds={heapIds} listIndex={listIndex} nextId={frame.nextId} values={values} />)}<ListRow label="merged" resultIds={frame.resultIds} values={frame.result} /><div className="product-phase"><span>current operation</span><strong>{frame.phase}</strong><p>{frame.detail}</p></div></div></section>
    <aside className="state-panel"><div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={run.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div><div className="state-block"><h3>min-heap</h3><div className="token-list">{frame.heap.length ? frame.heap.map((item) => <span key={item.id}>({item.value}, L{item.listIndex + 1})</span>) : <em>empty</em>}</div></div><CodeTrace activeLines={frame.activeLines} codeLines={codeLines} /></aside>
  </section></main>;
}

function SourceList({ activeId, heapIds, listIndex, nextId, values }: { activeId: string | null; heapIds: Set<string>; listIndex: number; nextId: string | null; values: number[] }) { return <div className="merge-list-row"><span>list {listIndex + 1}</span><div>{values.length ? values.map((value, index) => { const id = `list-${listIndex}-${index}`; return <div className={[id === activeId ? "is-current" : "", id === nextId ? "is-next" : "", heapIds.has(id) ? "is-heap" : ""].filter(Boolean).join(" ")} key={id}><strong>{value}</strong>{index < values.length - 1 ? <ArrowRight aria-hidden="true" size={15} /> : null}</div>; }) : <em>None</em>}</div></div>; }
function ListRow({ label, resultIds, values }: { label: string; resultIds: string[]; values: number[] }) { return <div className="merge-list-row is-result"><span>{label}</span><div>{values.length ? values.map((value, index) => <div className={index === values.length - 1 ? "is-current" : ""} key={resultIds[index] ?? index}><strong>{value}</strong>{index < values.length - 1 ? <ArrowRight aria-hidden="true" size={15} /> : null}</div>) : <em>None</em>}</div></div>; }
