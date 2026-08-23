# ScopeCareer — Delivery Decomposition Backlog

Status: Semantic/UX prototype gate passed; Product Validation-1 human sessions pending
Last updated: 2026-08-22

## Goal

Turn Product Concept v2.1 into one coherent executable domain language shared by Web, PWA, browser extension, MCP, and AI before locking technical infrastructure.

Machine-readable authority lives in `../contracts/v1/`.

## Dependency chain

```text
A Semantic Contracts
        ↓
B Policy / Trust
        ↓
┌─────── C MCP Contracts
├─────── D UX Contracts
└─────── E AI / Evaluation Contracts
            ↓
    PRODUCT VALIDATION-1
            ↓
F Source / Integration Feasibility
            ↓
      V1 SCOPE RECUT
            ↓
G Technical Architecture
            ↓
H Implementation Contracts
            ↓
       Implementation
            ↓
    PRODUCT VALIDATION-N
```

Product validation is not a terminal phase.

---

# Phase A — Semantic Contracts

A1/A2 are treated as a **single semantic freeze**, not independent capability and object exercises.

Canonical chain:

`Capability → owns/reads/projects Object → State Machine → Action → Policy → Evidence/Audit/External Effect`

Epistemic chain:

`Source → Observation → Assertion → Assessment → Recommendation`

## A0. Canonical vocabulary + IDs — INITIAL CONTRACT CREATED

Machine artifacts:

- `contracts/v1/vocabulary.json`
- canonical entity/action/capability/state/policy ID prefixes;
- effect classes;
- epistemic states;
- sensitivity;
- confidence;
- trust planes/principals.

Remaining:

- exact role/mandate ontology;
- geographic/company-stage vocabularies;
- opportunity source types;
- selection stage extension vocabulary.

## A1. Entity contracts — V1 SEMANTIC EXPANSION CREATED

Current registry:

`contracts/v1/entities/entity_registry.json`

Core semantic additions now locked:

- Source;
- Observation;
- generic Assertion;
- EvidenceSnapshot;
- Assessment;
- Recommendation;
- CareerClaim / CareerIntent;
- Company / Person / SearchFirm;
- Opportunity;
- Relationship / RelationshipEvidence / RelationshipAssessment;
- AccessRouteAssessment / AccessPlan;
- Fit / Quality / Transition / Pursuit Assessments;
- PursuitRecommendation;
- PriorityPolicy;
- SelectionProcess;
- SharePacket;
- ExternalEffectRequest / Receipt;
- MarketWatch;
- Offer / Outcome.

Next expansion:

- EmploymentEpisode;
- LeadershipMandate;
- TransformationProgram;
- Achievement;
- DecisionExample;
- StakeholderExposure;
- TargetCompany;
- MarketSignal;
- RoleMandate;
- SuccessProfile;
- PositioningBrief;
- ResumeVariant / ResumeChange;
- ExecutiveBio;
- LeadershipStory;
- SelectionStage/Participant/PreparationBrief;
- DecisionBrief;
- StrategySignal/Hypothesis/Experiment.

## A2. Orthogonal state machines — CORE CREATED

Registry:

`contracts/v1/states/state_registry.json`

Mandatory dimensions:

1. Candidate Disposition: `Discovered / Passed / Watching / Exploring / Pursuing / Closed`.
2. Priority Allocation: `Inactive / Active`.
3. Opportunity/Search State: `Hypothesis / Open / Recruiting / Paused / Filled / Cancelled / Unknown`.
4. Candidate Selection State: `Not Started / Contacted / Applied / Recruiter Screen / Interview / Final / Reference / Offer / Closed`.
5. Assertion Epistemic State: `Unknown / NeedsResearch / Inferred / Known`.
6. SharePacket lifecycle.
7. ExternalEffect lifecycle.

**Prohibited:** one generic `Opportunity.status`.

Next state contracts:

- delegation;
- resume variant review;
- market watch pause/archive;
- offer/decision/outcome lifecycle where stateful.

## A3. Capability/action contracts — INITIAL CORE CREATED

Registries:

- `contracts/v1/capabilities/capability_registry.json`
- `contracts/v1/actions/action_registry.json`

Every capability must specify:

- purpose;
- owned objects;
- read/projected objects;
- canonical actions;
- allowed state transitions;
- invariants;
- AI role;
- forbidden transitions;
- external effects.

Example invariant:

```text
Opportunity Research
reads Opportunity/Company/Source/Observation/Assertion
→ proposes Assertion
→ Assertion policy commits Inferred or Known
→ never writes AI inference directly into canonical identity fields
```

