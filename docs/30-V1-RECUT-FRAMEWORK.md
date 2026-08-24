# ScopeCareer — V1 Recut Framework

Status: Pre-registered (activates after GATE-P1)
Created: 2026-08-24
Authority: subordinate to docs/21 (master program), docs/22 (engineering invariants), and docs/11 (decision register)

## 1. Purpose

This framework defines the pre-registered, evidence-gated process for cutting V1 scope after Product Validation-1 (PV-1) human sessions complete. It exists to prevent two failure modes:

1. **Premature lock** — ratifying production architecture before validated product scope is stable.
2. **Intuition-driven recut** — dropping or keeping features based on moderator opinion rather than cited participant evidence.

The recut produces exactly one frozen scope artifact (`docs/08`) and one updated decision register (`docs/11`). It does not produce new semantic contracts; any contract delta follows the existing change policy in docs/11 §7.

## 2. Activation conditions

This framework activates only when ALL of the following are true:

| # | Condition | Verification |
|---|-----------|-------------|
| A1 | PV-1 sessions completed: n ≥ 6 | `python3 docs/validation/validate_sessions.py` reports ≥ 6 completed |
| A2 | Synthesis published citing participant IDs per `docs/validation/synthesis_template.md` | File exists and every hypothesis outcome cites ≥ 1 participant record |
| A3 | All 8 hypotheses (PV-H01..PV-H08) have an outcome: supported / mixed / contradicted / insufficient evidence | Synthesis template filled for each |
| A4 | Source feasibility desk research published under `docs/research/source-feasibility/` | Directory non-empty with source matrix |
| A5 | No open critical-failure redesign loop from P01–P03 checkpoint | Checkpoint log shows pass or completed restart cycle |

If any condition fails, WP-P2-01 remains blocked. Do not proceed to architecture selection (WP-P3-01).

## 3. Inputs

| Input | Location | Role |
|-------|----------|------|
| Session records | `docs/validation/sessions/` | Primary evidence; immutable once validated |
| Synthesis | `docs/validation/synthesis.md` (when created) | Cross-session outcomes + recommendations |
| Decision register | `docs/11` | Locked decisions D-001..D-026; assumptions A-001..A-008 |
| Current V1 scope | `docs/08` | Baseline being recut |
| Semantic contracts | `contracts/v1/` | Frozen semantics; recut may narrow usage but not redefine locally |
| Source feasibility | `docs/research/source-feasibility/` | Feasibility/cost/legal constraints on data sources |
| Engineering invariants | `docs/22` | INV-01..INV-17 floor |

## 4. Classification taxonomy

Every feature, surface, capability, or scope item in docs/08 receives exactly one label:

| Label | Definition | Action |
|-------|------------|--------|
| `KEEP V1` | Evidence supports inclusion AND invariant-compatible AND feasible within V1 budget | Retain unchanged in docs/08 |
| `CHANGE V1` | Evidence supports the underlying need but the proposed interaction/model failed | Redesign the interaction; retain the semantic capability |
| `DEFER V1.x` | Insufficient evidence to justify V1 complexity OR validated but not category-defining | Move to explicit deferred list with re-entry condition |
| `REMOVE` | Contradicted by evidence AND not invariant-mandatory | Delete from docs/08; update contracts only if the entity/action becomes orphaned |
| `NEEDS MORE EVIDENCE` | Not tested in sufficient sessions OR mixed without clear signal | Block from V1 until follow-up validation completes |

### 4.1 Hard constraints on REMOVE

No agent or contributor may remove any of the following regardless of PV-1 outcome. These are locked decisions and/or engineering invariants:

| Protected semantic | Authority |
|--------------------|-----------|
| Provenance/evidence status/interpretation independence | D-003, INV-07 |
| Fit vs Pursue separation | D-004 |
| Canonical actions Pass/Watch/Explore/Pursue/Priority | D-009 |
| Progressive complexity (triage → intelligence → workspace) | D-010 |
| Candidate MCP in V1 | D-013 |
| Trust-plane separation (Candidate vs Talent) | D-014 |
| External-effect separation (draft ≠ send/share/publish/apply) | D-016 |
| Generic epistemic primitive chain | D-020 |
| Orthogonal state dimensions | D-021 |
| Versioned assessment snapshots | D-022 |
| Priority as attention allocation (not stage) | D-024 |
| Browser extension untrusted-ingestion boundary | D-025 |
| INV-01..INV-17 | docs/22 |

