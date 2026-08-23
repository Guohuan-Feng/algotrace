# Data Stream and Meeting Scheduler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open 352 and 1229 in Algorithm Learning and ship matching, code-synchronized AlgoTrace visualizers.

**Architecture:** `algorithm-learning` supplies the lesson source and links. AlgoTrace uses a dedicated state-machine visualizer for 352 and the reusable interval/two-pointer surface for 1229; both modules are found through `import.meta.glob`.

**Tech Stack:** Python unittest, JavaScript, React, TypeScript, Vite, Vitest, CSS, Vercel.

## Global Constraints

- Preserve the supplied 352 and 1229 algorithms and Python method names.
- 352 exposes `new`, `res`, and `self.intervals` in every relevant state frame.
- 1229 exposes sorting, intersection calculation, duration comparison, and pointer movement.
- Use official LeetCode examples as defaults.
- Do not add or stage the pre-existing `apps/web/.gitignore`.

---

### Task 1: Open the Two Algorithm Learning Lessons

**Files:**
- Create: `solutions/p0352_data_stream_as_disjoint_intervals.py`
- Create: `solutions/p1229_meeting_scheduler.py`
- Modify: `tests/test_solutions.py`
- Modify: `assets/app.js`

**Interfaces:**
- Produces `SummaryRanges.addNum(value: int) -> None` and `getIntervals() -> List[List[int]]`.
- Produces `Solution.minAvailableDuration(slots1, slots2, duration) -> List[int]`.
- Makes the existing order 9 and 10 lesson records available.

- [ ] **Step 1: Write failing Python contracts**

```python
from solutions.p0352_data_stream_as_disjoint_intervals import SummaryRanges
from solutions.p1229_meeting_scheduler import Solution as MeetingSchedulerSolution

def test_summary_ranges_official_stream(self):
    summary_ranges = SummaryRanges()
    for value, expected in [(1, [[1, 1]]), (3, [[1, 1], [3, 3]]), (7, [[1, 1], [3, 3], [7, 7]]), (2, [[1, 3], [7, 7]]), (6, [[1, 3], [6, 7]])]:
        summary_ranges.addNum(value)
        self.assertEqual(summary_ranges.getIntervals(), expected)

def test_meeting_scheduler_official_examples(self):
    solution = MeetingSchedulerSolution()
    self.assertEqual(solution.minAvailableDuration([[10, 50], [60, 120], [140, 210]], [[0, 15], [60, 70]], 8), [60, 68])
    self.assertEqual(solution.minAvailableDuration([[10, 50], [60, 120], [140, 210]], [[0, 15], [60, 70]], 12), [])
```

- [ ] **Step 2: Verify RED**

Run: `python3 -m unittest discover -s tests -v`

Expected: imports fail because neither module exists.

- [ ] **Step 3: Add the supplied algorithms**

Implement the supplied 352 scan with the two strict adjacency conditions and the supplied 1229 sort-and-two-pointer method, preserving every original branch and method name.

- [ ] **Step 4: Open the two existing records**

Change `isAvailable(problem)` to `return problem.order <= 10;`. Change series count and learning copy from `8 / 13` and `前 8 题` to `10 / 13` and `前 10 题`; preserve the already-configured source-file paths and AlgoTrace slugs.

- [ ] **Step 5: Verify and commit**

```bash
python3 -m unittest discover -s tests -v
node --check assets/app.js
git diff --check
git add assets/app.js solutions/p0352_data_stream_as_disjoint_intervals.py solutions/p1229_meeting_scheduler.py tests/test_solutions.py
git commit -m "feat: open data stream and meeting scheduler lessons"
```

Expected: ten Python tests pass and JavaScript parses successfully.

### Task 2: Add the 1229 Two-Pointer Dry Run

**Files:**
- Modify: `apps/web/src/shared/intervals/engine.ts`
- Modify: `apps/web/src/shared/intervals/engine.test.ts`
- Create: `apps/web/src/problems/1229-meeting-scheduler/definition.ts`
- Create: `apps/web/src/problems/1229-meeting-scheduler/data.ts`
- Create: `apps/web/src/problems/1229-meeting-scheduler/dryRun.ts`
- Create: `apps/web/src/problems/1229-meeting-scheduler/Visualizer.tsx`
- Modify: `apps/web/src/shared/intervals/registry.test.ts`

**Interfaces:**
- Produces `createMeetingSchedulerDryRun(input: unknown): IntervalTraceRun`.
- Input shape is `{ slots1: Interval[]; slots2: Interval[]; duration: number }`.
- Final result is `"[start, end]"` or `"[]"`.

- [ ] **Step 1: Write failing engine and discovery tests**

```ts
test("1229 returns the earliest shared duration", () => {
  const frame = finalFrame(createMeetingSchedulerDryRun({ slots1: [[10, 50], [60, 120], [140, 210]], slots2: [[0, 15], [60, 70]], duration: 8 }));
  expect(frame.result).toBe("[60, 68]");
});

test("1229 returns an empty result when every overlap is too short", () => {
  const frame = finalFrame(createMeetingSchedulerDryRun({ slots1: [[10, 50], [60, 120], [140, 210]], slots2: [[0, 15], [60, 70]], duration: 12 }));
  expect(frame.result).toBe("[]");
});
```

Add `meeting-scheduler` to the interval discovery test.

- [ ] **Step 2: Verify RED**

Run: `pnpm --dir apps/web test src/shared/intervals/engine.test.ts src/shared/intervals/registry.test.ts`

Expected: the export and visualizer do not exist.