Next: expand the initial core registry to every V1 capability from `02-PRODUCT-DOMAINS-AND-CAPABILITIES.md`.

---

# Phase B — Authorization / Trust Contracts

## B1. Policy vocabulary — INITIAL CORE CREATED

Registry:

`contracts/v1/policies/policy_registry.json`

Canonical policy tuple:

`Principal + Trust Plane + Delegation + Purpose + Capability + Action + Object + Data Scope + Sensitivity + Current State → Decision`

Default deny.

Current policies cover:

- candidate-own data;
- delegated coach boundary;
- cross-plane SharePacket-only disclosure;
- Known assertion evidence gate;
- inference labeling;
- assessment versioning;
- Priority budget;
- external-effect separation;
- browser-extension untrusted content;
- MCP reauthorization;
- minimum-necessary context.

## B2. Trust-plane contracts

Must formalize:

- Candidate Plane;
- Coach delegation;
- future Talent Plane;
- SharePacket bridge;
- tenant/account/data-region boundaries.

## B3. Sensitivity/usage matrix

Formalize field/object sensitivity and CareerClaim usage permissions.

## B4. Threat model

Must cover:

- account takeover;
- MCP token abuse;
- cross-tenant/cross-plane leak;
- prompt/tool injection;
- stale cached tool catalog;
- malicious research sources/documents;
- browser extension arbitrary webpage content;
- accidental external sharing;
- relationship/contact privacy;
- recruiter impersonation/scams;
- data export/deletion;
- voice/transcript sensitivity.

Browser extension canonical boundary:

`UNTRUSTED WEBPAGE → Capture Sandbox → Normalisation → Source Snapshot → Observation/Extraction → Proposed Opportunity/Assertion → Validated Domain Mutation`

Extension is a **data producer, never authority producer**.

---

# Phase C — Candidate MCP Contracts

C may proceed in parallel with D/E after B vocabulary is stable enough.

## C1. Exact tool schemas — MACHINE SCHEMAS CREATED

Machine authority:

- `contracts/v1/mcp/candidate_tools.json` — 19 logical tools/action bindings;
- `contracts/v1/mcp/candidate_schema_registry.json` — exact input/output JSON Schemas.

Important correction:

- `opportunity.set_disposition` mutates Candidate Disposition only;
- `opportunity.set_priority` mutates Priority Allocation only;
- `selection.update_state` mutates Candidate Selection State only;
- no ambiguous `opportunity.update_state` tool.

Remaining before implementation contract:

- exact error taxonomy;
- idempotency requirements by mutation tool;
- long-running task eligibility/result semantics;
- host degradation behavior mapped to exact tool availability.

Completed in current contract layer:

- exact input/output JSON Schemas;
- `career.bind_evidence` signature tool;
- Trust/Fit/Quality/Transition/Access assessment producers;
- strict disposition/priority/selection separation;
- prepare/research versus external-effect separation.

## C2. Resource contracts — CREATED

Authority: `contracts/v1/mcp/candidate_resources.json`.

Exact schemas exist for:

- `career://me`;
- `career://intent`;
- `career://evidence/{id}`;
- `opportunity://{id}`;
- `company://{id}`;
- `relationship://person/{id}`;
- `selection://{opportunity_id}`.

Purpose-minimized projection is mandatory. All Candidate MCP resources use principal-private cache scopes; relationship resources explicitly prohibit shared caching.

## C3. MCP Apps

Define optional rich cards from canonical view models. MCP App UI must not create a separate semantic universe.

## C4. MCP conformance

Expand `contracts/v1/conformance/cases.json` with:

- invalid principal/object;
- revoked delegation;
- cached-list privilege change;
- read-only host degradation;
- task completion/cancel/failure;
- external-effect denial;
- audit receipt;
- resource minimization.

---

# Phase D — UX Contracts

## D1. Canonical view models — V3 PROGRESSIVE-PURSUIT DIRECTION REPRESENTED

Authority: `contracts/v1/views/view_model_registry.json`.

Thirteen current view models derive candidate surfaces from semantic contracts, not raw tables or one-to-one backend-domain navigation.

Current candidate-facing interaction hierarchy:

`Briefing → Opportunities / Decision Dossier → Explore → Pursue → Stage-aware Pursuit Workspace`

Key projections now represented in contract/prototype:

- temporal Candidate Briefing / attention events;
- explicit Shortlist and opportunity master-list;
- Opportunity Decision Dossier with supported assertions, open questions, source trail and route interpretation;
- Opportunity Comparison without aggregate winner score;
- Evidence Binding;
- stage-aware Pursuit Workspace;
- Selection Preparation;
- Debrief Review;
- Offer Decision;
- Career Evidence Review.

