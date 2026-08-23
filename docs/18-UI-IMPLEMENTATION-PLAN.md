# ScopeCareer — UI-Only Implementation Plan

Status: Working plan
Last updated: 2026-08-22

## 1. Purpose

This plan completes **the entire candidate-facing product UI** for V1 as a fully clickable,
fixture-driven application — every registered view model, journey, state, and client surface —
**without any backend, AI runtime, or integration dependency**.

It answers one question: *what must exist on screen so that all V1 semantics from
`contracts/v1/` are representable, coherent, and testable end-to-end?*

This is not a throwaway expansion of `validation/prototype-v3`. It is the
**reference front-end implementation**: the canonical projection of contract semantics into
interface, which a production stack later re-implements without redesigning semantics.

## 2. Explicit non-goals

- No backend services, databases, LLM calls, or real job sources.
- No authentication server (auth screens are simulated states only).
- No recruiter/talent-plane UI (separate product track; see `10-MULTISIDED-FUTURE-BOUNDARY.md`).
- No native mobile applications.
- No change to entities, state machines, actions, or policies — UI consumes contracts as-is.
  If UI work reveals a contract gap, the fix goes through the contract registries first.

## 3. Baseline (what already exists)

| Asset | State |
|---|---|
| `contracts/v1/` | VALID: 74 entities, 14 state machines, 91 actions, 26 capabilities, 23 policies, 13 view models, 10 journeys, 33 conformance cases |
| `validation/prototype-v3/` | Core loop complete: Briefing → Detail → Explore → Pursue → stage-aware Workspace (5 stages); 20/20 smoke checks; cross-surface assertion projection proven |
| Interaction grammar | Pass / Watch / Explore / Pursue + Priority implemented for the core loop |

The prototype proves the category-defining loop. This plan covers everything around it.

## 4. Architecture approach

### 4.1 Workspace

New directory:

```text
web/
├── index.html              # SPA shell, hash routing
├── styles/
│   ├── tokens.css          # design tokens (single source)
│   ├── base.css            # layout primitives, typography
│   └── components.css      # component kit
├── js/
│   ├── router.js           # hash routes, per-client layout switch (web/pwa)
│   ├── store.js            # fixture store: entities, assertions, events, dispositions
│   ├── adapters/           # one adapter per view model (implements VM "reads")
│   ├── copy/               # canonical-state → candidate-language mapping layer
│   ├── actions.js          # ACT-* dispatcher: validates transition via state registry, logs event
│   └── ui/                 # component modules
├── fixtures/
│   ├── people/             # deterministic personas per journey scenario
│   └── scenarios/          # one fixture set per canonical journey/stage
├── tests/
│   └── smoke.mjs           # CDP harness (same pattern as validation/browser_harness_v3.py)
└── README.md
```

### 4.2 Principles binding the implementation

1. **Views project contracts.** Each screen has exactly one owning VM id from
   `view_model_registry.json`; required_sections are rendered, forbidden_sections throw.
2. **Copy mapping layer is mandatory.** Internal enum names (`exploring`, `PRE-CONTACT`) never
   render directly; `copy/` maps them to candidate language. Registry principle enforced in code.
3. **Actions go through one dispatcher.** Buttons carry `data-action="ACT-..."`; the dispatcher
   checks allowed transitions against `state_registry.json`, appends to the event ledger, and
   refuses illegal transitions visibly (disabled + reason, not hidden).
4. **External effect is unrepresentable.** No code path produces share/send/apply/publish.
   Gated future actions may appear only as explicitly disabled affordances labeled as such.
5. **Assertion-first rendering.** All intelligence content renders from assertion objects
   (status, source, observed_at, impact, confidence) via one shared component kit — never inline text.
6. **Fixtures derive from registries.** Scenario fixtures reference entity/action/state IDs that
   exist in contracts; a lint step fails on dangling references.
7. **Zero runtime dependencies.** Vanilla ES modules, no build step, CDP-testable — same
   constraints as the validation harness, kept until after human ICP validation.

## 5. Route & screen inventory

Top-level navigation stays `Briefing / Opportunities / Career` (per `09-SURFACE-ARCHITECTURE.md`);
workspace areas stay `Brief / People / Positioning / Process / Record`.

