# ScopeCareer — Production Architecture Decision Framework

Status: Decision framework + candidate reference architecture (non-binding until GATE-P3)
Last updated: 2026-08-23

## Purpose

Define how production architecture will be decided, and document the leading candidate
now — so that P3 starts from an evaluated field instead of a blank page. Nothing here is
ratified: per ADR-0001, stack selection happens at GATE-P3, after PV-1 evidence and the
V1 recut.

## Decision drivers (weighted equally at gate time unless the register says otherwise)

1. Contract conformance fit — can the platform express `Capability → Object → State →
   Action → Policy → Evidence/Effect` without fighting it?
2. Security posture — identity, tenancy, policy enforcement points, audit trail, secret
   management; alignment with NIST SSDF practices.
3. Workload profile — read-heavy intelligence projections, event-ledger writes,
   background research tasks, AI orchestration latency/cost.
4. Cost — infrastructure + AI cost per user and per intelligence operation at V1 scale
   (hundreds of users), not hypothetical scale.
5. Operability — by a small team plus coding agents; deployment, debugging, migration.
6. Ecosystem/hiring maturity and exit/portability cost.

## Candidate reference architecture: contract-first microservices

**Status: candidate. Ratification requires GATE-P3.** The decomposition below is derived
from contract domains so that service seams follow semantic boundaries, not org charts.

### Candidate service decomposition map

| Service | Owns (canonical truth) | Primary contracts |
|---|---|---|
| Identity & Tenancy | Principals, credentials, sessions, tenant config | clients, policies |
| Career Data Vault | Career evidence objects, sensitivity, consent, retention | entities (career), policies |
| Evidence & Assertion | Observations, assertions, assessments, epistemic state | epistemic chain |
| Opportunity Intelligence | Opportunities, dossiers, source observations | entities (opportunity), states |
| Pursuit Workspace | Disposition, search/selection state, priority, workspace records | states, actions (pursuit) |
| Access & Relationships | Relationship facts, access-route assessments | entities (relationship) |
| Market Intelligence | Company/market context, signals | capability registry |
| AI Orchestration | Bounded AI functions, evals, model routing — no commit authority | ai-functions, mcp |
| Ingestion / Capture Gateway | Untrusted-content capture (extension, manual), normalization | client trust boundary D-025 |
| Audit & Observability Platform | Event ledger, audit trail, tracing backend | effect classes |

Rules:

- Each service owns its data store. No cross-service database reads.
- Sync calls only for query-time projection needs; all state-changing flows use events
  (outbox pattern) with idempotent consumers.
- Cross-service workflows (e.g., Pursue touching Vault + Opportunity + Workspace) are
  application-layer sagas with explicit compensation.

### Guardrails (anti-patterns to reject in review)

- Distributed monolith: services that must deploy together.
- Shared databases between services.
- LLM → database/email/apply direct paths (must traverse policy + effect gates).
- Service proliferation before workload justifies it — a service may begin as a module;
  extraction follows measured seams.

## Candidate technology longlist (all `candidate`; illustrative, not endorsements)

Selection scoring is **not run before GATE-P3**.

| Category | Candidates on the longlist |
|---|---|
| Service language/runtime | TypeScript/Node, Go, Python/FastAPI, JVM/Kotlin |
| Relational store | PostgreSQL (+ row-level security for tenancy) |
| Search | OpenSearch, Meilisearch/Typesense |
| Vector search | pgvector vs dedicated engine |
| Queue/streaming | Redpanda/Kafka, RabbitMQ, managed queues (SQS-like) |
| Cache | Redis/Valkey |
| Runtime/orchestration | Kubernetes, managed containers, single-provider PaaS for early phases |
| AI gateway/routing | Self-built gateway vs LiteLLM-style proxy |
| AuthN/IAM | Keycloak self-hosted, Ory stack, managed IdP |
| Observability | OpenTelemetry + Grafana stack vs vendor SaaS |

## Scoring method (executed only at GATE-P3)

Each candidate is scored 1–5 per driver, weighted by a weighting set ratified in the same
gate session. Hard disqualifiers regardless of score: cannot express orthogonal state
machines; cannot produce tamper-evident audit trails; cannot meet privacy data-residency
constraints; forces business truth into UI or prompts.

## ADR log

Machine-readable: `implementation/architecture-decisions.json`.

- **ADR-0001 (ratified): defer production stack selection until after PV-1 evidence and
  V1 recut.** Mirrors locked decision D-019/D-026 discipline.
- **ADR-0002 (candidate): adopt contract-first microservice decomposition as the
  reference architecture**, ratify or replace at GATE-P3 with workload evidence.

## Layer map for review (production code)

```text
1 Contracts        contracts/v1 + implementation contracts (P4)
2 Domain Core      invariants, entities/value objects, state transitions, epistemics
3 Application      command orchestration, transactions, idempotency, sagas, effects
4 Policy/AuthZ     principal, purpose, tenant, sensitivity, scope, consent
5 Infrastructure   adapters only: persistence, search, LLM providers, email, sources, queue
6 Projections      view models incl. availableActions/permissions/freshness
7 Clients          web, pwa, extension, MCP — projection only
```

Infrastructure contains no business truth. Dependencies point downward only.