## D2. Canonical interaction state — CONTRACT + V3 PROTOTYPE ALIGNED

`Pass / Watch / Explore / Pursue` remain Candidate Disposition semantics.

`Priority` remains separate Priority Allocation.

Search and Selection state remain orthogonal.

Candidate-facing labels are contextual and need not expose canonical enum/action names. For example, `Investigate authority & pay` maps to Explore and `Open pursuit workspace` maps to Pursue.

Pursue has explicit conformance cases proving workspace activation is internal-only and cannot mutate Selection State.

## D3. Pursuit Workspace composition — V3 PROTOTYPED

Stable candidate-facing areas:

`Brief / People / Positioning / Process / Record`

These compose existing canonical domains. Workspace content is stage-aware across:

`Pre-contact → Recruiter conversation → Selection → Final / references → Offer`

The same navigation persists while the next move, evidence, people, process, and readiness context change.

## D4. Browser capture UX

Still requires explicit design/conformance for:

- captured source;
- extracted/proposed values;
- committed known/inferred assertions;
- unresolved fields.

## D5. Screen inventory

Do not expand a screen inventory by mirroring backend domains. Freeze production screen contracts only after Product Validation-1 evidence and V1 scope recut.
---

# Phase E — AI / Evaluation Contracts

## E1. AI function registry — V1 FUNCTION SET EXPANDED

`contracts/v1/ai-functions/ai_function_registry.json`

Current contract principle:

**AI functions may propose; they do not self-authorize canonical commits.**

Current registry contains 18 bounded AI functions covering source/career extraction, market/opportunity research, role mandate, trust, fit, quality, transition, pursuit, access, positioning, resume, selection, debrief, offer decision support, and strategy analysis.

All functions remain `may_commit=false`; canonical mutation requires action/policy execution.

## E2. Evaluation cases — INITIAL FUNCTION-SPECIFIC SET CREATED

Authority: `contracts/v1/ai-functions/eval_cases.json`.

Sixteen initial eval cases cover:

- no fabricated claims;
- observation/source faithfulness;
- known vs inferred classification;
- inference→known evidence gate;
- assessment staleness/versioning;
- pursuit reasoning;
- relationship fact vs access interpretation;
- unknown preservation;
- privacy minimization;
- malicious webpage/prompt injection;
- confidential opportunity handling.

No single generic LLM quality score.

---

# PRODUCT VALIDATION-1 — V3 AUTOMATED GATE PASSED / HUMAN ICP SESSIONS NEXT

The active disposable prototype is `../validation/prototype-v3/` and now covers the full progressive candidate flow requested for validation:

1. Briefing temporal event/action ledger;
2. Opportunity Decision Dossier with provenance/open questions/access;
3. Explore → Pursue commitment boundary;
4. Pursuit Workspace skeleton;
5. Pre-contact working file;
6. Recruiter conversation/debrief context;
7. Selection stakeholder/process context;
8. Final/reference + Offer decision context;
9. cross-surface assertion/evidence revision consistency;
10. Shortlist + side-by-side Compare refinement;
11. dedicated mobile list → detail behavior;
12. automated validation gate and moderated ICP research kit.

Current automated evidence:

- `validation/redesign_v3_status.json` — ordered 1→12 campaign status;
- `validation/prototype_registry.json` — PV-H01 through PV-H08;
- `validation/prototype_smoke_v3_report.json` — **20/20 checks passed, zero runtime errors**;
- `contracts/v1/validate_contracts.py` — contract gate passes with 33 conformance cases;
- `validation/test_protocol.md` — V3 moderated protocol ready;
- participant screener, recruitment copy, execution checklist, session JSON Schema, validator, and synthesis template are ready.

Category/value questions now include:

- Is Briefing understood as temporal work rather than another opportunity feed?
- Can executives trace material opportunity claims to source/provenance without semantic jargon?
- Are contextual Explore actions and `Open pursuit workspace` understood as different commitment levels?
- Is Access guidance credible and actionable?
- Is evidence binding worth its friction?
- Does side-by-side comparison improve trade-off decisions?
- Does the default Pursuit Brief reveal the next move quickly enough?
- Does stable five-area navigation remain coherent as the opportunity moves through recruiter, selection, final/reference and offer stages?
- Does the workspace stay lighter than a conventional enterprise dashboard?

**Automated prototype integrity is not human product validation.** Target first evidence set remains 6–8 moderated ICP sessions; actual ICP session count is **0**.

Human findings may recut V1 surface scope before technical architecture selection.

---

# Phase F — Source / Integration Feasibility — DESK RESEARCH STARTED IN PARALLEL

