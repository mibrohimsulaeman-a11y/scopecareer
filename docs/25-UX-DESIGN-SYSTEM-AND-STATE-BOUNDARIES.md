# ScopeCareer — UX Design System and State Boundaries

Status: Working standard for production UI
Last updated: 2026-08-23

## Role of the reference UI

`web/` is the **behavioral + semantic reference**, not a raw port target. Production flow:

```text
contracts + reference UI + ICP evidence
        ↓
production design system
        ↓
production ViewModels (server-composed)
        ↓
production screens
```

## Canonical UI state boundary

The UI literally cannot be stateless — the rule is precise: **no canonical/business state
in the UI**.

### Allowed in the UI (ephemeral presentation state)

- menu open/closed; focus position; selected tab; modal visibility;
- scroll position; unsaved text before submit; optimistic pending indicators.

### Forbidden in the UI (canonical truth)

- opportunity disposition truth; selection stage truth; priority allocation truth;
- claim epistemic state ("is this Known?"); authorization results;
- policy eligibility; external-effect approval status.

A component must never decide that `Pursue` is allowed, that a claim is verified, or that
an offer can be accepted. That decision belongs to server/application layers and arrives
in the view model.

## ViewModel contract pattern

Production view models follow this shape (extending the registry's view models):

```text
OpportunityViewModel
├── data                 // projected fields, already policy-filtered
├── epistemicLabels      // canonical confidence labels, never numeric scores
├── warnings             // staleness, degraded mode, conflicts
├── availableActions[]   // actions legal for THIS principal + object state
├── disabledActions[]    // visible but not permitted, with reason codes
├── permissions          // coarse capability flags for rendering only
└── freshness            // data age / source observed_at projections
```

The UI renders. It does not guess, recompute legality, or branch on business enums to
invent transitions.

## Behavioral strengths preserved from validation prototypes

These are category behaviors proven/expressed in PV-1 prototypes and carried into
production unchanged unless ICP evidence recuts them:

- progressive disclosure: triage lightweight → deep research after Explore → workspace
  after Pursue (D-010);
- Briefing as temporal event/action ledger, never another opportunity catalog;
- fit ≠ pursuit; no default 0–100 pseudo-objective fit score as primary surface (D-004);
- source provenance always visible on material claims;
- unknowns visible and impact-ranked, not hidden;
- stable Pursuit Workspace IA (`Brief / People / Positioning / Process / Record`) with
  stage-aware composition;
- side-by-side comparison as named trade-offs, no aggregate winner score;
- explicit commitment boundary between contextual research and `Open pursuit workspace`;
- external-effect clarity: draft/prepare visually distinct from send/share/apply;
- privacy/stealth UX patterns;
- mobile behaves as list → detail navigation, not shrunken desktop split-view.

## Production design system inventory

Tokens and primitives to exist before screens:

```text
tokens (color incl. semantic states, typography scale, spacing, radius,
       elevation, motion, focus ring, density modes)
components:
  layout primitives · lists/cards/detail frames
  epistemic components (provenance chip, confidence label, evidence strength,
                        stale-evidence banner) with ARIA semantics
  action affordances bound to availableActions[] (incl. disabled-with-reason)
  confirmation patterns (esp. commitment-level actions)
  destructive-action patterns
  error/degraded states + recovery
  loading & AI-pending states (never implying certainty)
  empty states for every list
  form/input patterns with validation from schemas
rule: no local one-off styling when a primitive exists
```

## Accessibility

WCAG 2.2 AA target (INV-13). The reference UI's assertion/provenance ARIA labeling is the
floor, not the ceiling. Keyboard-complete flows and focus management on every new screen.
