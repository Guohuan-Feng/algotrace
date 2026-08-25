import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, title } from "./data";
import type { ItineraryExample } from "./data";
import { createItineraryDryRun, formatRoute } from "./dryRun";
import type { ItineraryFrame, ItineraryTicket } from "./dryRun";

export default function ReconstructItineraryVisualizer({ onBack }: VisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(defaultExample.id);
  const [tickets, setTickets] = useState<string[][]>(cloneTickets(defaultExample.tickets));
  const [ticketsInput, setTicketsInput] = useState(JSON.stringify(defaultExample.tickets));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => createItineraryDryRun(tickets), [tickets]);
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

  function loadExample(example: ItineraryExample) {
    setSelectedExampleId(example.id);
    setTickets(cloneTickets(example.tickets));
    setTicketsInput(JSON.stringify(example.tickets));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed: unknown = JSON.parse(ticketsInput);
      if (!isValidTickets(parsed)) {
        setError("Use 1-12 ticket pairs, for example [[\"JFK\",\"SFO\"],[\"SFO\",\"ATL\"]].");
        return;
      }
      setSelectedExampleId(0);
      setTickets(cloneTickets(parsed));
      setStep(0);
      setPlaying(false);
      setError("");
    } catch {
      setError("Use valid JSON ticket pairs, for example [[\"JFK\",\"SFO\"]].");
    }
  }

  const positions = getAirportPositions(frame);

  return <main className="app-shell">
    <header className="topbar">
      <div><button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />Catalog</button><p className="eyebrow">AlgoTrace dry run</p><h1>{title}</h1></div>
      <div className="step-pill">Step {step + 1} / {dryRun.frames.length}</div>
    </header>
    <section className="workspace">
      <aside className="board-panel">
        <div className="example-switcher" aria-label="LeetCode examples"><span>LeetCode examples</span><div>{examples.map((example) => <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example)} type="button">{example.id}</button>)}</div></div>
        <div className="panel-heading"><h2>input tickets</h2><span>{tickets.length} flights</span></div>
        <div className="input-grid"><label>tickets JSON<textarea value={ticketsInput} onChange={(event) => setTicketsInput(event.target.value)} /></label>{error ? <p className="error">{error}</p> : null}<button className="command load" onClick={loadInput} type="button"><Upload size={16} />Load tickets</button></div>
        <div className="itinerary-legend"><span>white unused ticket</span><span>yellow heap top</span><span>green used ticket</span><span>blue DFS stack</span></div>
        <div className="expected-output"><span>{selectedExample ? `${selectedExample.label} output` : "Current result"}</span><code>{formatRoute(selectedExample?.output ?? frame.result ?? [])}</code></div>
      </aside>

      <section className="flow-panel itinerary-flow-panel">
        <div className="panel-heading"><h2>Lexicographic Euler Route</h2><span>{frame.current ? `dfs(${frame.current})` : "build graph"}</span></div>
        <div className="itinerary-stage">
          <div className="itinerary-graph" aria-label="Directed airport graph">
            <svg aria-hidden="true" className="itinerary-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs><marker id="itinerary-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" /></marker></defs>
              {frame.tickets.map((ticket) => <TicketEdge frame={frame} key={ticket.id} ticket={ticket} from={positions[ticket.from]} to={positions[ticket.to]} />)}
            </svg>
            {frame.airports.map((airport) => <AirportNode airport={airport} frame={frame} key={airport} position={positions[airport]} />)}
          </div>
          <section className="itinerary-heaps" aria-label="Airport min-heaps">
            <div className="itinerary-heaps-heading"><h3>graph[airport] min-heaps</h3><span>top is next flight</span></div>
            <div className="itinerary-heap-grid">{frame.airports.map((airport) => <div className={frame.current === airport ? "itinerary-heap is-current" : "itinerary-heap"} key={airport}><strong>{airport}</strong><span>{frame.graph[airport].length ? frame.graph[airport].map((destination, index) => <b className={index === 0 ? "is-top" : ""} key={`${airport}-${destination}-${index}`}>{destination}</b>) : <em>empty</em>}</span></div>)}</div>
          </section>
        </div>
      </section>

      <aside className="state-panel">
        <div className="state-sticky"><div className={`event-card ${frame.kind}`}><p className="eyebrow">{frame.phase}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div><StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} /></div>
        <div className="state-block"><h3>recursion stack</h3><div className="token-list words">{frame.stack.length ? frame.stack.map((airport, index) => <span key={`${airport}-${index}`}>dfs({airport})</span>) : <em>empty</em>}</div></div>
        <div className="state-block"><h3>res (postorder)</h3><div className="itinerary-route reverse">{frame.res.length ? frame.res.map((airport, index) => <span key={`${airport}-${index}`}>{airport}</span>) : <em>waiting to backtrack</em>}</div></div>
        <div className="state-block"><h3>final itinerary</h3><div className="itinerary-route">{frame.result ? frame.result.map((airport, index) => <span key={`${airport}-${index}`}>{airport}</span>) : <em>return res[::-1] at the end</em>}</div></div>
        <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} />
      </aside>
    </section>
  </main>;
}

