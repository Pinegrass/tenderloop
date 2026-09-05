# TenderLoop demo video script

Target length: 4:15–4:35. Maximum allowed: 5:00.

## 0:00–0:25 — Problem and audience

Show `tenderloop-cover.png`, then the Student view.

> Homework conflict is often a coordination problem, not just a tutoring problem. A student may not know how to start, while a parent knows a deadline but not what help would actually be useful. TenderLoop is a privacy-first family coordination agent for students aged thirteen to sixteen.

## 0:25–1:25 — Real Strands study plan

Record the local app at `http://127.0.0.1:3000` with the authenticated AWS CLI session. Select **Understanding**, choose **Screen-light pace**, then click **Create my plan**. Pause on the **Strands agent** badge and generated plan.

> Maya's private Student Coach uses the Strands Agents SDK with Amazon Nova Lite. She chooses what is difficult and a functional study preference. The agent has a three-turn budget and one validated tool. It creates a small study plan, teaches without completing graded work, and never treats a comfort preference as a diagnosis. The Strands agent badge confirms that this response came from the live Bedrock path rather than the deterministic preview.

## 1:25–2:30 — Consent-mediated Help Card

Click **Make a Help Card**. Show both the “Dad will see” and “Dad will not see” panels. Click **Share this Help Card**, then switch to **Parent · Daniel**.

> The raw conversation stays private. TenderLoop drafts a Help Card, and Maya previews the exact words before anything crosses roles. The preview also makes exclusions visible: Daniel will not receive her conversation, comfort setting, drafts, or inferred mood. Only after Maya approves does Daniel receive one concrete request for ten minutes of source-finding help.

## 2:30–3:15 — Parent response and audit boundary

In Daniel's view, show the shared card and click the bounded acceptance action. Open **Activity log**.

> Daniel can respond to the bounded request without receiving a surveillance dashboard. The family activity log records approvals and shared actions, but excludes Maya's private chat. The language model proposes; deterministic policy and human approval govern consequential actions.

## 3:15–3:45 — Temporary caregiver

Switch to **Caregiver · Alex** and show the expiring logistics-only pass.

> A temporary caregiver sees only today's logistics and the authority needed for the handoff. Alex cannot see grades, study conversations, or wellbeing preferences, and access expires at nine PM.

## 3:45–4:20 — Architecture and implementation

Show `06-architecture.png`, then briefly show the public demo.

> TenderLoop is built with Next.js, React, TypeScript, the official Strands Agents SDK, and Amazon Bedrock. The public demo runs in a clearly labelled safe-preview mode, while the repository's live Strands and Nova Lite path has been verified locally. AgentCore hosting, durable consent objects, and least-privilege production identity are the next architecture milestones.

## 4:20–4:35 — Close

Return to the cover.

> TenderLoop turns nagging into navigating: private support for the student, specific help for the parent, and only the minimum access a caregiver needs.

## Recording checklist

- Keep the final export under five minutes.
- Capture the local live-Strands badge and one successful generated plan.
- Do not expose the terminal, AWS account identifiers, credentials, browser callback URLs, or real child data.
- Use only the synthetic Maya, Daniel, and Alex scenario.
- Upload to YouTube as **Public**, not Unlisted, because the rules require a public video.
- Suggested title: `TenderLoop — Privacy-first family coordination with Strands Agents`
- Suggested description: `TenderLoop is an Everyday Agents entry for the AWS Agents for Humans Hackathon. It helps students build small study plans and share exact, consent-approved Help Cards with family—without exposing private conversations. Live demo: https://tenderloop-two.vercel.app | Code: https://github.com/Pinegrass/tenderloop`
