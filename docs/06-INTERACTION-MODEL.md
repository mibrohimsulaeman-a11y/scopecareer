# ScopeCareer — Progressive Intelligence Interaction Model

Status: Canonical UX direction
Last updated: 2026-08-21

## 1. Core principle

ScopeCareer must not feel like a conventional enterprise dashboard.

Canonical interaction philosophy:

# Triage Fast
# Research Progressively
# Decide Deliberately
# Execute Explicitly

Complexity follows user commitment.

## 2. Canonical opportunity actions

### PASS

Not worth current attention.

Pass is reversible and preserves reason/history.

### WATCH

Interesting, but timing or information is insufficient.

Watch enables lightweight monitoring.

### EXPLORE

Candidate chooses to spend intelligence/research budget now.

Explore can trigger deeper company, mandate, trust, access, and fit research.

### PURSUE

Candidate chooses to invest real career time/network capital.

Pursue creates/activates the serious Opportunity Workspace.

### PRIORITY

Scarce private candidate **allocation state** for disproportionate attention. It is orthogonal to Candidate Disposition; normally it overlays a `Pursuing` opportunity.

Priority does not contact an employer, does not change Search State, and does not change Selection State. It only increases research/monitoring/follow-up focus according to `PriorityPolicy`.

## 3. Canonical lifecycle

```text
DISCOVERED
    ├── PASS
    ├── WATCH
    └── EXPLORE
          ↓
   Intelligence expands
          ↓
       PURSUE?
      /       \
    No         Yes
                ↓
       Opportunity Workspace
                ↓
       Selection / Outcome
```

Application/selection stage is independent of disposition.

## 4. Three interaction depths

### Level 1 — attention and triage

The candidate should be able to answer in seconds:

- what changed;
- what is due;
- which opportunity needs a decision;
- what the next meaningful action is.

The primary surfaces are:

- **Briefing** — a temporal event/action ledger;
- **Opportunities** — a compact master list with persistent detail inspection.

The UI must not expose assessment object names, decorative metric cards, or pseudo-precise fit scores as the primary decision language.

Canonical disposition actions remain `Pass / Watch / Explore`, but candidate-facing labels may be contextual (`Close`, `Save for later`, `Investigate authority & pay`, `Prepare for call`) as long as they map to the same canonical action.

No Apply action exists at this depth.

### Level 2 — opportunity decision dossier

After the candidate chooses to spend more attention, Opportunity Detail should expose:

- decision thesis;
- supported assertions;
- epistemic state translated into natural language (`Confirmed`, `Estimate`, `Open`);
- source and observation time;
- career move / trajectory;
- high-impact open questions;
- relationship fact versus access-route assessment;
- source trail;
- evidence binding.

The candidate-facing question is not "What is the score?" but:

> What supports this opportunity, what could change the decision, and what should I investigate next?

After deeper review, the candidate may choose `Pursue` through an explicit surface action such as **Open pursuit workspace**.

`Pursue` changes candidate allocation/disposition only. It does not apply, send, submit, publish, share, or contact anyone.

### Level 3 — stage-aware pursuit workspace

After Pursue, the opportunity becomes a live working file.

The workspace uses five stable candidate-facing areas:

- **Brief** — current picture, open questions, next move, recent activity;
- **People** — relationships, recruiters, search consultants, selection stakeholders;
- **Positioning** — mandate-to-evidence bindings, positioning, resume/documents;
- **Process** — recruiter conversation, selection stages, references, offer when relevant;
- **Record** — timeline, sources, interactions, debriefs, commitments.

These are UI projections, not new backend domains. Research, Access, Documents, Selection, Timeline, Offer, and related canonical domains are composed into the five areas according to the current stage.

Workspace composition is stage-aware:

`Pre-contact → Recruiter conversation → Selection → Final / references → Offer`

The same navigation remains stable while the most important content and next move change.

## 5. Briefing — temporal attention ledger

Briefing is not a smaller Opportunities feed.

Its unit is an **attention event**, for example:

- new evidence changed an opportunity;
- a material unknown was resolved;
- recruiter follow-up is due;
- an interview needs preparation;
- a previously passed role materially changed;
- a relationship became relevant to an active route.

