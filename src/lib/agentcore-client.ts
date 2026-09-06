import "server-only";

import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

import {
  CoachRunSchema,
  type CoachRequest,
  type CoachRun,
} from "@/lib/coach-contract";

function configuredRegion() {
  return process.env.AGENTCORE_REGION ?? process.env.AWS_REGION ?? "ap-south-1";
}

export function isAgentCoreConfigured() {
  return Boolean(process.env.AGENTCORE_RUNTIME_ARN);
}

function createAgentCoreClient() {
  const roleArn = process.env.AWS_ROLE_ARN;

  return new BedrockAgentCoreClient({
    region: configuredRegion(),
    credentials: roleArn
      ? awsCredentialsProvider({
          roleArn,
          roleSessionName: "tenderloop-vercel",
          clientConfig: { region: configuredRegion() },
        })
      : undefined,
  });
}

export async function runAgentCoreCoach(input: CoachRequest): Promise<CoachRun> {
  const agentRuntimeArn = process.env.AGENTCORE_RUNTIME_ARN;

  if (!agentRuntimeArn) {
    throw new Error("AGENTCORE_RUNTIME_ARN is not configured.");
  }

  const client = createAgentCoreClient();

  try {
    const response = await client.send(
      new InvokeAgentRuntimeCommand({
        agentRuntimeArn,
        runtimeSessionId: crypto.randomUUID(),
        payload: JSON.stringify(input),
        contentType: "application/json",
        accept: "application/json",
        qualifier: process.env.AGENTCORE_QUALIFIER ?? "DEFAULT",
      }),
      { abortSignal: AbortSignal.timeout(25_000) },
    );

    if (!response.response || (response.statusCode && response.statusCode >= 400)) {
      throw new Error(`AgentCore returned status ${response.statusCode ?? "unknown"}.`);
    }

    const payload = JSON.parse(await response.response.transformToString());
    return CoachRunSchema.parse(payload);
  } finally {
    client.destroy();
  }
}
