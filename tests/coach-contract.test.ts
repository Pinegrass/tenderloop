import assert from "node:assert/strict";
import test from "node:test";

import {
  CoachRequestSchema,
  CoachRunSchema,
  buildPreviewPlan,
} from "../src/lib/coach-contract";

test("coach input rejects oversized or unsupported requests", () => {
  assert.equal(
    CoachRequestSchema.safeParse({
      assignment: "x".repeat(241),
      difficulty: "starting",
      comfort: "regular",
    }).success,
    false,
  );

  assert.equal(
    CoachRequestSchema.safeParse({
      assignment: "Science project",
      difficulty: "finish-it-for-me",
      comfort: "regular",
    }).success,
    false,
  );
});

test("preview plan stays inside the bounded plan contract", () => {
  const input = CoachRequestSchema.parse({
    assignment: "Friday science project",
    difficulty: "understanding",
    comfort: "low-energy",
  });
  const plan = buildPreviewPlan(input);
  const result = CoachRunSchema.parse({
    plan,
    engine: "deterministic-preview",
    tool: "build_study_plan",
  });

  assert.equal(result.plan.steps.length, 3);
  assert.ok(result.plan.steps.every((step) => step.minutes >= 3 && step.minutes <= 25));
  assert.match(result.plan.parentHelpSuggestion ?? "", /hints|source-finding/i);
  assert.doesNotMatch(JSON.stringify(result), /diagnos|punish|mood score/i);
});

test("AgentCore responses must identify the bounded tool and validated engine", () => {
  const plan = buildPreviewPlan(
    CoachRequestSchema.parse({
      assignment: "Friday science project",
      difficulty: "starting",
      comfort: "screen-light",
    }),
  );

  assert.equal(
    CoachRunSchema.safeParse({
      plan,
      engine: "strands-agentcore",
      tool: "unbounded_action",
    }).success,
    false,
  );
});
