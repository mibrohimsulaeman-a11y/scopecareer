# ScopeCareer — Executive Career Intelligence Platform

Status: Prototype gate passed — Product Validation-1 human sessions pending
Last updated: 2026-08-24

## Purpose

This directory is the working source of truth for **ScopeCareer**, an Executive Career Intelligence Platform for senior leaders and executives.

The product is intentionally broader than an AI job-search assistant. Its core category is a **Personal Executive Career Intelligence System** built around trusted career evidence, market intelligence, opportunity intelligence, pursuit decisions, access strategy, selection-process intelligence, and longitudinal career learning.

## Canonical product principles

1. **Career evidence, not a CV, is the primary personal data model.**
2. **Fit is not the same as pursuit.** A candidate can fit a role that is strategically poor.
3. **Opportunity quality is first-class.** A relevant role can still be low-quality, low-authority, stale, untrusted, or career-negative.
4. **Access intelligence is first-class.** Direct apply is only one route; recruiter, search-firm, referral, warm network, and network-first routes matter for executive search.
5. **Executive opportunity does not require a public JD.** Confidential and recruiter-led mandates must be representable.
6. **Candidate-approved is not equivalent to externally verified.** Provenance, evidence strength, interpretation, and usage permission are independent dimensions.
7. **AI does not own authority.** It retrieves, structures, infers, recommends, drafts, and orchestrates bounded tools under server-side policy.
8. **Human intent scales complexity.** Triage is lightweight; deep research appears after Explore; serious workspace appears after Pursue.
9. **MCP is a product surface, not a persona-per-server architecture.** Persona/actor resolves to capability, data, object, and action policy.
10. **Candidate and Talent are separate trust planes.** Private candidate data does not become recruiter-searchable by virtue of sharing a backend.
11. **Draft is not external effect.** Generate/prepare/draft must remain separate from approve/share/send/publish/apply.
12. **The product optimizes qualified career progression, not application volume.**

## Working document map