- [ ] **Step 3: Implement the engine and module**

Clone and sort both slot lists. Emit frames for sorting (lines 9-10), pointer setup (12), intersection (15-16), return (18-19), `i += 1` (22), `j += 1` (24), and no-solution completion. Use official examples `[60, 68]` and `[]`. The definition uses ID 1229, slug `meeting-scheduler`, tags `Intervals`, `Two Pointers`, and `Sorting`. The visualizer wraps `IntervalTraceVisualizer`.

- [ ] **Step 4: Verify and commit**

```bash
pnpm --dir apps/web test src/shared/intervals/engine.test.ts src/shared/intervals/registry.test.ts
pnpm --dir apps/web build
git diff --check
git add apps/web/src/shared/intervals apps/web/src/problems/1229-meeting-scheduler
git commit -m "feat: visualize meeting scheduler"
```

Expected: both official results pass and Vite builds.

### Task 3: Add the 352 State-Machine Dry Run

**Files:**
- Create: `apps/web/src/problems/0352-data-stream-as-disjoint-intervals/definition.ts`
- Create: `apps/web/src/problems/0352-data-stream-as-disjoint-intervals/data.ts`
- Create: `apps/web/src/problems/0352-data-stream-as-disjoint-intervals/dryRun.ts`
- Create: `apps/web/src/problems/0352-data-stream-as-disjoint-intervals/dryRun.test.ts`
- Create: `apps/web/src/problems/0352-data-stream-as-disjoint-intervals/Visualizer.tsx`
- Modify: `apps/web/src/app/styles.css`
- Modify: `apps/web/src/shared/intervals/registry.test.ts`

**Interfaces:**
- Produces `createSummaryRangesDryRun(values: number[]): { frames: SummaryRangesFrame[] }`.
- Frames contain `value`, `intervals`, `newInterval`, `res`, `scannedInterval`, `branch`, `activeLines`, and `result`.

- [ ] **Step 1: Write failing frame and discovery tests**

```ts
test("merges the official stream into two disjoint ranges", () => {
  const { frames } = createSummaryRangesDryRun([1, 3, 7, 2, 6]);
  expect(frames.at(-1)?.result).toEqual([[1, 3], [6, 7]]);
});

test("shows left, right, and merge branches", () => {
  const { frames } = createSummaryRangesDryRun([1, 3, 7, 2, 6]);
  expect(frames.some((frame) => frame.branch === "left")).toBe(true);
  expect(frames.some((frame) => frame.branch === "right")).toBe(true);
  expect(frames.some((frame) => frame.branch === "merge")).toBe(true);
});
```

Add `data-stream-as-disjoint-intervals` to auto-discovery.

- [ ] **Step 2: Verify RED**

Run: `pnpm --dir apps/web test src/problems/0352-data-stream-as-disjoint-intervals/dryRun.test.ts src/shared/intervals/registry.test.ts`

Expected: Vitest cannot resolve the dry-run module or visualizer route.

- [ ] **Step 3: Implement frames and dedicated UI**

For each value, begin with `new = [value, value]` and `res = []`. Every existing interval takes one branch:

```ts
if (right + 1 < newInterval[0]) branch = "left";
else if (newInterval[1] + 1 < left) branch = "right";
else branch = "merge";
```

The right branch appends before replacing `newInterval`. The end of each operation appends `newInterval`, assigns `res` to `intervals`, and emits a `getIntervals` state. The custom input supports one to ten integers. The center has tracks for `已有 intervals`, `当前 new`, and `本轮 res`: untouched is white, active is yellow, mutable is blue, and committed is green. Use ID 352, slug `data-stream-as-disjoint-intervals`, difficulty `Hard`, and tags `Design`, `Intervals`, and `Ordered Set`.

- [ ] **Step 4: Verify and commit**

```bash
pnpm --dir apps/web test src/problems/0352-data-stream-as-disjoint-intervals/dryRun.test.ts src/shared/intervals/registry.test.ts
pnpm --dir apps/web build
git diff --check
git add apps/web/src/problems/0352-data-stream-as-disjoint-intervals apps/web/src/app/styles.css apps/web/src/shared/intervals/registry.test.ts
git commit -m "feat: visualize data stream intervals"
```

Expected: official output and all three loop branches are covered.

### Task 4: Integrate, Release, and Verify

**Files:**
- Modify: this plan to mark completed checklist items and record release evidence.

- [ ] **Step 1: Run the full automated suites**

```bash
python3 -m unittest discover -s tests -v
node --check assets/app.js
pnpm test
pnpm build
git diff --check
```

Expected: both test suites pass and Vite builds without TypeScript errors.

- [ ] **Step 2: Verify both local browser flows**

Open Algorithm Learning at `?problem=9#lesson-detail` and `?problem=10#lesson-detail`; verify Python code and AlgoTrace links. Step each official AlgoTrace run and verify `[[1,3],[6,7]]`, `[60,68]`, `[]`, code highlights, and console output.

- [ ] **Step 3: Push and verify Vercel**

```bash
git -C /Users/admin/Documents/Codex/2026-06-19/algorithm-learning push origin main
git -C /Users/admin/Documents/Codex/2026-06-19/react-flow-dry-run-dfs-bfs push origin main
pnpm dlx vercel@latest inspect https://algorithm-learning-eight.vercel.app --scope 2890858968a-gmailcoms-projects --wait
pnpm dlx vercel@latest inspect https://algotrace-dryrun.vercel.app --scope 2890858968a-gmailcoms-projects --wait
```

Expected: both production deployments are `Ready` and stable aliases serve the two new pages.
