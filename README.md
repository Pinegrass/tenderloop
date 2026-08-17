# TenderLoop

**From nagging to navigating.** A caring family coordination agent that helps students study, parents support, and trusted caregivers act—without surveillance.

![TenderLoop project cover](media/tenderloop-cover.png)

TenderLoop is our entry for Amazon’s Agents for Humans hackathon, in the **Everyday Agents** track. Its defining boundary is simple: student conversations remain private; only explicit, previewed objects such as study plans, Help Cards, schedule items, and temporary Caregiver Passes cross roles.

## Current implementation

The laptop/desktop web app contains three synthetic perspectives:

- Maya, a 14-year-old student who turns an assignment into a small plan and approves exactly what to share;
- Daniel, a parent who receives a concrete Help Card rather than a transcript or mood score;
- Alex, a temporary caregiver whose logistics-only access expires at 9 PM.

The Student view now calls a server-only `/api/coach` route backed by the official
`@strands-agents/sdk`. The Strands agent is constrained to a validated
`build_study_plan` tool, a three-turn budget, and a student-safety system prompt.
When Bedrock credentials are absent, the same endpoint returns a clearly labelled
deterministic preview so the interface remains testable without pretending an LLM ran.

Run it locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

To run the real Strands path, configure one of the credential methods supported by
Amazon Bedrock, for example `AWS_BEARER_TOKEN_BEDROCK`, or standard AWS access-key
environment variables with Bedrock model access. Secrets stay server-side and must
not use a `NEXT_PUBLIC_` prefix.

## Product and engineering docs

- [Product manifesto](docs/MANIFESTO.md)
- [Architecture and security contract](docs/ARCHITECTURE.md)
- [Devpost media package](media/MEDIA_PLAN.md)

## AWS roadmap

The Strands Student Coach is implemented locally. The next deployment milestone is
to host the agent through Amazon Bedrock AgentCore Runtime and add authenticated role
boundaries, durable shared objects, scheduling, and observability. The language model
proposes; deterministic policy and explicit human approval govern consequential actions.

All demo data is synthetic. TenderLoop is an AI support tool—not a parent, therapist, diagnostician, or disciplinarian.

Student wellbeing is handled as private, functional study accommodations and human handoffs—not diagnosis, symptom assessment, treatment advice, or mood surveillance. See the health and wellbeing boundary in the [product manifesto](docs/MANIFESTO.md).

## License

MIT
