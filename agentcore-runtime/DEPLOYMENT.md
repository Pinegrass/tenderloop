# AgentCore deployment runbook

The local runtime and CodeZip artifact are ready, but deployment must use a
least-privilege IAM or IAM Identity Center principal—not the AWS account root.

## Verified locally

- TypeScript check passes.
- The Node.js 22 CommonJS bundle builds successfully.
- `GET /ping` returns `{"status":"Healthy","service":"tenderloop-student-coach"}`.
- `TenderLoop-AgentCore-CodeZip.zip` contains the bundled `dist/app.js` entry
  point and `package.json`.

## Deployment inputs

- Runtime name: `TenderLoopStudentCoach`
- Runtime: `NODE_22`
- Entry point: `dist/app.js`
- Protocol: `HTTP`
- Network mode: `PUBLIC` for the hackathon demo
- Model: Amazon Nova Lite through the geography-bound APAC inference profile
  (`apac.amazon.nova-lite-v1:0`)
- Region: `ap-south-1` (Mumbai), which supports AgentCore Runtime and Amazon Nova Lite

## Required safety gate

1. Authenticate the CLI with an IAM Identity Center or delegated IAM role.
2. Confirm `aws sts get-caller-identity` does not return the account root ARN.
3. Create a dedicated runtime execution role using the templates in `iam/`.
4. Replace `ACCOUNT_ID` and `REGION` in private deployment copies; do not commit
   account identifiers.
5. Upload the CodeZip to a private S3 bucket.
6. Create the runtime with the S3 code configuration, `NODE_22`, and
   `dist/app.js` entry point.
7. Invoke the runtime with synthetic data and capture the runtime ARN,
   successful response, and CloudWatch evidence before updating public claims.

## Vercel production invocation

TenderLoop uses Vercel OIDC federation instead of long-lived AWS keys. Create a
production-only invocation role from the templates in `iam/`, replacing placeholders
in private copies. Configure these server-side Vercel variables:

- `AGENTCORE_RUNTIME_ARN`
- `AGENTCORE_REGION=ap-south-1`
- `AGENTCORE_QUALIFIER=DEFAULT`
- `AWS_ROLE_ARN` (the narrow Vercel invocation role)

Enable Vercel Secure Backend Access using the team issuer before deploying. If the
runtime is unavailable or its response fails validation, the web app returns its
clearly labelled deterministic Safe Preview instead of presenting a failed LLM call
as successful.

AgentCore resources can incur AWS charges. Configure a budget or billing alarm
before leaving the runtime available beyond judging.
