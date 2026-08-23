# ScopeCareer — Test, Conformance, and Evaluation Strategy

Status: Working verification strategy
Last updated: 2026-08-23

## Principle

Testing is not "unit + e2e". ScopeCareer requires separate verification classes because
its core risks are semantic (wrong meaning), authorization (wrong access), epistemic
(wrong certainty), and effect-class (wrong action) — none of which happy-path tests catch.

## Verification taxonomy

| Class | What it proves | Where it lands |
|---|---|---|
| Semantic conformance | Registries, cross-references, JSON Schema integrity | exists (`contracts/v1/validate_contracts.py`) |
| Program conformance | DAG/gates/registries integrity; local-semantics scan | exists from planning layer (`implementation/validate_program.py`) |
| Domain unit tests | Invariants per entity/value object | P5+ production code |
| State-machine / property tests | Orthogonality under any legal action sequence | P5+ (mandatory, see below) |
| Policy / AuthZ tests | Deny-by-default behavior per principal/purpose/scope | P5+ |
| Schema compatibility | No silent breaking change to contracts or client types | P4+ CI |
| API contract tests | Server honors implementation contracts exactly | P4+ |
| Integration tests | Service boundaries honor event/outbox semantics | P5+ |
| Persistence tests | Ledger correctness, idempotency, migrations | P5+ |
| Migration tests | Up/down migrations on representative data | P5+ |
| Cross-client conformance | Web/PWA/Extension/MCP project the same semantics | extends `contracts/v1/conformance/cases.json` |
| Browser E2E | Journeys walkable end-to-end in production build | P6+ |
| Accessibility | WCAG 2.2 AA automated + manual passes | P6+ |
| Performance | Budgets and ratchets hold (doc 27) | P3 baselines → CI ratchet |
| Security tests | Threat catalog mitigations hold (doc 24) | P5+ |
| AI evaluations | Definition of Correctness per function (below) | P11 gate |
| Prompt-injection / adversarial eval | Untrusted content cannot steer AI into violations | P10/P11 |
| Failure injection | Degradation ladders behave as designed | P12 |
| Backup/restore drills | Restores actually work | P5 cadence → P14 gate |
| Deployment/rollback | Every release can be rolled back | P5+ |
| Production smoke | Deployed artifact is the tested artifact | P13+ |

## Property/state-machine testing requirement (mandatory)

For every Opportunity, under **any legal sequence of canonical actions**:

```text
Disposition ⊥ SearchState ⊥ SelectionState ⊥ Priority
```

must remain orthogonal — no sequence may collapse one dimension into another or invent a
transition absent from `contracts/v1/states`. Generative property tests over registered
transitions are required at P5; five happy paths are not conformance.

## AI Definition of Correctness

Production AI is not judged by "output looks good". Every AI function must declare:

```text
input contract · allowed evidence · output schema
epistemic requirement · model/version binding · tool permissions
commit authority (always none) · failure behavior
latency budget · cost budget · eval dataset · hard-failure cases
```

This extends the existing `contracts/v1/ai-functions` registries (18 functions,
16 eval cases) into the production quality system — they are the embryo, never discarded.

Hard failures (automatic fail, no human override at eval time):

- AI invents candidate achievements or evidence;
- AI upgrades inference to `Known`;
- AI drops source provenance;
- AI silently changes canonical state;
- AI presents an access-route assessment as fact;
- AI executes or proposes execution of an external effect without approval.

## No green-by-mock (INV-17)

Critical boundaries — policy decisions, effect gates, ledger writes, AI commit attempts —
are tested against real contract behavior. A mock that asserts its own assumptions is not
evidence.
