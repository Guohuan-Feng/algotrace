import type { FrameKind } from "../../types";

export type IpoProject = {
  id: number;
  capital: number;
  profit: number;
};

export type IpoFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  projects: IpoProject[];
  capitalHeap: IpoProject[];
  profitHeap: IpoProject[];
  chosen: IpoProject[];
  currentProject: IpoProject | null;
  round: number;
  k: number;
  w: number;
  result: number | null;
};

const byCapital = (a: IpoProject, b: IpoProject) => a.capital - b.capital || a.id - b.id;
const byProfitDesc = (a: IpoProject, b: IpoProject) => b.profit - a.profit || a.id - b.id;

export function createIpoDryRun(k: number, w: number, profits: number[], capital: number[]): { frames: IpoFrame[] } {
  const projects = profits.map((profit, id) => ({ id, profit, capital: capital[id] }));
  const capitalHeap: IpoProject[] = [];
  const profitHeap: IpoProject[] = [];
  const chosen: IpoProject[] = [];
  const frames: IpoFrame[] = [];
  let cash = w;

  const push = (frame: Omit<IpoFrame, "projects" | "capitalHeap" | "profitHeap" | "chosen" | "k" | "w">) => {
    frames.push({
      ...frame,
      projects,
      capitalHeap: [...capitalHeap].sort(byCapital),
      profitHeap: [...profitHeap].sort(byProfitDesc),
      chosen: [...chosen],
      k,
      w: cash,
    });
  };

  push({
    kind: "start",
    title: "Initialize capital heap",
    detail: `Start with k = ${k} and w = ${w}. Projects will be ordered by required capital.`,
    activeLines: [12],
    currentProject: null,
    round: 0,
    result: null,
  });

  for (const project of projects) {
    capitalHeap.push(project);
    push({
      kind: "build",
      title: `Push project ${project.id}`,
      detail: `Project ${project.id}: capital = ${project.capital}, profit = ${project.profit}.`,
      activeLines: [13, 14],
      currentProject: project,
      round: 0,
      result: null,
    });
  }

  push({
    kind: "start",
    title: "Initialize profit heap",
    detail: "profit_heap is empty. It will store affordable projects by largest profit.",
    activeLines: [16],
    currentProject: null,
    round: 0,
    result: null,
  });

  for (let round = 1; round <= k; round += 1) {
    push({
      kind: "visit",
      title: `Round ${round}`,
      detail: `Current capital is w = ${cash}. Move every project with required capital <= ${cash} into profit_heap.`,
      activeLines: [18, 19],
      currentProject: null,
      round,
      result: null,
    });

    capitalHeap.sort(byCapital);
    while (capitalHeap.length && capitalHeap[0].capital <= cash) {
      const project = capitalHeap.shift()!;
      push({
        kind: "visit",
        title: `Unlock project ${project.id}`,
        detail: `capital_heap top requires ${project.capital}, which is <= w = ${cash}.`,
        activeLines: [19, 20],
        currentProject: project,
        round,
        result: null,
      });
      profitHeap.push(project);
      push({
        kind: "build",
        title: `Push profit ${project.profit}`,
        detail: `Push -${project.profit} into profit_heap so the largest profit comes out first.`,
        activeLines: [21],
        currentProject: project,
        round,
        result: null,
      });
      capitalHeap.sort(byCapital);
    }

    if (!profitHeap.length) {
      push({
        kind: "done",
        title: "No affordable project",
        detail: "profit_heap is empty, so no project can be selected. Break early.",
        activeLines: [23, 24],
        currentProject: null,
        round,
        result: cash,
      });
      return { frames };
    }

    profitHeap.sort(byProfitDesc);
    const selected = profitHeap.shift()!;
    cash += selected.profit;
    chosen.push(selected);
    push({
      kind: "found",
      title: `Choose project ${selected.id}`,
      detail: `Take the largest profit ${selected.profit}. New capital: w = ${cash}.`,
      activeLines: [26],
      currentProject: selected,
      round,
      result: null,
    });
  }

  push({
    kind: "done",
    title: "Return final capital",
    detail: `After at most ${k} selections, return w = ${cash}.`,
    activeLines: [28],
    currentProject: null,
    round: k,
    result: cash,
  });

  return { frames };
}