Because the product-value prototype exists, architecture-independent desk research has started under `../research/source-feasibility/`. This does not wait for the last ICP interview, but no source choice becomes final before Product Validation-1 evidence and V1 recut.

Initial feasibility findings:

- direct public ATS boards (Greenhouse, Lever, Ashby) are credible V1 source candidates where employer boards can be identified and legal/aggregation terms permit;
- manual/confidential capture and browser capture remain mandatory first-class sources;
- Adzuna is technically useful for validation/recall but commercially constrained by API terms/licensing and should not be assumed as a free production aggregator;
- LinkedIn's documented Talent API is partner-oriented for job posting/ATS integration, not an open candidate-side discovery API; do not design around LinkedIn scraping;
- Singapore ACRA open data is promising for Singapore company identity; SEC/Companies House/GLEIF provide useful jurisdiction/entity evidence but not a universal market-signal solution;
- Google/Microsoft contacts are feasible but consent-sensitive; email/calendar are technically feasible and currently remain V1.1 candidates unless user research elevates them.

Continue validating source feasibility/legal/commercial constraints for:

- public jobs/company careers;
- executive-search/recruiter inputs;
- company/market signals;
- leadership changes;
- contact/relationship imports;
- email/calendar;
- browser capture;
- document import;
- future compensation data.

For each source define:

- legitimacy/terms;
- API/feed/capture method;
- freshness;
- provenance strength;
- cost;
- rate limits;
- geography coverage;
- retention rights;
- deletion/export implications;
- failure/degradation behavior.

Avoid brittle/unapproved scraping as a core dependency.

---

# V1 SCOPE RECUT

After Product Validation-1 + source feasibility:

- keep category-defining validated capabilities;
- remove/defer low-value complexity;
- decide voice debrief timing;
- decide initial market-signal coverage;
- set initial PriorityPolicy;
- set initial relationship import scope;
- freeze V1 journey set.

Update `08-MVP-V1-SCOPE-AND-NONGOALS.md` and contract manifests before architecture selection.

---

# Phase G — Technical Architecture

Only now choose:

- frontend/PWA/browser-extension stack;
- backend/service boundaries;
- relational/search/vector storage;
- assertion/indexing model;
- event/recompute architecture for stale assessments;
- queue/task/scheduler;
- source/research provider adapters;
- model routing;
- OAuth/IAM;
- MCP runtime;
- observability;
- deployment/cloud/data region;
- encryption/key management;
- backup/retention.

Architecture must implement contract semantics; infrastructure must not redefine them.

---

# Phase H — Implementation Contracts

Produce exact:

- JSON Schemas;
- APIs/commands/queries;
- events;
- policy rules;
- MCP resources/tools/tasks/apps;
- view models;
- screen registry;
- AI function/evaluation registry;
- threat model;
- conformance/acceptance matrix;
- deployment/rollout/telemetry plan.

Machine-readable implementation contracts become stronger authority than prose.

---

# Implementation

Build vertical slices around category-defining journeys rather than completing every backend domain first.

Suggested first vertical slice:

`Browser/manual capture → Source/Observation → Assertion → Opportunity → Explore → Pursuit Assessment/Recommendation → Access Plan → Pursue`

Then evidence binding/positioning/selection.

---

# PRODUCT VALIDATION-N — CONTINUOUS

Continue testing during implementation using production-like prototypes and real workflow evidence.

Measure:

- opportunity shortlist usefulness;
- Explore→Pursue clarity;
- recommendation correction/override;
- Access Plan usefulness;
- evidence-binding reuse;
- research fact correction;
- assertion epistemic correction;
- time to qualified decision;
- privacy/trust comprehension;
- MCP workflow usefulness.

Do not postpone category validation until the full platform is implemented.


---

## Handoff note — UI reference implementation complete (2026-08-22)

The full candidate-facing UI now exists at `web/` as the reference implementation of the
contract layer: all 13 view models, 10 journeys walkable, 121 automated smoke checks green
(`python3 web/tests/run_smoke.py`). See `web/README.md` and `docs/20-UI-CONFORMANCE-MAP.md`.

Consequences for what follows:

1. Human ICP validation (6–8 moderated sessions) can now run against `web/` scenarios
   (`?selfcheck=0`, deep-linkable routes) once researchers confirm parity with prototype-v3.
2. Production technical architecture selection should treat `web/js/core/*` as the semantic
   seam to re-implement behind real services — not as code to port literally.
3. The dispatcher/state-machine/guard pattern in `js/core/actions.js` is the executable
   specification for server-side authorization semantics.
4. Remaining UI-side stretch item: MCP App card renderer (post-validation).
