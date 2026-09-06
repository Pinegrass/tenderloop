# Agents for Humans: Building TenderLoop's Bounded Strands Student Coach

Homework conflict often looks like a tutoring problem. In practice, the harder part is coordination: a student cannot find a starting point, a parent does not know what help is useful, and everyone risks turning a small assignment into a tense family loop.

For the Agents for Humans Hackathon, we built TenderLoop as a student-first coordination agent. It helps a learner turn an assignment into a short plan, then lets the learner request a specific kind of support without exposing the underlying study conversation.

## Why the agent is deliberately bounded

An unconstrained chatbot could draft a long answer, complete graded work, or reveal too much context to an adult. TenderLoop instead gives the Student Coach one typed tool: `build_study_plan`.

The tool accepts only three pieces of bounded input:

- a short assignment description;
- the student's selected difficulty—starting, understanding, or finding time; and
- a functional pacing preference—regular, low-energy, or screen-light.

The output is validated with Zod. It contains a warm acknowledgement, two to four short steps, a check-in question, and an optional suggestion for narrow adult help. Each step is capped at 25 minutes, and the agent has a three-turn and 700-output-token budget.

This structure matters because the model is not the authority. The model can propose a plan; deterministic validation decides whether the proposal fits the product contract.

## Strands Agents and Amazon Nova Lite

The server-only implementation uses the official TypeScript Strands Agents SDK. A `BedrockModel` is configured for Amazon Nova Lite in the Stockholm Region. The agent's system prompt requires the planning tool, prohibits diagnosis and surveillance, and instructs the coach to teach without producing submit-ready graded work.

The route keeps credentials on the server and rejects oversized or invalid requests before the model is called. It also labels provenance in the response so the interface can show whether a plan came from the live Strands path or from the deterministic preview.

That fallback is intentional. A demo should remain testable when cloud credentials are unavailable, but it should never pretend that an LLM ran. TenderLoop therefore displays **Safe preview** when it uses deterministic logic and **Strands + Nova Lite** only after a real Bedrock invocation succeeds.

## From a plan to an authorized action

The Student Coach does not directly message a parent. Instead, the student can open a Help Card, review the exact text to be shared, and approve or keep it private.

The parent receives one bounded request—not a transcript, inferred mood, risk score, streak, or behavior ranking. This creates a clean boundary between agent generation and human authorization:

1. Strands proposes a small plan.
2. The student edits or accepts it.
3. The student previews a Help Card.
4. Only explicit approval creates a cross-role object.
5. The parent's response is attributable in a family activity trail.

## What we learned

The most useful agent was not the one with the largest prompt or the most tools. It was the one whose authority was easiest to explain.

Strands Agents made the model, tool, limits, and structured output visible in code. Amazon Nova Lite gave us a practical Bedrock model for the planning task. The product design then completed the safety boundary with explicit consent and minimum-necessary sharing.

TenderLoop's goal is not more engagement. Success means a faster start, a clearer request for help, fewer repeated reminders, and no unauthorized disclosure.

Try the public demo at https://tenderloop-two.vercel.app and review the source at https://github.com/Pinegrass/tenderloop.
