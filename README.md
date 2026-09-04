# AlgoTrace

[AlgoTrace](https://algotrace-dryrun.vercel.app) 是一个 LeetCode 算法 dry run 可视化题库。每题把代码执行拆成可单步播放的状态帧：中间展示算法结构，右侧展示队列、递归栈、visited、DP、指针等状态，并同步高亮当前代码行。

项目的目标是逐步扩展到约 500 道题，同时让每个已完成的动画都能独立维护。

## 项目结构

```txt
apps/
  web/                         # Vite + React 前端和唯一的可部署应用
    src/
      app/                     # 应用入口、路由壳、全局样式
      catalog/                 # Hot 150、路线图和公司题单快照的元数据
        companyCollections/    # Google/Amazon/TikTok 的版本化三个月快照
      auth/                    # Supabase 会话和跨设备完成进度
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

## 公司题单与完成进度

题库额外包含 `Google · 3 months`、`Amazon · 3 months`、`TikTok · 3 months` 三个公司题单。左侧圆形按钮用于标记完成；登录后，这个状态会保存在账号中并在其他设备同步。没有动画的公司题会先作为“待补动画”占位题出现，因此可以先跟踪学习进度。

三个题单是仓库内的版本化快照，不是运行时抓取，也不应被理解为实时数据。快照从登录状态下的
LeetCode 官方 `favoriteQuestionList` 数据导出，保存在
`apps/web/scripts/data/official-company-collections.json`，并按官方 `frequency` 从高到低生成。
每个题单页面都链接回对应的 LeetCode `3 months` 公司题单，也显示这份快照的抓取时间。

手动刷新快照：

```bash
pnpm --dir apps/web refresh:company-collections
pnpm --dir apps/web test src/catalog/companyCollections/index.test.ts
```

更新时，先从 LeetCode 官方 Google、Amazon、TikTok 的 `3 months` 页面导出完整数据，替换上述 JSON 文件，再运行刷新命令。生成器会拒绝缺题、重复题号、无效难度或不是官方三个月页面的数据。

### 首次开启 Google 登录和跨设备同步

代码已支持未配置状态：没有变量时题库照常可浏览，但登录和完成按钮会禁用，避免把本地状态误显示为已同步。以下配置需要在你确认后于 Supabase 和 Vercel 仪表盘保存；仓库中不包含密钥。

1. 创建 Supabase 项目，在 SQL Editor 中执行
   `supabase/migrations/20260904000000_problem_progress.sql`。
2. 在 Supabase Authentication 的 Google provider 填入你自己的 Google OAuth client ID/secret，并在 redirect allowlist 添加：
   `http://127.0.0.1:5173` 和 `https://algotrace-dryrun.vercel.app`。
3. 在 Vercel 项目的 Production、Preview 和 Development 环境写入公开变量：
   `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`，然后重新部署。
4. 在两台浏览器中用同一个 Google 账号登录，勾选一题，再刷新另一台浏览器确认进度出现。

只能放 publishable anon key；不要把 Supabase service-role key、Google OAuth secret 或个人邮箱写入 Vercel 前端变量或 Git。

## 部署

Vercel 项目保持以仓库根目录为部署根。`vercel.json` 会进入 `apps/web` 安装依赖、构建，并发布 `apps/web/dist`。

```bash
vercel deploy --prod
```

生产地址：<https://algotrace-dryrun.vercel.app>