| File | Purpose | Status |
|---|---|---|
| `01-PRODUCT-CONCEPT-V2.1.md` | Category, product thesis, ICP, core lifecycle, differentiation | Canonical product direction |
| `02-PRODUCT-DOMAINS-AND-CAPABILITIES.md` | Domain boundaries and capability inventory | Working decomposition |
| `03-DOMAIN-OBJECT-MODEL.md` | Career, opportunity, relationship, selection, evidence objects | Working semantic model |
| `04-MCP-AGENT-ACCESS-ARCHITECTURE.md` | MCP gateway, trust planes, policy resolution, resources/tools/tasks/apps | Canonical architecture direction |
| `05-CANDIDATE-MCP-CONTRACT-V1.md` | Candidate MCP V1 tools, resources, policy classes, workflows | Working V1 contract |
| `06-INTERACTION-MODEL.md` | Progressive intelligence UX and canonical actions | Canonical UX direction |
| `07-TRUST-PRIVACY-GOVERNANCE.md` | Career Data Vault, AI provenance, consent, sharing, external-effect gates | Canonical trust direction |
| `08-MVP-V1-SCOPE-AND-NONGOALS.md` | Exact V1 outcome, scope cut, deferred work | Working release scope |
| `09-SURFACE-ARCHITECTURE.md` | Desktop Web, PWA, browser capture, MCP, future native | Canonical channel direction |
| `10-MULTISIDED-FUTURE-BOUNDARY.md` | Candidate, coach, recruiter/search/talent separation | Future product boundary |
| `11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md` | Decisions, assumptions, risks, unresolved questions | Living register |
| `12-RESEARCH-SOURCE-REGISTER.md` | External and internal source record | Living register |
| `13-DELIVERY-DECOMPOSITION-BACKLOG.md` | Path from concept to implementation-ready specification | Planning |
| `14-METRICS-AND-VALIDATION.md` | North star, product metrics, experiment and MVP validation model | Working measurement model |
| `15-CANONICAL-USER-JOURNEYS.md` | Candidate journeys that must remain coherent across Web/PWA/MCP | Working journey authority |
| `16-FUTURE-AGENT-CAPABILITY-PACKS.md` | Coach/Recruiter/Search/Sourcer/Hiring Manager logical MCP packs | Future product notes |
| `17-COMPETITIVE-CATEGORY-NOTES.md` | Competitive envelope and differentiation hypotheses | Research-backed working notes |
| `18-UI-IMPLEMENTATION-PLAN.md` | Complete candidate-facing UI build-out on contracts (UI-only, fixture-driven) | Working plan |
| `19-UI-EXECUTION-ORCHESTRATION.md` | Parallel work-package decomposition, ownership boundaries, frozen interfaces | Executed |
| `20-UI-CONFORMANCE-MAP.md` | Invariant → automated check mapping for the full UI suite | Complete (121 checks) |
| `21-IMPLEMENTATION-MASTER-PROGRAM.md` | Execution authority P0–P17: phases, gates, DAG to production GA | Execution authority |
| `22-ENGINEERING-INVARIANTS-AND-QUALITY-GATES.md` | Non-negotiable invariants INV-01..17, uniform DoD, flag governance | Binding constitution |
| `23-PRODUCTION-ARCHITECTURE-DECISION-FRAMEWORK.md` | Decision drivers, candidate microservice decomposition, tech longlist, ADRs | Candidate (ratify at GATE-P3) |
| `24-SECURITY-PRIVACY-THREAT-MODEL.md` | Data classification, AI/MCP pipeline, threat catalog, SSDF alignment | Living security lane |
| `25-UX-DESIGN-SYSTEM-AND-STATE-BOUNDARIES.md` | UI state boundaries, ViewModel contract, production design system inventory | Working standard |
| `26-TEST-CONFORMANCE-AND-EVALUATION-STRATEGY.md` | Verification taxonomy, property/state-machine requirement, AI Definition of Correctness | Working strategy |
| `27-PERFORMANCE-RELIABILITY-AND-SLO.md` | Budget categories, ratchet policy, SLO skeleton (baselines at GATE-P3) | Working standard |
| `28-DELIVERY-DAG-AND-WORK-PACKAGES.md` | Multi-agent execution protocol, briefs, receipts, integration checklist | Binding from P4 |
| `29-RELEASE-OPERATIONS-AND-GA-GATES.md` | Environment ladder, mandatory release artifacts, beta/GA gates | Binding from P5 |
| `30-V1-RECUT-FRAMEWORK.md` | Pre-registered scope recut process: activation gates, classification taxonomy, hypothesis-driven rules, GATE-P2 exit criteria | Pre-registered (activates after PV-1) |
| `31-LEGAL-COMPLIANCE-FRAMEWORK.md` | Legal/compliance control requirements across GDPR, DPDP, PDPA, AI Act; counsel-review backlog | Desk research + draft (not ratified) |

## Authority hierarchy

The machine-readable contract layer now exists at `../contracts/v1/`, and the
machine-readable implementation program layer at `../implementation/`
(work packages, dependency DAG, quality gates, ADRs, budgets, controls, release gates —
validated by `python3 implementation/validate_program.py`).

When artifacts conflict, use this order:

1. Explicit decisions recorded in `11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md`.
2. Machine-readable semantic contracts in `../contracts/v1/entities`, `states`, `actions`, and `capabilities`.
3. Machine-readable policy contracts in `../contracts/v1/policies` and client/trust-boundary contracts.
4. The implementation program registries in `../implementation/` (DAG, gates, ADRs) as derived authority.
5. MCP / UX / AI contracts derived from canonical semantics.
6. Canonical product explanation in this README and `01`, `04`, `06`, `07`, `08`.
7. Working decomposition, backlog, research, and competitive notes.
Product-validation artifacts live in `../docs/validation/`. They may test or challenge product/view hypotheses, but do not override semantic/trust invariants without an explicit decision-register change.

Prose explains the contracts but must not silently redefine exact state, action, permission, evidence, or effect semantics.

## Current specification chain

`Product Concept v2.1`
→ **Semantic Contracts** (`Capability → Object → State → Action → Policy → Evidence/Effect`)
→ **Authorization / Trust Contracts**
→ `Candidate MCP + UX + AI/Evaluation Contracts`
→ **Early Product Validation**
→ `Source / Integration Feasibility`
→ **V1 Scope Recut**
→ `Technical Architecture`
→ `Implementation Contracts`
→ `Implementation`
→ **Continuous Product Validation**

Do not lock framework/vendor choices before semantic/policy contracts and the first category-defining product validation are stable.
