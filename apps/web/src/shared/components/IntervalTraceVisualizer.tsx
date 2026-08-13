import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Upload } from "lucide-react";
import { CodeTrace } from "./CodeTrace";
import { StepControls } from "./StepControls";
import type { VisualizerProps } from "../types";
import type { IntervalItem, IntervalTraceDefinition, IntervalTraceFrame } from "../intervals/types";

type IntervalTraceVisualizerProps = VisualizerProps & {
  definition: IntervalTraceDefinition;
};

export function IntervalTraceVisualizer({ definition, onBack }: IntervalTraceVisualizerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState(definition.defaultExample.id);
  const [input, setInput] = useState<unknown>(definition.defaultExample.input);
  const [inputText, setInputText] = useState(JSON.stringify(definition.defaultExample.input, null, 2));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const selectedExample = definition.examples.find((example) => example.id === selectedExampleId);
  const dryRun = useMemo(() => definition.createDryRun(input), [definition, input]);
  const frame = dryRun.frames[Math.min(step, Math.max(0, dryRun.frames.length - 1))];
  const lessonUrl = `https://algorithm-learning-eight.vercel.app/?problem=${definition.order}#lesson-detail`;

  useEffect(() => {
    if (!playing) return;
    if (step >= dryRun.frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 720);
    return () => window.clearTimeout(timer);
  }, [dryRun.frames.length, playing, step]);

  function loadExample(exampleId: number) {
    const example = definition.examples.find((item) => item.id === exampleId);
    if (!example) return;
    setSelectedExampleId(example.id);
    setInput(example.input);
    setInputText(JSON.stringify(example.input, null, 2));
    setStep(0);
    setPlaying(false);
    setError("");
  }

  function loadInput() {
    try {
      const parsed = JSON.parse(inputText);
      // Validate before changing the active trace so an invalid attempt never destroys it.
      definition.createDryRun(parsed);
      setSelectedExampleId(0);
      setInput(parsed);
      setStep(0);
      setPlaying(false);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "请输入有效的 JSON。" );
    }
  }

  return (
    <main className="app-shell interval-trace-shell">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />题库</button>
          <p className="eyebrow">扫描线基础算法 · 第 {String(definition.order).padStart(2, "0")} 题</p>
          <h1>{definition.cnTitle}</h1>
          <p className="interval-cn-title">{definition.title}</p>
        </div>
        <div className="interval-header-actions">
          <a className="lesson-link" href={lessonUrl} target="_blank" rel="noreferrer">
            查看 Python 题解 <ExternalLink size={15} />
          </a>
          <div className="step-pill">步骤 {step + 1} / {dryRun.frames.length}</div>
        </div>
      </header>

      <section className="workspace">
        <aside className="board-panel interval-input-panel">
          <div className="example-switcher" aria-label="示例">
            <span>示例</span>
            <div>{definition.examples.map((example) => (
              <button className={selectedExampleId === example.id ? "active" : ""} key={example.id} onClick={() => loadExample(example.id)} type="button">
                {example.id}
              </button>
            ))}</div>
          </div>

          <div className="panel-heading"><h2>输入</h2><span>JSON</span></div>
          <p className="input-help">{definition.inputHint}</p>
          <label className="interval-input-label">
            <span>自定义输入</span>
            <textarea aria-label="自定义 JSON 输入" value={inputText} onChange={(event) => setInputText(event.target.value)} />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="command load" onClick={loadInput} type="button"><Upload size={16} />载入输入</button>

          <div className="expected-output interval-expected-output">
            <span>{selectedExample ? `${selectedExample.label} 的输出` : "当前输出"}</span>
            <code>{selectedExample?.output ?? String(frame.result ?? "等待结果")}</code>
          </div>
          <div className="interval-rule-card">
            <span>当前阶段</span>
            <strong>{frame.phase}</strong>
            <p>{frame.invariant}</p>
          </div>
        </aside>

        <section className="flow-panel interval-flow-panel">
          <div className="panel-heading"><h2>区间执行过程</h2><span>{frame.phase}</span></div>
          <IntervalTraceStage frame={frame} />
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`}><p className="eyebrow">{frameKindLabel(frame.kind)}</p><h2>{frame.title}</h2><p>{frame.detail}</p></div>
            <StepControls frameCount={dryRun.frames.length} playing={playing} step={step} onPlayingChange={setPlaying} onStepChange={setStep} />
          </div>
          <div className="state-block"><h3>状态</h3><div className="token-list">{frame.pointers.length ? frame.pointers.map(([name, value]) => <span key={`${name}-${value}`}>{name} = {value}</span>) : <em>没有可变状态</em>}</div></div>
          <div className="state-block"><h3>不变量</h3><p className="interval-invariant">{frame.invariant || "下一帧会建立不变量。"}</p></div>
          {frame.events?.length ? <div className="state-block"><h3>事件规则</h3><p className="interval-invariant">同一时刻，结束事件排在开始事件之前，因此资源会先被释放。</p></div> : null}
          <CodeTrace activeLines={frame.activeLines} codeLines={definition.codeLines} title="代码执行" />
        </aside>
      </section>
    </main>
  );
}

function IntervalTraceStage({ frame }: { frame: IntervalTraceFrame }) {
  const domain = useMemo(() => getDomain(frame), [frame]);
  const active = new Set(frame.currentIds);
  const compared = new Set(frame.comparedIds);
  const accepted = new Set(frame.acceptedIds);
  const rejected = new Set(frame.rejectedIds);
  const covered = new Set(frame.coveredIds);

  return (
    <div className="interval-stage">
      <div className="interval-axis" aria-label="区间时间轴刻度">
        {makeTicks(domain.min, domain.max).map((tick) => <span key={tick} style={{ left: `${position(tick, domain)}%` }}>{formatNumber(tick)}</span>)}
      </div>
      <div className="interval-lanes">
        {frame.lanes.map((currentLane) => (
          <IntervalLaneView
            accepted={accepted}
            active={active}
            compared={compared}
            covered={covered}
            domain={domain}
            frame={frame}
            key={currentLane.id}
            rejected={rejected}
            tone={currentLane.tone ?? "input"}
            label={currentLane.label}
            items={currentLane.intervals}
          />
        ))}
      </div>

      {frame.events?.length ? <section className="interval-events">
        <div className="compact-heading"><h3>排序后的事件</h3><span>同一时刻 −1 在 +1 前</span></div>
        <div className="event-list">
          {frame.events.map((event, index) => <div className={index === frame.eventIndex ? "interval-event active" : "interval-event"} key={event.id}><strong>{event.time}</strong><span className={event.delta < 0 ? "negative" : "positive"}>{event.delta > 0 ? "+1" : "−1"}</span><em>{event.label}</em></div>)}
        </div>
      </section> : null}

      <section className="interval-output">
        <div className="compact-heading"><h3>{frame.outputLabel}</h3>{frame.result !== null && frame.result !== undefined ? <span>答案：{String(frame.result)}</span> : null}</div>
        <div className="result-track" style={{ minHeight: `${trackHeight(layoutIntervals(frame.output).rows)}px` }}>
          {frame.output.length ? layoutIntervals(frame.output).items.map(({ item, row }) => <IntervalBlock accepted current={false} compared={false} covered={false} domain={domain} item={item} key={item.id} rejected={false} row={row} />) : <p>等待生成输出区间</p>}
        </div>
      </section>
    </div>
  );
}

function IntervalLaneView({ accepted, active, compared, covered, domain, frame, items, label, rejected, tone }: {
  accepted: Set<string>;
  active: Set<string>;
  compared: Set<string>;
  covered: Set<string>;
  domain: { min: number; max: number };
  frame: IntervalTraceFrame;
  items: IntervalItem[];
  label: string;
  rejected: Set<string>;
  tone: string;
}) {
  const layout = layoutIntervals(items);
  return (
    <section className={`interval-lane tone-${tone}`}>
      <div className="interval-lane-label">{label}</div>
      <div className="interval-track" style={{ minHeight: `${trackHeight(layout.rows)}px` }}>
        {frame.mask ? <div className="interval-mask" style={intervalStyle(frame.mask, domain)} title={`删除 ${frame.mask.label ?? ""}`} /> : null}
        {layout.items.map(({ item, row }) => (
          <IntervalBlock
            accepted={accepted.has(item.id)}
            compared={compared.has(item.id)}
            covered={covered.has(item.id)}
            current={active.has(item.id)}
            domain={domain}
            item={item}
            key={item.id}
            rejected={rejected.has(item.id)}
            row={row}
          />
        ))}
        {frame.sweep !== null && frame.sweep !== undefined ? <div className="sweep-cursor" style={{ left: `${position(frame.sweep, domain)}%` }}><span>{formatNumber(frame.sweep)}</span></div> : null}
      </div>
    </section>
  );
}

function IntervalBlock({ accepted, compared, covered, current, domain, item, rejected, row }: {
  accepted: boolean;
  compared: boolean;
  covered: boolean;
  current: boolean;
  domain: { min: number; max: number };
  item: IntervalItem;
  rejected: boolean;
  row: number;
}) {
  const className = [
    "interval-block",
    current ? "is-current" : "",
    compared ? "is-compared" : "",
    accepted ? "is-accepted" : "",
    rejected ? "is-rejected" : "",
    covered ? "is-covered" : "",
  ].filter(Boolean).join(" ");
  return <div className={className} style={intervalStyle(item, domain, row)} title={item.label}><span>{item.label ?? `[${item.start}, ${item.end}]`}</span></div>;
}

function getDomain(frame: IntervalTraceFrame) {
  const values: number[] = [];
  frame.lanes.forEach((currentLane) => currentLane.intervals.forEach((item) => values.push(item.start, item.end)));
  frame.output.forEach((item) => values.push(item.start, item.end));
  if (frame.mask) values.push(frame.mask.start, frame.mask.end);
  if (frame.sweep !== null && frame.sweep !== undefined) values.push(frame.sweep);
  frame.events?.forEach((event) => values.push(event.time));
  if (!values.length) return { min: 0, max: 1 };
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = Math.max(1, rawMax - rawMin);
  return { min: rawMin - span * 0.08, max: rawMax + span * 0.08 };
}

function position(value: number, domain: { min: number; max: number }) {
  return ((value - domain.min) / (domain.max - domain.min)) * 100;
}

function intervalStyle(item: IntervalItem, domain: { min: number; max: number }, row?: number) {
  const left = position(item.start, domain);
  const right = position(item.end, domain);
  return { left: `${left}%`, width: `${Math.max(2.2, right - left)}%`, ...(row === undefined ? {} : { top: `${7 + row * 34}px` }) };
}

function makeTicks(min: number, max: number) {
  const span = max - min;
  return Array.from({ length: 5 }, (_, index) => Number((min + (span * index) / 4).toFixed(2)));
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function layoutIntervals(items: IntervalItem[]) {
  const rowEnds: number[] = [];
  const rows = new Map<string, number>();
  [...items]
    .sort((left, right) => left.start - right.start || left.end - right.end || left.id.localeCompare(right.id))
    .forEach((item) => {
      let row = rowEnds.findIndex((end) => end <= item.start);
      if (row === -1) {
        row = rowEnds.length;
        rowEnds.push(item.end);
      } else {
        rowEnds[row] = item.end;
      }
      rows.set(item.id, row);
    });
  return { items: items.map((item) => ({ item, row: rows.get(item.id) ?? 0 })), rows: Math.max(1, rowEnds.length) };
}

function trackHeight(rows: number) {
  return 42 + (Math.max(1, rows) - 1) * 34;
}

function frameKindLabel(kind: IntervalTraceFrame["kind"]) {
  const labels: Record<IntervalTraceFrame["kind"], string> = {
    build: "建立状态",
    start: "开始",
    visit: "检查",
    prune: "剪枝／移除",
    found: "发现关键状态",
    backtrack: "回退",
    done: "完成",
  };
  return labels[kind];
}