| Route | View model / journey | Clients | Phase |
|---|---|---|---|
| `/briefing` | VM-HOME-ATTENTION | web, pwa | P1 |
| `/opportunities` (segments: Shortlist/All/Saved/Active/Closed) | VM-DAILY-SHORTLIST, VM-OPPORTUNITY-CARD | web, pwa | P1 |
| `/opportunities/capture` | JRN-BROWSER-CAPTURE (manual + extension-popup mock) | web, pwa | P1 |
| `/opportunities/compare?ids=` | VM-OPPORTUNITY-COMPARE | web | P1 |
| `/opportunities/:id` | VM-OPPORTUNITY-INTELLIGENCE | web, pwa | P1 |
| `…/:id/bind-evidence` (modal flow) | VM-EVIDENCE-BINDING | web, pwa, mcp-card | P1 |
| `/workspace/:id/brief` | VM-OPPORTUNITY-WORKSPACE | web | P3 |
| `/workspace/:id/people` (+ relationship detail) | Access Lite views | web | P3 |
| `/workspace/:id/positioning` | Positioning brief editor | web | P3 |
| `/workspace/:id/positioning/resume/:variantId` | VM-RESUME-VARIANT-REVIEW (diff) | web | P3 |
| `/workspace/:id/process/preparation/:participantId` | VM-SELECTION-PREPARATION | web, pwa | P3 |
| `/workspace/:id/process/debrief` | VM-DEBRIEF-REVIEW | web, pwa | P3 |
| `/workspace/:id/process/offer` | VM-OFFER-DECISION | web | P3 |
| `/workspace/:id/record` | Timeline / interaction ledger | web | P3 |
| `/career` | Career hub | web, pwa | P2 |
| `/career/evidence` | VM-CAREER-EVIDENCE-REVIEW | web | P2 |
| `/career/intent` | Career Intent editor | web, pwa | P2 |
| `/career/artifacts` (narrative, bio, story library) | Positioning artifacts | web | P2 |
| `/strategy` | VM-STRATEGY-INTELLIGENCE | web | P4 |
| `/settings/privacy` | Data Vault admin, sensitivity, stealth preview | web | P4 |
| `/settings/audit` | AI/provenance audit viewer | web | P4 |
| `/settings/data` | Export/delete/retention simulation | web | P4 |
| `*` (onboarding/auth simulated) | JRN-CAREER-EVIDENCE-ONBOARDING entry | web, pwa | P2 |

MCP App card renderer (canonical grammar as sandboxed conversational cards) is a **stretch item
after P6** — it reuses the same card components and is excluded from the completion gate.

## 6. Phases

### P0 — Foundations (est. 3–4 days)

Deliverables:

1. `tokens.css`: epistemic status palette (Confirmed / Estimate / Open / Unknown),
   impact levels, confidence labels, sensitivity tiers — one visual language reused everywhere.
2. Copy mapping module: every canonical disposition, selection stage, search state, evidence
   status, trust level mapped to candidate language (single source; lint against registries).
3. Component kit: AssertionRow, SourceChip, EpistemicBadge, ImpactTag, ConfidenceLabel,
   SourceTrail, UnknownCard, TradeoffTable, DecisionThesisBlock, ActionButton (ACT-bound),
   EventLedgerItem, EmptyState.
4. Store + fixtures skeleton: entities, assertion store, event ledger, disposition/priority/
   selection/search orthogonal state per opportunity (no composite status enum).
5. Router + client layouts (desktop workspace vs mobile companion shell).
6. Smoke harness scaffold (`tests/smoke.mjs`) with contract-lint for fixtures.

Acceptance:
- Validator-style lint passes: all fixture IDs resolve to contracts; all rendered statuses have copy mappings.
- Kit renders an opportunity row + dossier section purely from fixture data.

### P1 — Core loop completion (est. 5–7 days)

Deliverables:

1. **Briefing**: full temporal ledger (Now / Due today / Tomorrow), all event kinds
   (opportunity change, relationship action, commitment due, preparation due, market signal,
   selection event), filters, dismiss/snooze (local only), empty state ("nothing deserves attention").
2. **Opportunities master list**: segments, sortable rows with required sections
   (decision thesis, route summary, candidate state), triage actions Pass/Watch/Explore,
   multi-select → Compare, keyboard triage.
3. **Opportunity Detail dossier**: all required sections including career move, route-in,
   alternative routes, research notes, source trail, open questions ranked by decision impact;
   contextual research CTA pattern generalized.
