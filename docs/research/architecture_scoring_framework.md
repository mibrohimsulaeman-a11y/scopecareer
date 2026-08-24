# ScopeCareer — Architecture Scoring Framework (GATE-P3 Preparation)

Status: Operational framework; not yet executed
Last updated: 2026-08-24
Authority: docs/23-PRODUCTION-ARCHITECTURE-DECISION-FRAMEWORK.md + ADR-0001/ADR-0002

## Purpose

Define the concrete process, criteria weights, and evidence requirements for executing the production architecture decision at GATE-P3. This document is preparation work only — nothing here is binding until GATE-P3 opens.

---

## 1. When this gate opens

GATE-P3 becomes eligible when BOTH are green:

- [ ] GATE-P1 closed: 6–8 moderated ICP sessions completed + synthesis published with pre-registered decision rules applied.
- [ ] GATE-P2 closed: V1 scope recut ratified in decision register.

## 2. Scoring dimensions & default weights

Weights must be ratified at the start of the P3 session before any candidate is scored. The default below reflects current understanding from doc 23 but may be adjusted once PV-1/PV-2 evidence is available.

| # | Dimension | Default weight | Evidence required to score |
|---|-----------|---------------|---------------------------|
| D1 | Contract conformance fit | 25% | Working prototype demonstrating Capability→Object→State→Action→Policy→Evidence chain on the candidate platform |
| D2 | Security posture | 20% | Identity/authZ integration sketch, audit trail design, secret management approach mapped to NIST SSDF practices |
| D3 | Workload profile | 15% | Read/write pattern analysis for expected V1 scale (~100s users); event-ledger throughput estimate; AI orchestration latency/cost model |
| D4 | Cost | 15% | Monthly infrastructure + AI cost projection at V1 scale; per-intelligence-operation unit cost |
| D5 | Operability | 15% | Deployment pipeline complexity assessment; debugging/migration story; team-size feasibility |
| D6 | Ecosystem/hiring maturity | 10% | Available talent pool; community health; exit/portability cost |

Total: 100%

### Weight adjustment rules

- If PV-1 evidence shows participants strongly prefer mobile-first access → increase D3 weight by 5%, decrease D4 by 5%.
- If compliance assessment identifies hard data-residency constraints → increase D2 weight by 5%, decrease D6 by 5%.
- Any adjustment requires a registered note explaining why.

## 3. Candidate evaluation protocol

For each category on the doc 23 longlist:

1. **Narrow** — eliminate candidates with hard disqualifiers (see §5).
2. **Score remaining** on all six dimensions using the rubric below.
3. **Document rationale** per score — no bare numbers without justification.
4. **Compose stack** — select one candidate per category; verify cross-category compatibility.
5. **Write ADR** — ratify the composed stack as ADR-0003+ entries.

### Scoring rubric

| Score | Meaning |
|-------|---------|
| 1 | Fundamentally incompatible or requires unacceptable workaround |
| 2 | Significant friction; would require custom tooling or compromise an invariant |
| 3 | Adequate; standard patterns available but not optimal |
| 4 | Good fit; well-supported by ecosystem/tooling |
| 5 | Excellent fit; purpose-built for this use case |

### Hard disqualifiers (any = score 1 regardless of other dimensions)

- Cannot express orthogonal state machines (disposition ⊥ search ⊥ selection ⊥ priority)
- Cannot produce tamper-evident audit trails
- Cannot meet privacy data-residency constraints identified in legal assessment
- Forces business truth into UI layer or LLM prompts
- No migration path / rollback capability
- Cannot support event-ledger writes at required throughput

## 4. Required inputs before scoring begins

| Input | Source | Status |
|-------|--------|--------|
| V1 scope (post-recut) | P2 output | Pending |
| Legal/compliance constraints | `legal_compliance_assessment_v1.md` | Drafted |
| Performance budget targets | docs/27 + P3 session | To define |
| Team size & skill profile | Decision register | TBD |
| AI cost model | Research desk | TBD |
| Data-residency requirements | Legal assessment | Drafted |

## 5. Output artifacts expected from GATE-P3

- Ratified ADR-0003: selected service language/runtime
- Ratified ADR-0004: selected relational store + tenancy mechanism
- Ratified ADR-0005: selected search engine
- Ratified ADR-0006: selected queue/streaming platform
- Ratified ADR-0007: selected cache layer
- Ratified ADR-0008: selected runtime/orchestration
- Ratified ADR-0009: selected AI gateway/routing approach
- Ratified ADR-0010: selected AuthN/IAM solution
- Ratified ADR-0011: selected observability stack
- Updated `implementation/performance-budgets.json` with initial numeric baselines
- Updated ADR-0002 status (ratified/adjusted/rejected) based on workload evidence

Each ADR must include: context, decision, alternatives considered with scores, consequences, and references to the evidence used.

## 6. Anti-bias guardrails

1. **No anchoring**: the candidate longlist in doc 23 is illustrative. New candidates may be proposed at P3 if they satisfy hard disqualifier checks.
2. **Evidence-first**: every score ≥ 4 must cite a working prototype, benchmark, or documented case study.
3. **Blind first pass optional**: if multiple evaluators participate, consider independent scoring before group calibration.
4. **Weight lock**: weights are locked before any candidate is scored. Changing them mid-session invalidates prior scores.

## 7. Risk register

| Risk | Mitigation |
|------|-----------|
| PV-1 evidence contradicts key assumptions → weights wrong | Allow weight adjustment with documented rationale |
| Compliance constraints narrow options severely | Run legal assessment early (already drafted) |
| Team lacks expertise in winning candidate | Include operability/hiring dimension; consider training plan in ADR |
| Cost estimates wildly wrong | Require range estimates (min/max) not point estimates |
| Analysis paralysis — too many candidates | Cap shortlist at 3 per category after narrowing |
