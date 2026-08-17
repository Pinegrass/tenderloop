import "server-only";

import { Agent, tool } from "@strands-agents/sdk";
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

export type CoachRequest = z.infer<typeof CoachRequestSchema>;
export type CoachResponse = z.infer<typeof CoachResponseSchema>;

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

const buildStudyPlan = tool({
  name: "build_study_plan",
  description:
    "Create a small, non-punitive study plan from a synthetic assignment, the student's chosen difficulty, and a functional comfort preference.",
  inputSchema: CoachRequestSchema,
  callback: buildPreviewPlan,
});

function hasBedrockCredentials() {
  return Boolean(
    process.env.AWS_BEARER_TOKEN_BEDROCK ||
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
  );
}

export async function runStudentCoach(input: CoachRequest) {
  if (!hasBedrockCredentials()) {
    return {
      plan: buildPreviewPlan(input),
      engine: "deterministic-preview" as const,
      tool: "build_study_plan",
    };
  }

  const agent = new Agent({
    name: "tenderloop_student_coach",
    description: "A bounded study-planning agent for teenagers.",
    tools: [buildStudyPlan],
    structuredOutputSchema: CoachResponseSchema,
    systemPrompt: `You are TenderLoop's Student Coach for ages 13–16.
You are an AI tool, never a parent, person, therapist, disciplinarian, or surveillance system.
Always call build_study_plan before responding. Teach without completing graded work.
Use warm, autonomy-supportive language with no guilt, diagnosis, mood inference, or punishment.
Do not reveal private conversation content to a parent. You may only suggest a narrow Help Card that the student can review and explicitly approve.
Return only the requested structured output.`,
  });

  const result = await agent.invoke(
    `Create a study plan for this synthetic assignment: ${input.assignment}. The student says the hardest part is ${input.difficulty} and chose ${input.comfort} pacing.`,
    { limits: { turns: 3, outputTokens: 700, totalTokens: 4000 } },
  );

  return {
    plan: CoachResponseSchema.parse(result.structuredOutput),
    engine: "strands" as const,
    tool: "build_study_plan",
  };
}
