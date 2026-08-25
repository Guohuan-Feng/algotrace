import type { FrameKind } from "../../shared/types";

export type ItineraryTicket = {
  id: string;
  from: string;
  to: string;
};

export type ItineraryFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  phase: "build" | "initialize" | "enter" | "choose" | "recurse" | "append" | "return" | "done";
  tickets: ItineraryTicket[];
  airports: string[];
  graph: Record<string, string[]>;
  stack: string[];
  current: string | null;
  nextAirport: string | null;
  activeTicket: ItineraryTicket | null;
  usedTicketIds: string[];
  res: string[];
  result: string[] | null;
};

type TicketInput = [string, string];

function isTicket(value: string[]): value is TicketInput {
  return value.length === 2 && value.every((airport) => typeof airport === "string" && airport.length > 0);
}

export function createItineraryDryRun(ticketsInput: string[][]): { frames: ItineraryFrame[] } {
  const tickets = ticketsInput
    .filter(isTicket)
    .map(([from, to], index) => ({ id: `ticket-${index}`, from, to }));
  const airports = ["JFK", ...Array.from(new Set(tickets.flatMap((ticket) => [ticket.from, ticket.to]).filter((airport) => airport !== "JFK"))).sort()];
  const ticketsById = new Map(tickets.map((ticket) => [ticket.id, ticket]));
  const heaps = Object.fromEntries(airports.map((airport) => [airport, [] as string[]])) as Record<string, string[]>;
  const stack: string[] = [];
  const usedTicketIds = new Set<string>();
  const res: string[] = [];
  const frames: ItineraryFrame[] = [];

  const push = (frame: Omit<ItineraryFrame, "tickets" | "airports" | "graph" | "stack" | "usedTicketIds" | "res">) => {
    frames.push({
      ...frame,
      tickets: tickets.map((ticket) => ({ ...ticket })),
      airports: [...airports],
      graph: Object.fromEntries(airports.map((airport) => [airport, heaps[airport].map((ticketId) => ticketsById.get(ticketId)?.to ?? "")])),
      stack: [...stack],
      usedTicketIds: [...usedTicketIds],
      res: [...res],
    });
  };

  push({
    kind: "start",
    title: "创建图的最小堆邻接表",
    detail: "graph[airport] 会保存该机场尚未使用的机票；堆顶永远是字典序最小的下一站。",
    activeLines: [8],
    phase: "build",
    current: null,
    nextAirport: null,
    activeTicket: null,
    result: null,
  });

  tickets.forEach((ticket) => {
    heaps[ticket.from].push(ticket.id);
    heaps[ticket.from].sort(compareTicketIds);
    push({
      kind: "build",
      title: `把 ${ticket.from} -> ${ticket.to} 放入最小堆`,
      detail: `graph[${ticket.from}] 按机场名称排序，下一次弹出会优先取得最小的目的地。`,
      activeLines: [11, 12],
      phase: "build",
      current: ticket.from,
      nextAirport: ticket.to,
      activeTicket: ticket,
      result: null,
    });
  });

  push({
    kind: "build",
    title: "初始化 res",
    detail: "res 不是正向行程：它会在 DFS 回溯时按后序写入机场。",
    activeLines: [14],
    phase: "initialize",
    current: null,
    nextAirport: null,
    activeTicket: null,
    result: null,
  });

  push({
    kind: "visit",
    title: "从 JFK 出发",
    detail: "题目指定行程一定从 JFK 开始，调用 dfs(\"JFK\")。",
    activeLines: [25],
    phase: "enter",
    current: "JFK",
    nextAirport: null,
    activeTicket: null,
    result: null,
  });
  dfs("JFK");

  const result = [...res].reverse();
  push({
    kind: "done",
    title: "反转后序结果，得到行程",
    detail: `res 的回填顺序是 ${formatRoute(res)}；res[::-1] 才是正向机票行程。`,
    activeLines: [27],
    phase: "done",
    current: null,
    nextAirport: null,
    activeTicket: null,
    result,
  });

  return { frames };

  function compareTicketIds(leftId: string, rightId: string) {
    const left = ticketsById.get(leftId)!;
    const right = ticketsById.get(rightId)!;
    return left.to.localeCompare(right.to) || left.id.localeCompare(right.id);
  }

  function dfs(airport: string) {
    stack.push(airport);
    push({
      kind: "visit",
      title: `进入 dfs(${airport})`,
      detail: "查看当前机场的最小堆，持续使用所有尚未使用的出发机票。",
      activeLines: [16, 18],
      phase: "enter",
      current: airport,
      nextAirport: null,
      activeTicket: null,
      result: null,
    });

    while (heaps[airport].length) {
      const ticketId = heaps[airport][0];
      const ticket = ticketsById.get(ticketId)!;
      push({
        kind: "visit",
        title: `堆顶是 ${airport} -> ${ticket.to}`,
        detail: `${ticket.to} 是 graph[${airport}] 中字典序最小的目的地，下一张应使用它。`,
        activeLines: [18],
        phase: "choose",
        current: airport,
        nextAirport: ticket.to,
        activeTicket: ticket,
        result: null,
      });

      heaps[airport].shift();
      usedTicketIds.add(ticket.id);
      push({
        kind: "build",
        title: `弹出 ${airport} -> ${ticket.to}`,
        detail: "heapq.heappop 取走最小目的地；这张机票现在不能再次使用。",
        activeLines: [19],
        phase: "choose",
        current: airport,
        nextAirport: ticket.to,
        activeTicket: ticket,
        result: null,
      });

      push({
        kind: "visit",
        title: `递归进入 ${ticket.to}`,
        detail: "先把这张机票后面的行程全部走完，再决定何时把当前机场写入 res。",
        activeLines: [20],
        phase: "recurse",
        current: airport,
        nextAirport: ticket.to,
        activeTicket: ticket,
        result: null,
      });
      dfs(ticket.to);
    }

    res.push(airport);
    push({
      kind: "backtrack",
      title: `${airport} 已没有下一站，回填到 res`,
      detail: `graph[${airport}] 已空；在返回上一层前执行 res.append(${airport})。`,
      activeLines: [23],
      phase: "append",
      current: airport,
      nextAirport: null,
      activeTicket: null,
      result: null,
    });

    stack.pop();
    push({
      kind: "backtrack",
      title: `从 dfs(${airport}) 返回`,
      detail: "这个机场的所有出发机票都已被使用，继续回到调用它的上一层。",
      activeLines: [20, 23],
      phase: "return",
      current: stack[stack.length - 1] ?? null,
      nextAirport: null,
      activeTicket: null,
      result: null,
    });
  }
}

export function formatRoute(route: string[]) {
  return route.length ? route.join(" -> ") : "[]";
}
