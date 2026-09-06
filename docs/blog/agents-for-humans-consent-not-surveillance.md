# Agents for Humans: Designing Consent Instead of Family Surveillance

Family software often makes a false choice: give a young person a generic private chatbot, or give adults a dashboard that watches everything. TenderLoop explores a third path—private student support connected to explicit, consent-mediated coordination.

We built TenderLoop for the Everyday Agents track of the Agents for Humans Hackathon. The product serves learners aged 13–16, parents, and temporary caregivers who need enough context to help without receiving unrestricted access to a student's inner life.

## The boundary came before the interface

Before designing screens, we wrote down what the system must not do. TenderLoop must not expose raw study conversations, infer a child's mood for a parent, rank behaviour, diagnose health conditions, or let a temporary caregiver browse general family data.

That led to a simple architectural rule: language-model roles do not pass invisible conversations to each other. Cross-role communication happens through stored, reviewable objects.

The most important object is the Help Card. It contains one assignment, one specific request, an intended recipient, an expiry, and a record of who approved it. Before sharing, the student sees both **what Dad will see** and **what Dad will not see**.

The same pattern powers the Caregiver Pass. A babysitter or relative may need today's pickup location and timing, but not grades, health narratives, or account-wide access. TenderLoop grants logistics-only visibility and automatically expires it at 9 PM.

## Six questions for every shared object

We found that consent becomes concrete when every share answers six questions:

1. Who can see it?
2. What exactly can they see?
3. Why is it needed?
4. How long does access last?
5. Who approved it?
6. How can it be withdrawn?

These questions are useful beyond family learning. They can govern workplace approvals, community support, healthcare navigation, or any agent that moves information between people with different roles.

## Designing for agency, not compliance

The student experience uses warm, non-punitive language and small editable steps. TenderLoop asks whether starting, understanding, or finding time feels hardest. It does not assume laziness, manufacture urgency, or turn every missed task into an adult notification.

Functional comfort options—regular, low-energy, and screen-light—adjust pacing and interface load. They do not ask for a diagnosis. If something may require medical or crisis support, the product routes to a trusted person rather than presenting itself as a clinician.

The parent view is intentionally less detailed than the student view. That is not missing functionality; it is the privacy model working. Daniel sees the approved Help Card and shared schedule, then records a bounded response. He does not receive Maya's transcript or private pacing selection.

## Where Strands Agents fits

The Student Coach uses the TypeScript Strands Agents SDK with Amazon Nova Lite on Bedrock. It can call one validated planning tool and return structured output within strict turn and token limits.

The agent drafts. Deterministic policy validates. A human approves. This separation keeps the generative model useful without treating fluent text as authorization.

## What surprised us

Multi-agent architecture is not automatically safer. Adding more conversational roles can create more invisible data paths. TenderLoop therefore uses narrowly bounded roles and a deterministic caregiver service. Shared context has provenance, scope, and expiry.

We also learned that “family” cannot mean one household structure. A credible coordination engine needs configurable relationships, multiple households, cultural and language preferences, accessibility needs, and careful escalation rules. It should never mediate custody or assume the registered parent is always the safest adult.

The result is a product that tries to make care easier without making surveillance normal.

Explore TenderLoop at https://tenderloop-two.vercel.app and see the public implementation at https://github.com/Pinegrass/tenderloop.
