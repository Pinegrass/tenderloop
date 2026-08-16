# TenderLoop

**From nagging to navigating.** A caring family coordination agent that helps students study, parents support, and trusted caregivers act—without surveillance.

TenderLoop is our entry for Amazon’s Agents for Humans hackathon, in the **Everyday Agents** track. Its defining boundary is simple: student conversations remain private; only explicit, previewed objects such as study plans, Help Cards, schedule items, and temporary Caregiver Passes cross roles.

## Current prototype

The first interactive slice contains three synthetic perspectives:

- Maya, a 14-year-old student who turns an assignment into a small plan and approves exactly what to share;
- Daniel, a parent who receives a concrete Help Card rather than a transcript or mood score;
- Alex, a temporary caregiver whose logistics-only access expires at 9 PM.

Run it locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Product and engineering docs

- [Product manifesto](docs/MANIFESTO.md)
- [Architecture and security contract](docs/ARCHITECTURE.md)

## Planned AWS implementation

Next.js will call an authenticated AWS API backed by Cognito, API Gateway and Lambda, Amazon Bedrock AgentCore Runtime, Strands Agents, Cedar authorization, DynamoDB, EventBridge Scheduler, and CloudWatch. The language model proposes; deterministic policy and explicit human approval govern consequential actions.

All demo data is synthetic. TenderLoop is an AI support tool—not a parent, therapist, diagnostician, or disciplinarian.

Student wellbeing is handled as private, functional study accommodations and human handoffs—not diagnosis, symptom assessment, treatment advice, or mood surveillance. See the health and wellbeing boundary in the [product manifesto](docs/MANIFESTO.md).

## License

MIT