4. **Evidence binding flow**: mandate fragment → evidence options (with evidence_status +
   usage_permission) → bind; truth-status preservation asserted by smoke check.
5. **Compare**: 2–3 selected opportunities side-by-side over named dimensions
   (Trajectory, Scope/Mandate, Route-in, Biggest unknown, Source, Candidate state);
   no aggregate winner score (forbidden-sections check).
6. **Capture flow**: manual capture dialog (URL / pasted JD / confidential note) and
   extension-popup mock: page snapshot → proposed opportunity draft → review gate before commit.

Acceptance:
- Every P0 journey (JRN-DAILY-SHORTLIST, JRN-EXPLORE-PURSUE, JRN-PURSUIT-RECOMMENDATION,
  JRN-ACCESS-PLAN, JRN-EVIDENCE-BINDING) walkable start-to-finish on fixtures.
- New smoke checks: ~15 (briefing kinds, list segments, compare no-winner, capture gate,
  evidence binding).

### P2 — Career domain (est. 4–5 days)

Deliverables:

1. **Career Evidence Review**: claim inventory with four independent dimensions visible
   (provenance, evidence status, interpretation, usage permission); attest/reject flows with
   "attest ≠ verify" distinction rendered; AI-proposal vs candidate-attestation visual separation;
   CV-import simulation feeding proposed claims for review.
2. **Career Intent editor**: target role families/seniority/geographies/work model/compensation,
   desired mandates, constraints, avoidances.
3. **Artifacts library**: executive narrative, bio versions, leadership story library
   (reusable evidence entries consumable by positioning later).
4. **Onboarding journey**: first-run path resume import → claim review → intent basics,
   ending at Briefing (simulated auth before it).

Acceptance:
- JRN-CAREER-EVIDENCE-ONBOARDING walkable; smoke checks ~8.

### P3 — Workspace depth (est. 7–9 days)

Deliverables:

1. **Workspace shell hardening**: stable five-area IA across all five stage compositions
   (exists in v3 — port and generalize); offer content absent until relevant.
2. **People area**: relationship facts vs route assessments visually separated
   (Relationship / RelationshipEvidence / RelationshipAssessment rendering), interaction history,
   follow-ups, access routes with recommended-route presentation.
3. **Positioning area**: positioning brief editor (prepare → review → approve as working artifact);
   resume variant preparation entry.
4. **Resume Variant Review**: original vs proposed diff, reason-for-change, claim/evidence links,
   usage permission, Accept/Edit/Reject per change; version list retained per opportunity;
   approve ≠ share/apply invariant surfaced.
5. **Process area — Selection Preparation**: per-participant brief (agenda hypotheses labeled
   inference, known concerns, evidence to use, open questions).
6. **Debrief Review**: observed → proposed assertions → commit-as-Inferred/Known or reject;
   commitments and open questions created from debrief; no silent rewrite of known facts.
7. **Offer Decision**: terms breakdown, decision criteria weights, trade-offs, unknowns,
   accept/decline **intent** (explicitly non-external), decision brief generation.
8. **Priority allocation**: activate/deactivate with PriorityPolicy feedback (max active,
   attention weight) as policy-driven UX, not enum.

Acceptance:
- Full lifecycle walkable: pre-contact → recruiter → selection → final/references → offer,
  with debrief loop inside; smoke checks ~20 (diff integrity, debrief commit gates,
  offer intent gating, priority policy feedback).

### P4 — System surfaces (est. 4–5 days)

Deliverables:

1. **Strategy Intelligence**: signals with sample size / time window / confidence /
   preliminary-signal framing; hypothesis creation; experiment create/activate with observation log.
2. **Settings — Privacy**: field-level sensitivity controls, usage permission administration,
   stealth notification preview (lock-screen copy examples), retention controls.
3. **Settings — Audit**: AI-output traceability viewer (which assertion came from which source/
   function version), action/event ledger browser.
4. **Settings — Data**: export/delete simulation consistent with Data Vault principles.
5. **Market contextual mode**: target companies/watchlist/signals reachable from Opportunities
   contextually (no permanent top-level tab in V1).

Acceptance:
- Small-sample analytics never render as prescription (invariant check); smoke checks ~8.

### P5 — Cross-client responsiveness & states (est. 4–5 days)

