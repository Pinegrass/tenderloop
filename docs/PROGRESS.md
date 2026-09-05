# TenderLoop delivery tracker

Last verified: 2026-09-05 (India Standard Time)

## Complete

- Devpost draft created under Pinegrass Technologies in the Everyday Agents track.
- AWS Builder ID created for `dev@pinegrass.in` and AWS root MFA confirmed by the account owner.
- GitHub repository published at <https://github.com/Pinegrass/tenderloop>.
- Desktop/laptop Next.js interface built and verified.
- Official TypeScript Strands Agents SDK integrated behind a server-only route.
- Student-to-parent Help Card consent loop verified end to end with synthetic data.
- Seven Devpost gallery assets uploaded.
- AWS zero-spend guardrail created for `dev@pinegrass.in`; verified spend was $0.00 at creation.
- AWS account activation confirmed: the Bedrock catalog and APIs are accessible in Europe (Stockholm).
- Real Strands invocation verified against Amazon Nova Lite through `/api/coach`; the response reported `engine: "strands"`, called the validated `build_study_plan` tool, and returned HTTP 200 with schema-valid structured output.
- Local lint, TypeScript, and optimized production build verified successfully on 2026-09-04.

## Current access note

- Local AWS CLI access is authenticated with temporary `aws login` credentials. The session currently uses the AWS root identity; replace this with a least-privilege deployment role before production use and never create permanent root access keys.
- The public demo should remain in clearly labelled deterministic-preview mode until a scoped Vercel-to-AWS credential path is configured.

## Pending

1. Commit and publish the verified Nova Lite configuration.
2. Deploy the public desktop web demo in deterministic-preview mode.
3. Record the real local Strands/Nova Lite flow and publish the demo video (five minutes or less).
4. Add the video and live-demo URLs, final story, tags, and captions to Devpost.
5. Review the public submission and obtain explicit approval before final submission.
6. Optional scoring milestone: deploy the bounded agent to Amazon Bedrock AgentCore Runtime using a least-privilege role.

## Devpost state

- Draft progress: 3/5 steps.
- Time remaining when last checked: 24 days.
- Project Story, Built With tags, Try It Out link, gallery captions, and public video URL were blank.
- Seven uploaded gallery images remain present.
