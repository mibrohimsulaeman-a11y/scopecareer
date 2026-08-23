# ScopeCareer — UI Execution Orchestration

Status: Executed — WP-0..WP-6 complete, 121/121 smoke checks green
Last updated: 2026-08-22

## 1. Execution model

P0 is built centrally (one author) because every later work package depends on its APIs.
After P0 lands, P1–P4 execute **in parallel** through isolated work packages (WP) with strict
file ownership. P5–P6 integrate and harden centrally.

```text
P0 FOUNDATION (central)
        │  stable APIs: core/*, ui/*, router, contracts fetch, fixtures schema
        ├── WP-1 Core Loop (P1)      ─┐
        ├── WP-2 Career Domain (P2)   ├─ parallel subagents
        ├── WP-3 Workspace Depth (P3) │
        └── WP-4 System Surfaces (P4)─┘
        ▼
INTEGRATION PASS (central): route manifest merge check, smoke run, conflict repair
        ▼
WP-5 Responsive/States/A11y (P5) → WP-6 Conformance & Handoff (P6)
```

## 2. Hard boundaries for parallel work packages

A WP may create/edit ONLY:

```text
js/views/wp<N>/**          # route registrations + view modules (barrel: index.js exporting routes[])
fixtures/wp<N>/**          # scenario fixtures (registered via own barrel)
tests/checks/wp<N>.mjs     # smoke checks (export async function run(ctx))
```

A WP must NOT edit: `js/core/**`, `js/ui/**`, `js/router.js`, `index.html`,
`styles/**`, other WP directories, `contracts/**`.

If a shared component is missing, the WP builds a local component inside its own directory
and records the need in `js/views/wp<N>/NEEDS.md`; integration promotes it to the kit.

## 3. Stable P0 interfaces (frozen contract between WPs)

| API | Signature |
|---|---|
| `Contracts.ready()` | Promise; resolves after registries fetched |
| `Contracts.machine(id)` | state machine def |
| `Contracts.transition(machineId, currentState, actionId)` | `{ok, to}` |
| `Store.get(path)` / `Store.set(path, value)` | state container, auto-notifies subscribers |
| `Store.subscribe(fn)` | re-render hook |
| `Store.log(type, detail)` | appends to `window.__scopeCareerValidationLog` |
| `Actions.run(actionId, payload)` | validates against state machines + guards, executes registered effect, logs `canonical_action` |
| `Actions.register(actionId, fn)` | WP-local effect registration |
| `Copy.t(machineIdOrGroup, state)` | candidate-facing label; never raw enum |
| `UI.assertionRow(a)` et al. | component kit (see `js/ui/components.js`) |
| Router | `routes[]` from each WP barrel: `{id, path, title, clients:['web','pwa'], mount(el, params)}` |

Fixture rule: every `action_id`, `machine_id`, `state` value referenced in fixtures must exist in
`contracts/v1/*.json`; the lint check (`tests/checks/wp0`) fails otherwise.

## 4. Work packages

| WP | Scope (from plan §6) | Key deliverables | Done when |
|---|---|---|---|
| WP-0 | P0 Foundations | tokens/copy/core/UI kit/router/fixtures/lint/smoke scaffold | foundation self-check green |
| WP-1 | P1 Core loop | Briefing full, Opportunities segments, Detail dossier, Compare, Capture flow, evidence binding | JRN-DAILY-SHORTLIST, JRN-EXPLORE-PURSUE, JRN-PURSUIT-RECOMMENDATION, JRN-ACCESS-PLAN, JRN-EVIDENCE-BINDING walkable; ≥15 new checks |
| WP-2 | P2 Career domain | Evidence review (attest≠verify), Intent editor, Artifacts library, Onboarding journey | JRN-CAREER-EVIDENCE-ONBOARDING walkable; ≥8 checks |
| WP-3 | P3 Workspace depth | People/Positioning/Resume diff/Selection prep/Debrief/Offer decision/Priority policy | full stage lifecycle walkable incl. debrief loop; ≥20 checks |
| WP-4 | P4 System surfaces | Strategy intelligence, Settings privacy/audit/data, Market contextual mode | prescription-guardrail check green; ≥8 checks |
| WP-5 | P5 Cross-client | PWA layouts, state matrix (empty/loading/degraded/stale), a11y pass, install shell | client matrix published; ≥12 checks |
| WP-6 | P6 Conformance | invariant→check map, research instrumentation parity, README/handoff | single-command verify green |

## 5. Delegation protocol (subagent briefs)

Each subagent receives:

1. This document + `docs/18-UI-IMPLEMENTATION-PLAN.md` section for its phase.
2. Its VM ids from `contracts/v1/views/view_model_registry.json` (required_sections are binding;
   forbidden_sections must throw in its checks).
3. Its journey ids from `contracts/v1/journeys/journey_registry.json` (walkable = success).
4. File-boundary rules (§2). Interface table (§3). Copy rule: use `Copy.t`, never raw enums.
5. Output requirement: working code + passing `tests/checks/wpN.mjs` + short completion note
   listing created files and any NEEDS.md entries.

Integration owner merges nothing manually if boundaries respected; runs global verify,
repairs cross-WP issues centrally, then promotes needed shared components.

## 6. Verification commands

```bash
cd Documents/KnowledgeHub/ScopeCareer
python3 -m http.server 8801 --directory web            # app
python3 -m http.server 8800                             # root (contracts fetch via /contracts/v1)
python3 contracts/v1/validate_contracts.py             # always green
python3 web/tests/run_all.py                            # UI smoke suite (all WP checks)
```

Note: the app is served from repo root (`http://127.0.0.1:8800/web/`) so that
`/contracts/v1/*.json` is same-origin fetchable — single server suffices.
