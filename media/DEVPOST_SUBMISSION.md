# TenderLoop — Devpost submission copy

## Public project story

## Inspiration

Homework conflict is often treated as a tutoring problem, but the harder problem is coordination. A student may not know how to begin. A parent may see a deadline but not know what kind of help would actually be useful. A babysitter or trusted relative may need tonight’s logistics without needing access to grades, health details, or private conversations.

Most family-learning products choose between a generic homework chatbot and a parent surveillance dashboard. TenderLoop explores a third path: private student support connected to explicit, consent-mediated family coordination.

**TenderLoop does not replace a parent or watch a child. It helps a student make a plan, ask for help, and lets a caring adult show up in the way the student actually needs.**

## What it does

TenderLoop is a student-first family coordination agent for learners aged 13–16.

In the demonstration, Maya has a Friday science project and soccer practice. TenderLoop:

1. asks whether starting, understanding, or finding time feels hardest;
2. turns the assignment into a small, editable study plan;
3. keeps the study conversation private by default;
4. uses Socratic hints rather than producing submit-ready graded work;
5. adapts the plan when Maya selects a private low-energy or screen-light study preference;
6. lets Maya preview and approve an exact **Help Card** for her father;
7. gives her father a concrete decision without showing raw chat or mood scores; and
8. gives a temporary caregiver a narrow, expiring **Caregiver Pass** for today’s logistics only.

Every shared object answers six questions: who can see it, what they see, why it is needed, how long access lasts, who approved it, and how it can be withdrawn.

## How we built it

The current repository contains a working Next.js 16 and React 19 interactive vertical slice, a shadcn/Radix component system, synthetic family and school data, a documented consent model, and a production-oriented AWS architecture contract.

The Student Coach is implemented behind a server-only API route with the official TypeScript **Strands Agents SDK**. It uses a validated `build_study_plan` tool, structured output, a three-turn execution limit, and a student-safety system prompt. When Bedrock credentials are unavailable, the UI identifies its deterministic fallback as **Safe preview** rather than pretending that an LLM ran.

The AWS implementation is designed around:

- **Strands Agents** for separately bounded Student Coach and Parent Guide roles;
- **Amazon Bedrock AgentCore Runtime** for deployment and observability;
- **Amazon Cognito** for verified identity and family-scoped roles;
- **API Gateway and AWS Lambda** for the deterministic role router and typed tools;
- **Cedar authorization** for role, consent, scope, expiry, and approval enforcement;
- **Amazon DynamoDB** for plans, Help Cards, consent receipts, Caregiver Passes, and audit events;
- **Amazon EventBridge Scheduler** for approved reminders; and
- **Amazon Bedrock Guardrails** as one layer in the safety boundary.

The language model is never the authority. It may draft a plan, Help Card, reminder, or response; deterministic policy and a human approval artifact decide whether a consequential tool can execute.

At this stage, the public repository’s working implementation includes the interactive frontend, the bounded Strands Student Coach, and the complete local consent-mediated Help Card handoff. AgentCore hosting and the AWS persistence layer shown in the architecture diagram remain deployment milestones and will be identified as complete only when deployment evidence is present in the repository.

## Challenges we ran into

The central challenge was not prompt engineering; it was defining the boundary between helpful context and surveillance.

We separated:

- legal authority from day-to-day caregiving;
- operational permissions from data visibility;
- private conversations from shared coordination objects;
- functional study accommodations from diagnoses or symptom narratives; and
- an agent proposal from an authorized action.

We also avoided assuming one nuclear-family model. TenderLoop represents a configurable circle of care, multiple households, user-defined relationships, and expiring grants. It never mediates custody or assumes the registered parent is always the safest adult for an escalation.

## Accomplishments that we are proud of

- A child-readable share preview states both **what Dad will see** and **what Dad will not see**.
- The parent experience contains no transcript, inferred mood, risk score, streak, or behavior ranking.
- The Caregiver Pass demonstrates useful temporary authority without general account access.
- Wellbeing is implemented as private functional accommodation—shorter blocks, reduced screen load, rest, or human handoff—not diagnosis or medical advice.
- The interface makes agent activity and approval boundaries visible instead of hiding them behind a chatbot.

## What we learned

Family software cannot reduce culture and relationships to a single “Western family” template. A safer engine needs configurable roles, households, schedules, languages, communication preferences, accessibility needs, jurisdiction packs, and explicit provenance for each piece of context.

We also learned that multi-agent architecture is not automatically better. TenderLoop deliberately uses two bounded language-model roles and a deterministic caregiver service. Cross-role communication occurs through stored, student-approved objects—not invisible agent-to-agent conversation.

## What’s next for TenderLoop

1. Run and capture the first Bedrock-backed Strands execution.
2. Deploy the bounded runtime on Amazon Bedrock AgentCore.
3. Add DynamoDB consent artifacts and Cedar-enforced typed tools.
4. Connect the verified local Help Card flow to the AWS persistence layer.
5. Add privacy, role-escalation, prompt-injection, academic-integrity, and safety red-team tests.
6. Complete specialist review before enabling any health or crisis-related production flow.

The goal is not more engagement. Success means less repeated prompting, faster time to start, more student-initiated requests for specific help, fewer unnecessary parent alerts, and zero unauthorized disclosure in testing.

## Built-with tags

Recommended tags, in this order:

1. Strands Agents
2. Amazon Bedrock AgentCore
3. Amazon Bedrock
4. Amazon Cognito
5. AWS Lambda
6. Amazon API Gateway
7. Amazon DynamoDB
8. Amazon EventBridge
9. Cedar
10. Next.js
11. React
12. TypeScript
13. Tailwind CSS
14. shadcn/ui
15. Radix UI

Planned AWS services must be removed from the final tags if they are not genuinely implemented by submission time.

## Try-it-out links

- Public repository: https://github.com/Pinegrass/tenderloop
- Live demo: https://tenderloop-two.vercel.app

## Image-gallery order

1. `tenderloop-cover.png`
2. `01-student-plan.png`
3. `02-help-card-consent.png`
4. `03-parent-request.png`
5. `04-caregiver-pass.png`
6. `05-wellbeing-accommodation.png`
7. `06-architecture.png`

## Additional Info recommendations

- Track: **Everyday Agents**
- Public code repository: `https://github.com/Pinegrass/tenderloop`
- Architecture diagram: `media/06-architecture.png`
- Live demo: `https://tenderloop-two.vercel.app`
- Testing instructions:

  ```text
  The current demo uses synthetic data only. Open the live URL and use the “Demo perspective” control to switch between Maya (Student), Daniel (Parent), and Alex (Caregiver). In the Student view, select a study-comfort option and open “Make a Help Card” to inspect the exact share preview. Choose “Keep private” to close it. Switch to Parent to verify that only the approved Help Card and shared schedule are visible. Switch to Caregiver to verify that access is logistics-only and expires at 9:00 PM. No account, payment, school credential, or real child data is required.
  ```

## Required user-supplied fields

- Submitter type: Individual / Team of Individuals / Organization
- Country of residence
- Organization name, if applicable
- AWS Builder ID
- Hosted YouTube or Vimeo demo URL
- Optional live demo URL once deployed