If PV-1 contradicts one of these, the correct action is `CHANGE V1` on the interaction design, never `REMOVE` on the semantic primitive.

## 5. Decision rules by hypothesis outcome

For each hypothesis, apply the rule that matches its synthesis outcome. Rules are ordered: first match wins.

### PV-H01 — Briefing and Opportunities distinct jobs
Maps to docs/08 §4 (Market/opportunity scope), §6 (Opportunity execution scope)

| Outcome | Rule |
|---------|------|
| Supported | KEEP all briefing/opportunity items as scoped |
| Mixed | CHANGE the briefing→opportunity transition; keep both surfaces but simplify navigation cues |
| Contradicted | CHANGE to a single triage-first surface; merge briefing into opportunity detail; do not remove either information set |
| Insufficient evidence | NEEDS MORE EVIDENCE; defer deep briefing composition; keep minimal briefing stub |

### PV-H02 — Explore vs Pursue commitment distinction
Maps to docs/08 §6 disposition model

| Outcome | Rule |
|---------|------|
| Supported | KEEP Explore/Pursue as distinct commitment levels |
| Mixed | CHANGE visual/interaction weight between states; keep both states |
| Contradicted | CHANGE: collapse Explore into Watch+notes; keep Pursue as sole deep-workspace entry; do not remove the state machine |
| Insufficient evidence | NEEDS MORE EVIDENCE; default to current contract states; simplify UI presentation |

### PV-H03 — Pursuit reasoning beats simple fit score
Maps to docs/08 §4 Fit Intelligence, Transition Intelligence, Pursuit Recommendation

| Outcome | Rule |
|---------|------|
| Supported | KEEP pursuit-reasoning assessments; no numeric fit score in primary UI |
| Mixed | CHANGE: add confidence labels to reasoning; suppress low-confidence outputs |
| Contradicted | CHANGE: lead with fit summary then expand reasoning; do not introduce numeric score against D-004 |
| Insufficient evidence | NEEDS MORE EVIDENCE; show qualitative reasoning without score; validate in V1 beta |

### PV-H04 — Access Plan valuable and credible
Maps to docs/08 §5 Access Lite scope

| Outcome | Rule |
|---------|------|
| Supported | KEEP full Access Lite scope including relationship lite, routes, plans |
| Mixed | CHANGE route-presentation format; keep relationship/contact model and plan generation |
| Contradicted | DEFER advanced access planning to V1.x; keep basic person/search-firm/contact capture and manual route note-taking; do not remove Access as first-class (D-006) |
| Insufficient evidence | NEEDS MORE EVIDENCE; keep manual-only relationship/route capture; defer automated plan generation |

### PV-H05 — Evidence binding worth friction
Maps to docs/08 §3 Foundation scope (evidence/provenance) + §6 resume variant evidence links

| Outcome | Rule |
|---------|------|
| Supported | KEEP evidence binding throughout |
| Mixed | CHANGE: reduce binding friction via smart suggestions while preserving provenance chain |
| Contradicted | CHANGE: make binding optional-at-capture but mandatory-before-share/apply; provenance chain remains intact (INV-07 protected) |
| Insufficient evidence | NEEDS MORE EVIDENCE; keep binding available but non-blocking in draft mode |

### PV-H06 — Explicit comparison improves trade-offs
Maps to docs/08 §4 Opportunity normalization + comparison

| Outcome | Rule |
|---------|------|
| Supported | KEEP side-by-side comparison surface |
| Mixed | CHANGE comparison layout/columns based on confusion signals |
| Contradicted | CHANGE: replace side-by-side with sequential review + decision journal; comparison remains a capability |
| Insufficient evidence | NEEDS MORE EVIDENCE; keep lightweight list-level comparison only |

### PV-H07 — Pursuit Workspace exposes next move fast enough
Maps to docs/08 §6 Opportunity Workspace

