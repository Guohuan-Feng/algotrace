import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../components/CodeTrace";
import { StepControls } from "../../components/StepControls";
import type { Cell, VisualizerProps } from "../../types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { WallsAndGatesExample } from "./data";
import { createWallsAndGatesDryRun } from "./dryRun";

const INF = 2147483647;
const cellKey = (cell: Cell | null) => (cell ? `${cell[0]}-${cell[1]}` : "");

export function WallsAndGatesVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [rooms, setRooms] = useState(defaultExample.rooms);
  const [roomsInput, setRoomsInput] = useState(JSON.stringify(defaultExample.rooms));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createWallsAndGatesDryRun(rooms), [rooms]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];
  const cols = rooms[0]?.length ?? 1;

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 650);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: WallsAndGatesExample) {
    setSelectedExampleId(example.id);
    setRooms(example.rooms);
    setRoomsInput(JSON.stringify(example.rooms));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(roomsInput);
      if (!isRectangularIntegerMatrix(parsed)) {
        setError("Use a rectangular integer matrix from 1 x 1 to 5 x 5. Use 2147483647 for INF.");
        return;
      }
      setSelectedExampleId(0);
      setRooms(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON, for example [[2147483647,0],[-1,2147483647]].");
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
          <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
          <div className="panel-heading"><h2>rooms</h2><span>{rooms.length} x {cols}</span></div>
          <div className="input-grid">
            <label>rooms JSON<textarea value={roomsInput} onChange={(event) => setRoomsInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load rooms</button>
          </div>
          <div className="grid-legend" aria-label="rooms legend"><span><i className="legend-square gate" />gate 0</span><span><i className="legend-square wall" />wall -1</span><span><i className="legend-square room" />INF</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current rooms"}</span><code>{JSON.stringify(selectedExample?.output ?? frame.result ?? frame.rooms)}</code></div>
        </aside>
        <section className="flow-panel grid-traversal-flow-panel">
          <div className="panel-heading"><h2>Multi-source BFS</h2><span>queue: {frame.queue.length}</span></div>
          <div className="grid-traversal-wrap">
            <div className="grid-traversal-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {frame.rooms.flatMap((row, i) => row.map((value, j) => {
                const key = `${i}-${j}`;
                const className = ["grid-traversal-cell", value === -1 ? "is-wall" : "", value === 0 ? "is-source" : "", value === INF ? "is-unfilled" : "", cellKey(frame.current) === key ? "is-current" : "", cellKey(frame.updated) === key ? "is-updated" : ""].filter(Boolean).join(" ");
                return <div className={className} key={key}><strong>{value === -1 ? "WALL" : value === INF ? "INF" : value}</strong><span>({i}, {j})</span></div>;
              }))}
            </div>
          </div>
        </section>
        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.kind}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>queue</h3><div className="token-list">{frame.queue.length ? frame.queue.map(([i, j], index) => <span key={`${i}-${j}-${index}`}>({i}, {j})</span>) : <em>empty</em>}</div></div>
          <div className="state-block"><h3>coordinates</h3><div className="token-list"><span>i, j = {formatCell(frame.current)}</span><span>ni, nj = {formatCell(frame.target)}</span></div></div>
          <div className="state-block"><h3>rooms</h3><pre className="matrix-state">{JSON.stringify(frame.rooms)}</pre></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function isRectangularIntegerMatrix(value: unknown): value is number[][] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 5 && value.every((row) => Array.isArray(row) && row.length >= 1 && row.length <= 5 && row.length === value[0]?.length && row.every(Number.isInteger));
}

function formatCell(cell: Cell | null) {
  return cell ? `(${cell[0]}, ${cell[1]})` : "none";
}
