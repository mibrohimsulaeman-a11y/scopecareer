# ScopeCareer — Implementation Master Program

Status: Execution authority for the path to production GA
Last updated: 2026-08-23

## Purpose

This document is the **execution authority** for taking ScopeCareer from its current state
(semantic contracts frozen, complete fixture-driven reference UI, PV-1 prototype gate
passed, zero human ICP sessions) to production GA and continuous operation.

It defines phases with **exit gates**, not a calendar. Planning the full journey now does
not authorize premature stack selection: per `11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md`
and the repository authority hierarchy, no production framework, vendor, database, or
orchestration choice is ratified before Product Validation-1 (PV-1) evidence exists.
Candidate architectures may be documented (see `23`), but they remain candidates.

## The binding architecture principle

```text
PRODUCT TRUTH
Decisions + Semantic Contracts + Human Validation
                    │
                    ▼
        IMPLEMENTATION CONTRACTS
 Schema · Actions · Policies · Events · ViewModels
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Domain       Policy      Application
     Core       / AuthZ       Use Cases
        │           │           │
        └───────────┼───────────┘
                    ▼
              Infrastructure
      DB · Queue · Search · AI · Sources
                    │
             ┌──────┼──────┐
             ▼      ▼      ▼
            Web    MCP   Extension
             │
             ▼
      UI = projection only
```

> **Business truth never lives in UI code, database schema, MCP handlers, LLM prompts, or
> integration adapters.** Those layers only implement or project canonical semantics from
> `contracts/v1/`.

This continues the existing canonical chains:

- `Capability → Object → State → Action → Policy → Evidence/Effect`
- `Source → Observation → Assertion → Assessment → Recommendation`

## Phase table

| Phase | Title | Goal | Exit gate | Depends on |
|---|---|---|---|---|
| P0 | Repository Baseline | Commit all authority as-is; repo hygiene; branch policy | Clean reproducible baseline (`GATE-P0`) | — |
| P1 | Product Validation-1 | 6–8 moderated ICP sessions with checkpoints after P01–P03 | Evidence-backed synthesis (`GATE-P1`) | P0 |
| P2 | V1 Recut | Drop/defer unvalidated scope; resolve open product questions | V1 scope frozen (`GATE-P2`) | P1 |
| P3 | Architecture Decision | Evaluate candidate stacks against contracts, security, workload, cost | ADR set approved (`GATE-P3`) | P2 |
| P4 | Implementation Contracts | Schema/API/event/policy/view-model/security contracts | Machine-valid implementation contract (`GATE-P4`) | P3 |
| P5 | Production Foundation | Identity, tenancy, vault, policy engine, persistence, audit, observability | Foundation conformance green (`GATE-P5`) | P4 |
| P6 | Vertical Slice #1 | Capture → Assertion → Opportunity → Explore → Pursue → Access in production code | Production E2E slice (`GATE-P6`) | P5 |
| P7 | Career Intelligence | Evidence graph, career intent, artifact lifecycle | Career loop complete (`GATE-P7`) | P6 |
| P8 | Pursuit Workspace | Positioning, people, process, debrief, selection, offer | Pursuit lifecycle complete (`GATE-P8`) | P6 |
| P9 | Market & Strategy | Company/market context, signals, experiments | Intelligence loop complete (`GATE-P9`) | P7, P8 |
| P10 | Multi-surface | PWA hardening, browser extension, Candidate MCP | Cross-client conformance green (`GATE-P10`) | P6 |
| P11 | Production AI | Research, assessment, recommendations, grounded generation | AI evaluation + security gates green (`GATE-P11`) | P9, P10 |
| P12 | Hardening | Security, privacy, performance, reliability, DR, accessibility | Release candidate (`GATE-P12`) | P11 |
| P13 | Private Beta | Real users + production telemetry | Beta acceptance (`GATE-P13`) | P12 |
| P14 | GA Readiness | Legal, SLOs, support, incident response, backups, rollout | Production GA (`GATE-P14`) | P13 |
| P15 | Continuous Product Validation | Improve based on real outcomes | Continuous (`no exit`) | P14 |
| P16 | ScopeCareer V1.x | Validated deferred capabilities | Incremental releases (`per-release gate`) | P15 |
| P17 | Talent Product Track | Recruiter/search/hiring product on a separate trust plane | Separate trust-plane program approval (`GATE-P17`) | P14 |

P17 is a **separate program**: Talent never silently joins the Candidate backend because it
is "more practical". Trust planes stay split per D-014.

## Dependency chain (authoritative form)

```text
PV-1 (P1) → V1 Recut (P2) → Architecture decisions (P3)
  → Implementation contracts (P4) → Foundation (P5)
  → Vertical Slice 1 (P6) → Vertical Slices 2..n (P7–P10)
  → Production AI (P11) → Hardening (P12) → Beta (P13) → GA (P14)
```

The machine-readable graph is `implementation/work-packages.json` +
`implementation/dependency-graph.json`, validated by `implementation/validate_program.py`.
That graph — not this prose, not a calendar — is the scheduling authority. No phase starts
before its dependencies' gates are green.

## Horizontal gates

Security, privacy, UX/state boundaries, performance, testing/conformance,
anti-duplication, maintainability, and observability are **not phases at the end**. They
are horizontal gates applied at every node of the DAG:

- every work package passes the uniform Definition of Done (`22`);
- every invariant in `22` carries an enforcement tier;
- release-readiness rules in `29` apply from P5 onward, not from P12.

## Relationship to earlier planning documents

- `13-DELIVERY-DECOMPOSITION-BACKLOG.md` is a historical record of how the specification
  reached implementation readiness. Forward planning authority moves to this document.
- `19-UI-EXECUTION-ORCHESTRATION.md` recorded the completed reference-UI execution.
- `18`, `20` remain valid for the reference UI; production UI work follows `25`.

## Change control

Phase definitions, gates, and the DAG change only via the decision-change policy in
`11 §7`: an explicit decision-register entry, then a registry update validated by
`implementation/validate_program.py`. Silent drift between prose and registries is a
program defect.

## What this program deliberately refuses

- Weekly-calendar planning ("week 1 backend, week 2 frontend").
- Stack/vendor ratification before GATE-P3.
- Feature work outside a registered work package.
- Treating automated prototype integrity as product validation.
