# Agents for Humans: Taking TenderLoop from a Demo to an AgentCore-Ready Runtime

A polished interface is not the same as a production agent. For the Agents for Humans Hackathon, we treated that distinction as part of the product rather than something to hide.

TenderLoop's public demo is a complete interactive vertical slice of student planning, consent-approved Help Cards, parent coordination, temporary caregiver access, and an attributable activity trail. The live website uses synthetic data and clearly labels its deterministic planning path as **Safe preview**. The repository also contains a real Strands Agents and Amazon Nova Lite path that has been exercised against Amazon Bedrock.

The next infrastructure step is Amazon Bedrock AgentCore Runtime.

## Why AgentCore fits the architecture

TenderLoop's Student Coach is already a bounded server-side agent. AgentCore Runtime adds a purpose-built deployment boundary with an isolated runtime identity, versioned deployments, session isolation, and observability.

For this product, those capabilities are more important than raw model scale. A family coordination agent needs to answer basic operational questions: Which runtime handled this request? Which tool was called? Was the response validated? What version of the policy was active? Did any cross-role action occur?

AgentCore can host the Strands loop while deterministic services continue to own authorization. The model remains a proposer, not a policy engine.

## Adapting the agent to the Runtime contract

The TypeScript AgentCore Runtime contract is intentionally small:

- `GET /ping` reports health;
- `POST /invocations` accepts the bounded planning request;
- the service listens on port 8080; and
- TypeScript is transpiled to JavaScript before packaging.

TenderLoop's runtime adapter reuses the same input and output constraints as the Next.js route. It accepts only a synthetic assignment, selected difficulty, and pacing preference. The Strands agent exposes the same `build_study_plan` tool and uses Nova Lite through Bedrock.

The deployment artifact contains no browser secrets and no `NEXT_PUBLIC_` credentials. Runtime model access belongs to an AWS execution role with the minimum required Bedrock permissions.

## What we would connect next

AgentCore Runtime is one layer of the intended AWS design:

1. Amazon Cognito verifies users and family-scoped roles.
2. API Gateway and Lambda provide typed deterministic services.
3. Cedar policy evaluates role, consent, scope, expiry, and approval.
4. DynamoDB stores plans, Help Cards, consent receipts, caregiver grants, and audit events.
5. EventBridge Scheduler delivers only approved reminders.
6. Bedrock Guardrails adds a model-safety layer without replacing product policy.

The frontend should never send a parent's request directly into the student's private agent context. It should request a typed, policy-evaluated object. That is the same consent boundary demonstrated locally, carried into durable infrastructure.

## Honest deployment evidence

Hackathon demos create pressure to overstate cloud completion. We chose visible provenance instead. The interface says **Safe preview** when the deterministic fallback ran and **Strands + Nova Lite** only when a live invocation succeeded. The architecture diagram distinguishes shipped components from deployment milestones.

That honesty helps reviewers understand both the working product and the production path. It also gives the team a practical release gate: do not claim AgentCore hosting until the runtime ARN, successful invocation, and observability evidence are recorded.

## The lesson

“Cloud-ready” should mean more than putting a container online. For TenderLoop, it means an agent whose authority remains bounded when it leaves the laptop: validated inputs, typed tools, limited turns, least-privilege identity, explicit consent, attributable actions, and observable provenance.

The public demo is available at https://tenderloop-two.vercel.app, and the MIT-licensed source and architecture are at https://github.com/Pinegrass/tenderloop.
