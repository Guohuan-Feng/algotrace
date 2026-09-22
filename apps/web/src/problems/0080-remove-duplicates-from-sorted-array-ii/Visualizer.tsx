import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { CodeTrace } from "../../shared/components/CodeTrace";
import { StepControls } from "../../shared/components/StepControls";
import type { VisualizerProps } from "../../shared/types";
import { codeLines, defaultExample, examples, parseInput, title } from "./data";
import { createRemoveDuplicatesIIDryRun } from "./dryRun";
import "./styles.css";

const phaseLabels = {
  guard: "检查长度", initialize: "初始化", compare: "比较", write: "原地写入",
  advance: "移动 left", skip: "跳过", done: "完成",
};

export default function RemoveDuplicatesIIVisualizer({ onBack }: VisualizerProps) {
  const [input, setInput] = useState(defaultExample.input);
  const [exampleId, setExampleId] = useState<number>(defaultExample.id);
  const [text, setText] = useState(JSON.stringify(defaultExample.input));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const [delay, setDelay] = useState(1100);
  const run = useMemo(() => createRemoveDuplicatesIIDryRun(input), [input]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)]!;
  const prefixLength = frame.result.nums.length;
  const done = frame.phase === "done";

  useEffect(() => {
    if (!playing) return;
    if (step >= run.frames.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep((current) => current + 1), delay);
    return () => window.clearTimeout(timer);
  }, [delay, playing, run.frames.length, step]);

  function load(next: number[], id: number) {
    setInput(next); setText(JSON.stringify(next)); setExampleId(id);
    setStep(0); setPlaying(false); setError("");
  }

  function loadInput() {
    try { load(parseInput(JSON.parse(text)), 0); }
    catch (cause) {
      setPlaying(false);
      setError(cause instanceof Error && !(cause instanceof SyntaxError)
        ? cause.message : '请输入 JSON 整数数组，例如 [1,1,1,2,2,3]。');
    }
  }

  function seek(next: number) { setPlaying(false); setStep(next); }
  function togglePlaying(next: boolean) {
    if (next && done) setStep(0);
    setPlaying(next);
  }

  return (
    <main className="app-shell dedupe-ii">
      <header className="topbar">
        <div>
          <button className="back-link compact" onClick={onBack} type="button"><ArrowLeft size={16} />题库</button>
          <p className="eyebrow">AlgoTrace · #80 · Two pointers</p>
          <h1>{title}</h1>
          <p className="dii-subtitle">删除有序数组中的重复项 II · 每个元素最多保留两次</p>
        </div>
        <div className="step-pill">步骤 {step + 1} / {run.frames.length}</div>
      </header>

      <section className="workspace">
        <aside className="board-panel">
          <h2>选择示例</h2>
          <div className="dii-examples" aria-label="示例数组">
            {examples.map((example) => (
              <button className={example.id === exampleId ? "active" : ""} key={example.id}
                aria-pressed={example.id === exampleId} onClick={() => load(example.input, example.id)} type="button">
                {example.label}
              </button>
            ))}
          </div>
          <div className="input-grid">
            <label>自定义 nums（非递减整数数组）
              <textarea aria-label="nums JSON" value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
            </label>
            <span className="dii-hint">最多 40 个整数，允许空数组 []。</span>
            {error ? <p className="error" role="alert">{error}</p> : null}
            <button className="command load" onClick={loadInput} type="button"><Upload size={16} />载入数组</button>
          </div>
          <div className="state-block dii-original"><h3>原始输入</h3><code>{JSON.stringify(input)}</code></div>
          <div className="dii-explanation">
            <h3>为什么看 left − 2？</h3>
            <p><code>nums[:left]</code> 是已经整理好的有效前缀。数组有序，候选值若与前缀倒数第二个值相同，就会成为第三份，应当跳过。</p>
            <p><strong>left</strong>：下一次写入的位置，也是有效长度。<br /><strong>right</strong>：正在扫描的位置。</p>
            <span>时间 O(n) · 额外空间 O(1)</span>
          </div>
        </aside>

        <section className="flow-panel dedupe-flow-panel">
          <div className="panel-heading"><h2>原地数组 nums</h2><span>{phaseLabels[frame.phase]}</span></div>
          <div className="dii-stage">
            <div className="dii-legend">
              <span><i className="dii-key prefix" />已保留</span>
              <span><i className="dii-key reader" />right 扫描</span>
              <span><i className="dii-key writer" />left 写入</span>
              <span><i className="dii-key reference" />left − 2 比较</span>
            </div>
            <div className="dii-array" role="group" aria-label="当前原地数组">
              {frame.nums.length === 0 ? <div className="dii-empty">[] 空数组</div> : null}
              {frame.nums.map((value, index) => {
                const read = frame.right === index;
                const write = frame.left === index;
                const compare = frame.compareIndex === index;
                const written = frame.writtenIndex === index;
                return <div key={index} data-testid={`nums-${index}`}
                  className={["dii-cell", index < prefixLength ? "is-prefix" : "", read ? "is-reader" : "", write ? "is-writer" : "", compare ? "is-reference" : "", written ? "is-written" : "", done && index >= prefixLength ? "is-ignored" : ""].filter(Boolean).join(" ")}
                  aria-label={`下标 ${index}，值 ${value}${index < prefixLength ? "，有效前缀" : ""}${read ? "，right" : ""}${write ? "，left" : ""}${compare ? "，left 减 2" : ""}`}>
                  <span className="dii-index">[{index}]</span>
                  <strong>{value}</strong>
                  <div className="dii-tags">
                    {read ? <span className="reader">right</span> : null}
                    {write ? <span className="writer">left</span> : null}
                    {compare ? <span className="reference">left − 2</span> : null}
                    {written ? <span>已写入</span> : null}
                    {done && index >= prefixLength ? <span>不计入</span> : null}
                  </div>
                </div>;
              })}
            </div>
            {frame.left === frame.nums.length && frame.left !== null ? <p className="dii-end">left = {frame.left} · 位于数组末尾之后</p> : null}

            <div className={`dii-comparison ${frame.comparison ? frame.comparison.keep ? "keep" : "skip" : ""}`}>
              {frame.comparison ? <>
                <span>{frame.phase === "advance" ? "本轮比较" : "判断条件"}</span>
                <code>nums[right] != nums[left − 2]</code>
                <div><strong>{frame.comparison.candidate} ≠ {frame.comparison.reference}</strong><span>{frame.comparison.keep ? "True · 保留" : "False · 跳过第三份及后续重复"}</span></div>
              </> : <>
                <span>{done ? "返回结果" : "判断条件"}</span>
                <code>{done ? `return ${frame.result.k}` : frame.phase === "guard" ? "len(nums) <= 2" : "nums[right] != nums[left − 2]"}</code>
                <p>{done ? "数组长度不变，答案只取有效前缀。" : frame.phase === "guard" ? "先检查长度；不超过 2 项就直接返回，不进入双指针循环。" : "先保留前两个元素，再从 right = 2 开始扫描。"}</p>
              </>}
            </div>

            <div className="dii-prefix" aria-label="有效前缀">
              <div><span>{done ? `最终结果 · k = ${frame.result.k}` : frame.left === null ? "有效前缀 · 尚未初始化" : `有效前缀 · 长度 ${prefixLength}`}</span><code>{done ? `nums[:${frame.result.k}]` : frame.left === null ? "—" : "nums[:left]"}</code></div>
              <strong data-testid="valid-prefix">{JSON.stringify(frame.result.nums)}</strong>
              {frame.phase === "write" ? <p>当前值已写入；下一步执行 left += 1，将它纳入有效前缀。</p> : null}
              {done && prefixLength < input.length ? <p>灰色尾部仍在数组中，但不属于答案。</p> : null}
            </div>
          </div>
        </section>

        <aside className="state-panel">
          <div className="state-sticky">
            <div className={`event-card ${frame.kind}`} aria-live="polite">
              <p className="eyebrow">{phaseLabels[frame.phase]}</p><h2>{frame.title}</h2><p>{frame.detail}</p>
            </div>
            <StepControls frameCount={run.frames.length} playing={playing} step={step}
              onPlayingChange={togglePlaying} onStepChange={seek} />
            <label className="dii-speed">播放速度<select aria-label="播放速度" value={delay} onChange={(event) => setDelay(Number(event.target.value))}>
              <option value={1800}>慢速</option><option value={1100}>正常</option><option value={500}>快速</option>
            </select></label>
          </div>
          <div className="state-block"><h3>指针状态</h3><div className="token-list">
            <span>left = {frame.left ?? "未初始化"}</span><span>right = {frame.right ?? "—"}</span>
            <span>left − 2 = {frame.compareIndex ?? "—"}</span>
          </div></div>
          <CodeTrace activeLines={frame.activeLines} codeLines={codeLines} title="你的 Python 代码" />
        </aside>
      </section>
    </main>
  );
}
