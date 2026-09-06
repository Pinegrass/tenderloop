# TenderLoop AgentCore runtime adapter

This package adapts the bounded TenderLoop Student Coach to the Amazon Bedrock
AgentCore Runtime HTTP contract.

## Local verification

```bash
npm install
npm run check
npm run build
npm start
```

The service exposes:

- `GET /ping`
- `POST /invocations`

Example request:

```json
{
  "assignment": "Friday science project about local water quality",
  "difficulty": "starting",
  "comfort": "regular"
}
```

The deployment entry point is `dist/app.js`, targeting Node.js 22. The runtime
execution role should have only the Bedrock model invocation permissions required
for Amazon Nova Lite. Do not deploy this package using AWS root credentials.