Each row should answer:

```text
WHEN / EVENT
SUBJECT
WHAT CHANGED OR IS DUE
WHY IT MATTERS NOW
NEXT ACTION
```

Example:

```text
EVIDENCE CHANGED · 2h
VP Technology · Asteria

Reporting line confirmed: CEO.
Strategy ownership remains open.

Open brief →
```

Briefing should usually contain a small number of high-value items over a bounded time horizon. It should not show job volume, greetings, motivational copy, or dashboard KPIs as its primary content.

## 6. Opportunity list and decision-dossier grammar

Desktop Opportunities uses a master-list + persistent-detail model.

The list row supports rapid comparison across:

- role/company/location;
- decision thesis;
- trajectory;
- best known route;
- recency/material change;
- shortlist membership;
- optional compare selection.

The detail inspector then exposes a structured argument:

```text
ROLE / COMPANY
DECISION THESIS

WHAT IS SUPPORTED
  assertion → value → source → observed_at → status

WHAT COULD CHANGE THE DECISION
  open question → impact → current evidence gap

CAREER MOVE
ROUTE IN
SOURCE TRAIL
NEXT ACTION
```

Qualitative assessment lives in the intelligence engine, but the UI should normally show consequence + evidence rather than a tile such as `Access: Moderate` or `Fit: 86%`.


## 7. Mobile gesture policy

Gestures may be convenience adapters:

- swipe left → Pass
- swipe right → Explore

But visible buttons remain canonical for accessibility, desktop parity, MCP Apps, and accidental-action control.

The state transition is `PASS`, not `SWIPE_LEFT`.

## 8. Rewind / re-review

Pass never deletes the opportunity.

Store:

- disposition;
- reason;
- timestamp;
- evidence state at decision time.

If material facts change, the system may propose re-review:

> You passed because the role appeared delivery-only. New evidence suggests strategy ownership. Re-review?

## 9. Priority Pursuit

Priority is governed by a configurable `PriorityPolicy`. The contract may eventually use a small simultaneous active count, but the number is policy—not enum semantics.

Priority can trigger:

- deeper company monitoring;
- mandate updates;
- access monitoring;
- relationship follow-up;
- selection readiness;
- research refresh.

The goal is quality-over-volume behavior.

## 10. Evidence interaction — signature pattern

Candidate may interact with a specific mandate/evidence fragment rather than only the whole opportunity.

Example:

```text
MANDATE
Build and scale an international platform engineering organisation.

[Relevant to me]
```

Then:

```text
Which evidence supports this?

○ Built APAC engineering organisation across 3 countries
○ Consolidated platform teams after acquisition
○ Grew platform team from 18 → 67

[Use selected evidence]
```

Binding should enrich:

- Pursuit reasoning;
- Positioning Brief;
- Resume Variant;
- Executive Bio;
- Selection preparation.

## 11. Interaction inspiration without dating-app visual language

Useful interaction principles remain:

- curated discovery rather than infinite volume;
- lightweight and reversible dispositions;
- scarce Priority allocation;
- direct interaction with a specific mandate/evidence fragment;
- recommendation learning from outcomes.

Do not use dating-app visual metaphors, swipe-first judgement, or "Tinder for Jobs" positioning as the product identity.

The target feel is:

**an executive opportunity desk: fast attention triage, research-grade evidence, and deliberate action.**

## 12. Recruiter/talent UX rule — future

Do not use superficial dating judgement for candidate evaluation.

Talent-side first-pass views should be evidence-first, potentially minimizing photo/identity-rich cues until relevant.

Example:

```text
EXECUTIVE PROFILE
VP Technology · APAC

MANDATE EVIDENCE
✓ Platform transformation
✓ Regional leadership
✓ Scale-up

UNCLEAR
~ P&L ownership only self-attested

OPEN
? Direct regulated-finance exposure

[Evidence] [Hold] [Progress]
```

## 13. Cross-channel grammar

Web, PWA, browser extension, MCP Apps, and plain MCP responses must preserve the same semantic actions and object IDs even when visual rendering differs.