| Outcome | Rule |
|---------|------|
| Supported | KEEP current workspace composition |
| Mixed | CHANGE default landing view/tab; reduce initial widget count |
| Contradicted | CHANGE: introduce task-oriented first screen replacing dashboard-style overview; workspace content preserved behind tabs |
| Insufficient evidence | NEEDS MORE EVIDENCE; ship minimal workspace with single next-action prompt |

### PV-H08 — Stage-aware composition coherent across lifecycle
Maps to docs/08 §6 selection-process map, stakeholder preparation, interview prep

| Outcome | Rule |
|---------|------|
| Supported | KEEP stage-aware tabs/sections |
| Mixed | CHANGE which stages get distinct compositions vs shared baseline |
| Contradicted | CHANGE: flatten to single workspace with contextual prompts instead of stage-specific layouts; state machine unchanged |
| Insufficient evidence | NEEDS MORE EVIDENCE; ship recruiter-stage composition only; defer other stages |

## 6. Open question resolution protocol

Each open product question in docs/11 §4 must receive one of:

| Resolution | Record location |
|------------|-----------------|
| Decided → new/updated D-xxx | docs/11 §1 |
| Deferred with owner + trigger | docs/11 §2 (assumption) or §4 (open question annotated) |
| Blocked pending external dependency | docs/11 §4 with blocker named |

Questions that remain unresolved after recut must NOT block GATE-P2 if they are not on the V1 critical path. They become tracked assumptions for V1 beta.

### 6.1 Expected resolutions (pre-registered targets)

These questions are expected to resolve during recut based on PV-1 + source feasibility:

| Question | Likely resolution path |
|----------|-----------------------|
| Initial geography priority | Follow participant geography mix + source coverage matrix |
| PriorityPolicy.max_active | Set conservative default (e.g. 10 active pursuits); tune in beta |
| Market intelligence depth in V1 | Keep only signals directly feeding opportunity quality assessment; defer broader analytics |
| Relationship import method | Choose lowest-friction compliant option from source feasibility matrix |
| Calendar/email integration | Default: defer to V1.x unless PV-1 strongly indicates timeline capture fails without it |
| Voice debrief | Default: defer to V1.x unless PV-1 shows text debrief insufficient for comprehension |

## 7. Output artifacts

On successful recut completion:

1. **`docs/08-MVP-V1-SCOPE-AND-NONGOALS.md`** — rewritten to reflect frozen V1 scope. Every retained item traces to at least one PV-1 session ID. Every removed/deferred item carries its classification and rationale.
2. **`docs/11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md`** — updated with new/changed decisions, resolved/deferred questions.
3. **Contract manifest updates** (if needed) — only through `contracts/v1/` canonical files, never client-side.
4. **Synthesis receipt** archived at `implementation/receipts/wp-p2-01.json`.

## 8. Exit gate (GATE-P2)

WP-P2-01 is done when ALL of:

| # | Criterion | Verification |
|---|-----------|-------------|
| E1 | docs/08 rewritten with frozen scope + traceability annotations | Manual review |
| E2 | docs/11 updated with recut decisions | Manual review |
| E3 | Every open product question in docs/11 §4 resolved, deferred, or blocked-with-owner | Manual review |
| E4 | No contract validator regression | `python3 contracts/v1/validate_contracts.py` → VALID |
| E5 | Program registry consistent | `python3 implementation/validate_program.py` → VALID |
| E6 | Client scan clean | `python3 implementation/validate_program.py --scan-clients` → clean |
| E7 | Receipt archived with verification output | `implementation/receipts/wp-p2-01.json` exists |

Only then does WP-P3-01 (architecture decision & ADR ratification) become eligible.

## 9. Anti-patterns

| Anti-pattern | Why forbidden |
|--------------|---------------|
| Cutting provenance because participants found it confusing | Violates INV-07; correct action is CHANGE interaction |
| Removing Candidate MCP because PWA alone suffices in prototype | Violates D-013 |
| Adding numeric fit score because participants asked for "a number" | Violates D-004; requested features are observations, not automatic scope |
| Dropping browser extension because web import works in prototype | Violates D-025; capture is a distinct ingestion channel |
| Keeping everything "just in case" | Defeats purpose of recut; every KEEP must cite evidence |
| Running architecture scoring before recut completes | Violates DAG ordering (WP-P3 depends on WP-P2 gate) |
