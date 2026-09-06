import { z } from "zod";

export const CoachRequestSchema = z.object({
  assignment: z.string().trim().min(3).max(240),
  difficulty: z.enum(["starting", "understanding", "finding-time"]),
  comfort: z.enum(["regular", "low-energy", "screen-light"]),
});

const StudyStepSchema = z.object({
  label: z.string().max(90),
  minutes: z.number().int().min(3).max(25),
});

export const CoachResponseSchema = z.object({
  acknowledgement: z.string().max(220),
  steps: z.array(StudyStepSchema).min(2).max(4),
  checkInQuestion: z.string().max(180),
  parentHelpSuggestion: z.string().max(180).nullable(),
});

export const CoachRunSchema = z.object({
  plan: CoachResponseSchema,
  engine: z.enum(["deterministic-preview", "strands", "strands-agentcore"]),
  tool: z.literal("build_study_plan"),
});

export type CoachRequest = z.infer<typeof CoachRequestSchema>;
export type CoachResponse = z.infer<typeof CoachResponseSchema>;
export type CoachRun = z.infer<typeof CoachRunSchema>;

export function buildPreviewPlan(input: CoachRequest): CoachResponse {
  const shortBlock = input.comfort === "low-energy" ? 8 : 10;
  const screenLight = input.comfort === "screen-light";

  const firstStep = {
    starting: "Open the assignment and circle the one thing due first",
    understanding: "Write the question in your own words",
    "finding-time": "Choose one open study window for today",
  }[input.difficulty];

  return {
    acknowledgement:
      input.difficulty === "starting"
        ? "Starting can feel like the biggest step. Let’s make the first move very small."
        : input.difficulty === "understanding"
          ? "We can slow the problem down and work out what it is asking—without doing it for you."
          : "Let’s fit the work around your real day instead of pretending you have unlimited time.",
    steps: [
      { label: firstStep, minutes: 5 },
      {
        label: screenLight
          ? "Use paper or audio to collect two useful facts"
          : "Find two trustworthy facts and note where they came from",
        minutes: shortBlock,
      },
      { label: "Write three questions you still want to answer", minutes: 5 },
    ],
    checkInQuestion: "Which step would make the rest feel easier once it is done?",
    parentHelpSuggestion:
      input.difficulty === "understanding"
        ? "Ask a grown-up for ten minutes of hints or source-finding help—not answers."
        : null,
  };
}