Deliverables:

1. Mobile/PWA layouts for every VM marked `CLI-PWA`; web-only VMs get a mobile "read-only +
   notify me" degraded mode rather than a broken squeeze.
2. State coverage matrix: empty, loading (AI-pending placeholder with honest uncertainty),
   error/degraded, low-confidence, stale-evidence banners — per view.
3. Installable PWA shell (manifest, icons, offline stub page).
4. Accessibility pass: keyboard paths for triage and workspace nav, focus order, contrast on
   epistemic palette, reduced-motion, ARIA on badges/diffs.

Acceptance:
- Client matrix table in `web/README.md` shows intended experience per (VM × client × state);
  smoke checks ~12 (mobile navigation, focus traps, contrast tokens).

### P6 — Conformance, instrumentation, handoff (est. 3–4 days)

Deliverables:

1. Extend smoke suite to ~60–70 checks total; each view-model invariant maps to ≥1 named check
   (published mapping table).
2. Research instrumentation parity: event log + assertion snapshot exposure equivalent to
   `window.__scopeCareer*` conventions; scenario deep-links (`?scenario=`, `?stage=`) for
   moderated sessions.
3. Update `validation/` kit: new session scenarios may use `web/` once parity is proven;
   keep prototype-v3 frozen as the validated baseline.
4. `web/README.md`: run instructions, screen inventory, invariant-check map, known gaps.
5. Handoff note in `docs/13-DELIVERY-DECOMPOSITION-BACKLOG.md`: which UI contracts are now
   proven vs pending human validation.

Acceptance:
- `python3 contracts/v1/validate_contracts.py` + full smoke suite green in one command
   (`make verify` or equivalent script).

## 7. Global Definition of Done

- [ ] All 13 registered view models implemented at their contracted clients with required sections.
- [ ] Zero forbidden sections renderable anywhere (enforced by checks, not discipline).
- [ ] All 10 journeys walkable end-to-end on deterministic fixtures.
- [ ] Every canonical action reachable in UI is bound to an ACT-* id and validated against its state machine.
- [ ] No external-effect affordance is ever enabled; gated actions render disabled with explanation.
- [ ] Canonical enum names never appear in user-facing copy (lint-enforced).
- [ ] Orthogonal state dimensions (disposition / priority / search / selection) never collapse into one status label.
- [ ] Contract validator + full smoke suite pass from a single command.
- [ ] Invariant→check coverage table published with no unmapped invariants.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Fixture drift from contracts | Fixtures lint against registries in CI-style script; dangling ID = failure |
| Scope monster (Market/Access depth) | Market is contextual mode only; Access Lite bounded by `08-MVP-V1-SCOPE-AND-NONGOALS.md` |
| Copy drift / jargon leakage | Single copy-mapping module + lint; no raw enums in templates |
| Premature framework temptation | Dependency-free until after human ICP validation; adapters isolate VM logic so porting is mechanical |
| Validation kit fragmentation | prototype-v3 stays frozen baseline; `web/` adopts instrumentation conventions before replacing it in sessions |

## 9. Open decisions (do not block P0–P1)

1. Whether `web/` replaces `prototype-v3/` for moderated sessions (decide at P6 with researcher input).
2. Exact Priority policy numbers (max active) — remains policy, UI renders whatever policy states.
3. MCP App card renderer timing (stretch post-P6).

## 10. Sequence summary

```text
P0 Foundations            ████████░░░░░░░░░░░░░░  3–4d
P1 Core loop completion   ░░░░████████████░░░░░░  5–7d
P2 Career domain          ░░░░░░░░░░░████████░░  4–5d
P3 Workspace depth        ░░░░░░░░░░░░░░░████████  7–9d
P4 System surfaces        ░░░░░░░░░░░░░░░░░░████  4–5d
P5 Cross-client & states  ░░░░░░░░░░░░░░░░░░░███  4–5d
P6 Conformance & handoff  ░░░░░░░░░░░░░░░░░░░░██  3–4d
```

Total estimate: ~30–39 focused working days solo. P0→P1 yields a demo-complete core product;
P2–P3 complete the differentiating depth; P4–P6 make it conformance-clean and test-ready.

Human ICP validation (6–8 moderated sessions) remains the next program gate after this plan —
a complete UI makes those sessions dramatically more representative, but does not substitute for them.