function TicketEdge({ ticket, frame, from, to }: { ticket: ItineraryTicket; frame: ItineraryFrame; from: AirportPosition; to: AirportPosition }) {
  const isActive = frame.activeTicket?.id === ticket.id;
  const isUsed = frame.usedTicketIds.includes(ticket.id);
  return <line className={["itinerary-edge", isActive ? "is-active" : "", isUsed ? "is-used" : ""].filter(Boolean).join(" ")} markerEnd="url(#itinerary-arrow)" x1={from.x} x2={to.x} y1={from.y} y2={to.y} />;
}

function AirportNode({ airport, frame, position }: { airport: string; frame: ItineraryFrame; position: AirportPosition }) {
  const classes = ["itinerary-airport", airport === frame.current ? "is-current" : "", frame.stack.includes(airport) ? "is-stack" : "", frame.res.includes(airport) ? "is-returned" : ""].filter(Boolean).join(" ");
  return <div className={classes} style={{ left: `${position.x}%`, top: `${position.y}%` }}><strong>{airport}</strong><span>{airport === "JFK" ? "start" : frame.res.includes(airport) ? "appended" : frame.stack.includes(airport) ? "stack" : "airport"}</span></div>;
}

type AirportPosition = { x: number; y: number };

function getAirportPositions(frame: ItineraryFrame): Record<string, AirportPosition> {
  const outgoing = Object.fromEntries(frame.airports.map((airport) => [airport, [] as string[]])) as Record<string, string[]>;
  frame.tickets.forEach((ticket) => outgoing[ticket.from].push(ticket.to));
  const depth = new Map<string, number>([["JFK", 0]]);
  const queue = ["JFK"];
  while (queue.length) {
    const airport = queue.shift()!;
    outgoing[airport].sort().forEach((destination) => {
      if (!depth.has(destination)) {
        depth.set(destination, depth.get(airport)! + 1);
        queue.push(destination);
      }
    });
  }
  const maxDepth = Math.max(1, ...depth.values());
  const groups = new Map<number, string[]>();
  frame.airports.forEach((airport) => {
    const level = depth.get(airport) ?? maxDepth;
    groups.set(level, [...(groups.get(level) ?? []), airport]);
  });
  const positions: Record<string, AirportPosition> = {};
  groups.forEach((airports, level) => airports.sort().forEach((airport, index) => {
    positions[airport] = {
      x: ((index + 1) / (airports.length + 1)) * 100,
      y: 12 + (level / Math.max(maxDepth, 1)) * 76,
    };
  }));
  return positions;
}

function isValidTickets(value: unknown): value is string[][] {
  return Array.isArray(value) && value.length >= 1 && value.length <= 12 && value.every((ticket) => Array.isArray(ticket) && ticket.length === 2 && ticket.every((airport) => typeof airport === "string" && /^[A-Za-z]{1,5}$/.test(airport)));
}

function cloneTickets(tickets: string[][]) {
  return tickets.map((ticket) => [...ticket]);
}
