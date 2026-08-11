# AlgoTrace

[AlgoTrace](https://algotrace-dryrun.vercel.app) 是一个 LeetCode 算法 dry run 可视化题库。每题把代码执行拆成可单步播放的状态帧：中间展示算法结构，右侧展示队列、递归栈、visited、DP、指针等状态，并同步高亮当前代码行。

项目的目标是逐步扩展到约 500 道题，同时让每个已完成的动画都能独立维护。

## 项目结构

```txt
apps/
  web/                         # Vite + React 前端和唯一的可部署应用
    src/
      app/                     # 应用入口、路由壳、全局样式
      catalog/                 # Hot 150 与仅题库占位的元数据
      shared/                  # 跨题复用的 UI、类型和算法工具
      problems/                # 每个已完成动画一题一个文件夹
        0207-course-schedule/
          definition.ts        # 题目元数据，自动发现
          data.ts              # 官方例子与展示代码
          dryRun.ts            # 状态帧生成器
          Visualizer.tsx       # 本题 UI
          dryRun.test.ts       # 行为回归测试
docs/
  ARCHITECTURE.md
```

`apps/web/src/problems/index.ts` 会自动发现每个 `definition.ts`，并对相同文件夹中的 `Visualizer.tsx` 做懒加载。新增完成动画时不需要再编辑中央注册表、`VisualizerKey` 类型或路由表。

## 本地开发

需要 Node.js 20+ 和 pnpm。

```bash
pnpm --dir apps/web install
pnpm dev
```

浏览器打开 `http://127.0.0.1:5173/`。也可以直接在应用目录执行命令：

```bash
cd apps/web
pnpm dev
pnpm test
pnpm build
```

根目录提供同样的快捷命令：

```bash
pnpm test
pnpm build
```

## 新增一个动画题

1. 建立 `apps/web/src/problems/XXXX-problem-slug/`，题号固定为四位补零。
2. 添加 `definition.ts`，导出本题的 `definition`，其中包含题号、标题、难度、标签、分类和简介。
3. 在 `data.ts` 放 LeetCode 官方例子、预期输出和展示代码行。
4. 在 `dryRun.ts` 把每个关键执行动作变成帧。帧必须包括显示所需状态和 `activeLines`。
5. 在 `Visualizer.tsx` 默认导出 React 组件，复用 `CodeTrace`、`StepControls` 等共享组件。
6. 在 `dryRun.test.ts` 覆盖官方例子的关键中间状态和最终输出。
7. 运行 `pnpm test` 与 `pnpm build`。

`definition.ts` 最小示例：

```ts
import type { ReadyProblemDefinition } from "../../catalog/types";

export const definition = {
  id: 9999,
  title: "Example Problem",
  slug: "example-problem",
  difficulty: "Medium",
  tags: ["Graph", "BFS"],
  pattern: "Level-order traversal",
  hasVisualizer: true,
  summary: "Ready visualizer: explain the algorithm state step by step.",
} satisfies ReadyProblemDefinition;
```

没有动画的题目只需放到 `apps/web/src/catalog/hot150.ts` 或 `apps/web/src/catalog/roadmap.ts`。完成动画后，创建问题文件夹即可自动覆盖同题号的占位条目。

## 部署

Vercel 项目保持以仓库根目录为部署根。`vercel.json` 会进入 `apps/web` 安装依赖、构建，并发布 `apps/web/dist`。

```bash
vercel deploy --prod
```

生产地址：<https://algotrace-dryrun.vercel.app>
