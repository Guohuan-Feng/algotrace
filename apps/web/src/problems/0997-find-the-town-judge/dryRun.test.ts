import { describe, expect, test } from "vitest";
import { createFindTownJudgeDryRun } from "./dryRun";

describe("Find the Town Judge dry run", () => {
  test("uses indegree n - 1 and outdegree zero to find the judge", () => {
    const judge = createFindTownJudgeDryRun(3, [[1, 3], [2, 3]]).frames;
    const noJudge = createFindTownJudgeDryRun(3, [[1, 3], [2, 3], [3, 1]]).frames;

    expect(judge[judge.length - 1]!.result).toBe(3);
    expect(noJudge[noJudge.length - 1]!.result).toBe(-1);
  });
});
