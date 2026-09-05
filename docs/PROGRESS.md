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
- Public production demo deployed to Vercel at <https://tenderloop-two.vercel.app>; visual rendering, browser console, production API fallback, deployment status, and recent error logs were verified.
- A timed 4:15–4:35 demo-video script and recording checklist are ready in `media/DEMO_VIDEO_SCRIPT.md`.

## Current access note

- Local AWS CLI access is authenticated with temporary `aws login` credentials. The session currently uses the AWS root identity; replace this with a least-privilege deployment role before production use and never create permanent root access keys.
- The public demo should remain in clearly labelled deterministic-preview mode until a scoped Vercel-to-AWS credential path is configured.

## Pending

1. Record the real local Strands/Nova Lite flow and publish the demo video (five minutes or less).
2. Add the video and live-demo URLs, final story, tags, and captions to Devpost.
3. Review the public submission and obtain explicit approval before final submission.
4. Optional scoring milestone: deploy the bounded agent to Amazon Bedrock AgentCore Runtime using a least-privilege role.

## Devpost state

- Draft progress: 3/5 steps.
- Time remaining when last checked: 24 days.
- Project Story, Built With tags, gallery captions, and public video URL were blank when last inspected. The live-demo URL is now ready to add.
- Seven uploaded gallery images remain present.
