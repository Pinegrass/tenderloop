import "server-only";

import { Agent, BedrockModel, tool } from "@strands-agents/sdk";
import {
  CoachRequestSchema,
  CoachResponseSchema,
  buildPreviewPlan,
  type CoachRequest,
} from "@/lib/coach-contract";
import { isAgentCoreConfigured, runAgentCoreCoach } from "@/lib/agentcore-client";

export { CoachRequestSchema } from "@/lib/coach-contract";

const buildStudyPlan = tool({
  name: "build_study_plan",
  description:
    "Create a small, non-punitive study plan from a synthetic assignment, the student's chosen difficulty, and a functional comfort preference.",
  inputSchema: CoachRequestSchema,
  callback: buildPreviewPlan,
});

function shouldUseBedrock() {
  return Boolean(
    process.env.TENDERLOOP_USE_BEDROCK === "true" ||
      process.env.AWS_BEARER_TOKEN_BEDROCK ||
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
  );
}

export async function runStudentCoach(input: CoachRequest) {
  if (isAgentCoreConfigured()) {
    try {
      return await runAgentCoreCoach(input);
    } catch (error: unknown) {
      const name = error instanceof Error ? error.name : "UnknownError";
      console.error("TenderLoop AgentCore fallback", { name });
      return {
        plan: buildPreviewPlan(input),
        engine: "deterministic-preview" as const,
        tool: "build_study_plan" as const,
      };
    }
  }

  if (!shouldUseBedrock()) {
    return {
      plan: buildPreviewPlan(input),
      engine: "deterministic-preview" as const,
      tool: "build_study_plan" as const,
    };
  }

  const model = new BedrockModel({
    region: process.env.AWS_REGION ?? "eu-north-1",
    modelId: process.env.BEDROCK_MODEL_ID ?? "amazon.nova-lite-v1:0",
    maxTokens: 700,
    temperature: 0.2,
  });

  const agent = new Agent({
    name: "tenderloop_student_coach",
    description: "A bounded study-planning agent for teenagers.",
    tools: [buildStudyPlan],
    model,
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
    tool: "build_study_plan" as const,
  };
}
