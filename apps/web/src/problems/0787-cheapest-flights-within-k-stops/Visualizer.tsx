import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { CheapestFlightExample } from "./data";
import { createCheapestFlightsDryRun } from "./dryRun";
import type { CheapestFlightsFrame, Flight } from "./dryRun";

export default function CheapestFlightsVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [n, setN] = useState(defaultExample.n);
  const [flights, setFlights] = useState(copyFlights(defaultExample.flights));
  const [src, setSrc] = useState(defaultExample.src);
  const [dst, setDst] = useState(defaultExample.dst);
  const [k, setK] = useState(defaultExample.k);
  const [nInput, setNInput] = useState(String(defaultExample.n));
  const [flightsInput, setFlightsInput] = useState(JSON.stringify(defaultExample.flights));
  const [srcInput, setSrcInput] = useState(String(defaultExample.src));
  const [dstInput, setDstInput] = useState(String(defaultExample.dst));
  const [kInput, setKInput] = useState(String(defaultExample.k));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createCheapestFlightsDryRun(n, flights, src, dst, k), [dst, flights, k, n, src]);
  const frame = dryRun.frames[Math.min(step, dryRun.frames.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 690);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(example: CheapestFlightExample) {
    setSelectedExampleId(example.id);
    setN(example.n);
    setFlights(copyFlights(example.flights));
    setSrc(example.src);
    setDst(example.dst);
    setK(example.k);
    setNInput(String(example.n));
    setFlightsInput(JSON.stringify(example.flights));
    setSrcInput(String(example.src));
    setDstInput(String(example.dst));
    setKInput(String(example.k));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsedN = Number(nInput);
      const parsedFlights: unknown = JSON.parse(flightsInput);
      const parsedSrc = Number(srcInput);
      const parsedDst = Number(dstInput);
      const parsedK = Number(kInput);
      if (!isValidInput(parsedN, parsedFlights, parsedSrc, parsedDst, parsedK)) {
        setError("Use n 2-8, flights like [[0,1,100]], valid airports, and k 0-7.");
        return;
      }
      setSelectedExampleId(0);
      setN(parsedN);
      setFlights(copyFlights(parsedFlights));
      setSrc(parsedSrc);
      setDst(parsedDst);
      setK(parsedK);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid flights JSON, for example [[0,1,100],[1,2,100]].");
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
          <div className="panel-heading"><h2>input flights</h2><span>n = {n}</span></div>
          <div className="input-grid flight-input-grid">
            <div className="flight-input-row"><label>n<input value={nInput} onChange={(event) => setNInput(event.target.value)} /></label><label>src<input value={srcInput} onChange={(event) => setSrcInput(event.target.value)} /></label><label>dst<input value={dstInput} onChange={(event) => setDstInput(event.target.value)} /></label><label>k<input value={kInput} onChange={(event) => setKInput(event.target.value)} /></label></div>
            <label>flights JSON<textarea value={flightsInput} onChange={(event) => setFlightsInput(event.target.value)} /></label>
            {error ? <p className="error">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load flights</button>
          </div>
          <div className="flight-legend"><span>yellow current flight</span><span>green price improved</span><span>red source unreachable</span><span>blue source / destination</span></div>
          <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{selectedExample?.output ?? frame.result ?? "pending"}</code></div>
        </aside>

        <section className="flow-panel flights-flow-panel">
          <div className="panel-heading"><h2>Bellman-Ford: one flight per round</h2><span>round {frame.round} / {k + 1}</span></div>
          <div className="flights-stage">
            <AirportGraph frame={frame} />
            <DistanceRows frame={frame} />
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
          <div className="state-block"><h3>variables</h3><div className="token-list"><span>round = {frame.round}</span><span>max edges = {frame.round}</span><span>k = {frame.k}</span><span>src = {frame.src}</span><span>dst = {frame.dst}</span></div></div>
          <div className="state-block"><h3>current flight</h3><div className="token-list">{frame.flight ? <span>{frame.flight[0]} -&gt; {frame.flight[1]} (${frame.flight[2]})</span> : <em>waiting for a flight</em>}{frame.candidate !== null ? <span>candidate = ${frame.candidate}</span> : null}</div></div>
          <div className="state-block"><h3>why temp matters</h3><p className="flight-note">Every flight reads the old <code>dist</code>. Only after the entire round does <code>dist = temp</code>, so one round adds at most one edge.</p></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
        </aside>
      </section>
    </main>
  );
}

function AirportGraph({ frame }: { frame: CheapestFlightsFrame }) {
  const positions = airportPositions(frame.n);
  const current = frame.flight;
  return <section className="flight-graph" aria-label="Airport graph and flights">
    <svg viewBox="0 0 100 100" role="img" aria-label="Airports and directed flights">
      <defs><marker id="flight-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="5.8" refY="3.5"><path d="M0,0 L7,3.5 L0,7 Z" fill="context-stroke" /></marker></defs>
      {frame.flights.map((flight, index) => <FlightEdge flight={flight} frame={frame} from={positions[flight[0]]} index={index} key={`${flight.join("-")}-${index}`} to={positions[flight[1]]} />)}
      {Array.from({ length: frame.n }, (_, airport) => {
        const classes = ["airport-node", airport === frame.src ? "is-source" : "", airport === frame.dst ? "is-destination" : "", current?.[0] === airport ? "is-current-from" : "", current?.[1] === airport ? "is-current-to" : ""].filter(Boolean).join(" ");
        const position = positions[airport];
        return <g className={classes} key={airport} transform={`translate(${position.x} ${position.y})`}><circle r="7.5" /><text y="1.4">{airport}</text><text className="airport-distance" y="13">{formatCost(frame.dist[airport])}</text></g>;
      })}
    </svg>
    <div className="airport-graph-caption"><span>airport label</span><strong>old dist price below each airport</strong></div>
  </section>;
}

function FlightEdge({ flight, frame, from, index, to }: { flight: Flight; frame: CheapestFlightsFrame; from: Position; index: number; to: Position }) {
  const isCurrent = sameFlight(frame.flight, flight);
  const classes = ["flight-edge", isCurrent ? "is-current" : "", isCurrent && frame.phase === "skip" ? "is-skipped" : "", isCurrent && frame.phase === "relax" && frame.updated ? "is-improved" : ""].filter(Boolean).join(" ");
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.max(1, Math.hypot(deltaX, deltaY));
  const lane = (index % 4) - 1.5;
  const curve = lane * 8;
  const controlX = (from.x + to.x) / 2 - (deltaY / length) * curve;
  const controlY = (from.y + to.y) / 2 + (deltaX / length) * curve;
  const labelX = (from.x + (2 * controlX) + to.x) / 4;
  const labelY = (from.y + (2 * controlY) + to.y) / 4;
  return <g className={classes}><path d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`} markerEnd="url(#flight-arrow)" /><text x={labelX} y={labelY}>{flight[2]}</text><title>{`${flight[0]} -> ${flight[1]}: $${flight[2]}`}</title></g>;
}

function DistanceRows({ frame }: { frame: CheapestFlightsFrame }) {
  return <section className="distance-panel" aria-label="Distance arrays">
    <DistanceRow activeAirport={frame.flight?.[0] ?? null} costs={frame.dist} label="dist (read only this round)" />
    <DistanceRow activeAirport={frame.flight?.[1] ?? null} costs={frame.temp} label="temp (write this round)" updated={frame.phase === "relax" && frame.updated ? frame.flight?.[1] ?? null : null} />
  </section>;
}

function DistanceRow({ activeAirport, costs, label, updated = null }: { activeAirport: number | null; costs: number[] | null; label: string; updated?: number | null }) {
  return <div className="distance-row"><h3>{label}</h3><div>{costs ? costs.map((cost, airport) => <span className={[airport === activeAirport ? "is-active" : "", airport === updated ? "is-updated" : ""].filter(Boolean).join(" ")} key={airport}><em>{airport}</em><strong>{formatCost(cost)}</strong></span>) : <p>Created at the start of the next round.</p>}</div></div>;
}

type Position = { x: number; y: number };

function airportPositions(n: number): Position[] {
  if (n === 2) return [{ x: 27, y: 50 }, { x: 73, y: 50 }];
  return Array.from({ length: n }, (_, airport) => {
    const angle = -Math.PI / 2 + ((Math.PI * 2 * airport) / n);
    return { x: 50 + Math.cos(angle) * 33, y: 50 + Math.sin(angle) * 32 };
  });
}

function formatCost(cost: number) {
  return cost === Infinity ? "∞" : `$${cost}`;
}

function sameFlight(left: Flight | null, right: Flight) {
  return left !== null && left[0] === right[0] && left[1] === right[1] && left[2] === right[2];
}

function isValidInput(n: number, flights: unknown, src: number, dst: number, k: number): flights is number[][] {
  return Number.isInteger(n) && n >= 2 && n <= 8 &&
    Number.isInteger(src) && src >= 0 && src < n &&
    Number.isInteger(dst) && dst >= 0 && dst < n &&
    Number.isInteger(k) && k >= 0 && k <= 7 &&
    Array.isArray(flights) && flights.length <= 20 && flights.every((flight) =>
      Array.isArray(flight) && flight.length === 3 && flight.every(Number.isInteger) &&
      flight[0] >= 0 && flight[0] < n && flight[1] >= 0 && flight[1] < n && flight[2] > 0 && flight[2] <= 10_000,
    );
}

function copyFlights(flights: number[][]) {
  return flights.map((flight) => [...flight]);
}
