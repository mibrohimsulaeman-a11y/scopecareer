# ScopeCareer — Engineering Invariants and Quality Gates

Status: Non-negotiable engineering constitution
Last updated: 2026-08-23

## Purpose

This document defines the engineering invariants that make security, performance, and
maintainability continuous properties instead of a "hardening sprint at the end". It binds
every human and agent working on production code from P4 onward. Machine-readable form:
`implementation/quality-gates.json`.

The invariants extend, and never redefine, `contracts/v1/` semantics.

## Invariants (INV-01..INV-17)

| ID | Concern | Invariant | Enforcement tier |
|---|---|---|---|
| INV-01 | Business logic | One canonical implementation per business rule; no rule re-implemented per client/layer | automated_later (boundary checks), process now |
| INV-02 | State | Every canonical state mutation follows the registered state machine in `contracts/v1/states` | automated_now (reference UI dispatcher already enforces; production: contract tests) |
| INV-03 | Authorization | Every mutation is authorized server-side against principal + purpose + scope | automated_later (policy test suite at P5) |
| INV-04 | External effects | Draft/prepare/assess never triggers send/share/publish/apply without a recorded approval | automated_later (effect-gate conformance cases) |
| INV-05 | UI authority | The UI is never the authority for domain state, authorization results, or policy eligibility | automated_now (`--scan-clients`) + review |
| INV-06 | AI authority | AI has no self-granted commit authority over canonical state or external effects | automated_now (registry: commit_authority=none for all AI functions) |
| INV-07 | Data epistemics | Provenance and epistemic status are never dropped, flattened, or silently upgraded | automated_later (schema compat + eval hard-failures) |
| INV-08 | Duplication | Enums, schemas, policies, actions are defined once (canonical contracts) and derived everywhere else | automated_now (`--scan-clients`) |
| INV-09 | Dead code | No unreachable feature ships without an owner and a removal condition; feature flags carry full metadata | automated_later (dead-code scan from P4 tooling); flag metadata registry-checked |
| INV-10 | Security | Deny-by-default, least privilege on every boundary | process + security review per WP |
| INV-11 | Privacy | Purpose/sensitivity scoping on every data flow | process + privacy classification in DoD |
| INV-12 | Performance | Regression budgets are mandatory once baselines exist (P3+) | automated_later (perf ratchet CI) |
| INV-13 | Accessibility | WCAG 2.2 AA target on all candidate-facing surfaces | automated_later (a11y suite); manual pass per WP |
| INV-14 | Reliability | Failure modes and recovery paths are designed and tested, not discovered | process + failure-injection suite |
| INV-15 | Observability | Every material operation is traceable end-to-end | automated_later (tracing conformance at P5) |
| INV-16 | Deployment | Every schema/data change ships with migration + tested rollback | automated_later (migration discipline gate at P5) |
| INV-17 | Testing integrity | No green-by-mock: critical boundaries are tested against real contract behavior | process + test review per WP |

Enforcement tiers:

- `automated_now` — enforceable by existing zero-dependency gates today.
- `automated_later` — becomes automated when the referenced tooling exists (P4/P5+).
- `process` — mandatory checklist/review item until then. A tier may only move rightward
  via decision-register entry.

## Uniform Definition of Done (DOD-STD)

A work package may be marked DONE only when all of the following hold:

1. Contract satisfied — every touched semantic maps to `contracts/v1/`.
2. Business invariants preserved (INV-01..INV-17 reviewed where relevant).
3. No unauthorized new semantics invented locally.
4. Security reviewed (threat model delta recorded where applicable).
5. Privacy classification handled for any new data field/flow.
6. Tests added or updated for new behavior.
7. Semantic conformance green (contract validator + program validator).
8. No duplicated canonical logic introduced.
9. No new orphan/dead code; no undocumented flags.
10. Architecture boundaries respected (layer map in `23`).
11. Accessibility checked for UI changes.
12. Performance regression checked against budgets once they exist.
13. Observability included for material operations (once P5 platform exists).
14. Failure/degraded behavior handled, not just happy path.
15. Docs/ADR updated if decisions were made.
16. Migration/rollback handled when persistence or API shape changed.

"Works in browser" is roughly 20% of this list. Verification commands must actually run;
a receipt with fabricated output is a program-level violation.

## Feature flag governance

Every flag must declare:

```json
{
  "name": "flag.id",
  "owner": "team-or-agent-id",
  "created_at": "ISO date",
  "purpose": "why this exists",
  "removal_condition": "what proves it can be deleted",
  "review_date": "ISO date"
}
```

Flags missing metadata fail validation. Permanent flags are forbidden; a flag that cannot
state its removal condition is second architecture and gets rejected.

## Abstraction policy

An abstraction is created only when it has at least two concrete use-cases. "For future
proofing" is not a reason. Reuse semantics, not UI: shared components must share actual
behavior, not merely look similar.
