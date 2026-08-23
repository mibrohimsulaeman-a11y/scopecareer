# ScopeCareer — Product Validation-1 Workspace

Status: V3 execution kit ready; recruitment / real ICP sessions not yet executed  
Last updated: 2026-08-22

## Purpose

This directory tests category-defining product hypotheses **before** ScopeCareer selects production technical architecture.

- `contracts/v1/` defines canonical semantics;
- the prototype tests whether humans understand and value those semantics;
- prototype implementation choices remain disposable and do not become production architecture decisions.

## Prototype lineage

- `prototype-v1/` — preserved baseline.
- `prototype-v2/` — executive opportunity-desk redesign baseline.
- `prototype-v3/` — **active validation prototype** for the complete progressive flow:
  `Briefing → Opportunity Detail → Explore → Pursue → stage-aware Pursuit Workspace`.

V3 includes five simulated pursuit contexts for research/QA:

`Pre-contact → Recruiter conversation → Selection → Final / references → Offer`

The candidate-facing navigation inside the workspace remains stable:

`Brief / People / Positioning / Process / Record`

These are projections over canonical domains, not new domain objects.

## Artifacts

- `prototype_registry.json` — active hypotheses and non-goals.
- `test_protocol.md` — moderated ICP test protocol.
- `browser_harness_v3.py` — isolated Chrome/CDP V3 runner.
- `prototype_smoke_v3_cdp.mjs` — V3 deterministic behavior/semantic smoke.
- `prototype_smoke_v3_report.json` — latest V3 smoke evidence.
- `participant_screener.md` — participant criteria.
- `recruitment_outreach.md` — neutral recruitment copy.
- `execution_checklist.md` — operational gate.
- `session_record.schema.json` — machine-readable participant evidence format.
- `sessions/_template.json` — anonymous session template.
- `validate_sessions.py` — session evidence validator.
- `synthesis_template.md` — cross-session synthesis; conclusions must cite participant evidence.

## Current P0 loops

1. Briefing as a temporal event/action ledger rather than another opportunity catalog.
2. Shortlist as a visible collection inside Opportunities.
3. Master-list + persistent decision dossier with source/provenance and open questions.
4. Contextual investigation → explicit `Open pursuit workspace` commitment distinction.
5. Relationship fact → access-route assessment without automatic outreach.
6. Career-evidence binding without truth-status mutation.
7. Side-by-side opportunity comparison without aggregate winner score.
8. Pursuit Workspace as a next-move-driven working file.
9. Stable workspace IA with stage-aware recruiter / selection / final / offer composition.
10. Cross-surface projection: the same assertion revision is reflected in Detail and Workspace.
11. Mobile list → detail navigation rather than shrinking desktop split-view literally.

## Run manually

From `Documents/KnowledgeHub/ScopeCareer`:

```bash
python3 -m http.server 8765 --directory docs/validation/prototype-v3
```

Open:

```text
http://127.0.0.1:8765/
```

Researcher controls and event log:

```text
http://127.0.0.1:8765/?research=1
```

Direct QA scenarios:

```text
?view=pursuit&stage=precontact
?view=pursuit&stage=recruiter
?view=pursuit&stage=selection
?view=pursuit&stage=final
?view=pursuit&stage=offer
```

The browser-only interaction log remains available as:

```js
window.__scopeCareerValidationLog
```

The current assertion snapshot is exposed for validation as:

```js
window.__scopeCareerAssertions
```

These are research instrumentation only, not production telemetry/API contracts.

## Run automated gate

```bash
python3 docs/validation/browser_harness_v3.py
python3 contracts/v1/validate_contracts.py
python3 docs/validation/validate_sessions.py
```

V3 smoke currently verifies **20** behavior/semantic checks, including:

- temporal Briefing event ledger;
- canonical assertion projection from Briefing;
- opportunity decision-dossier structure;
- visible provenance and epistemic state;
- contextual research CTA;
- Explore as bounded internal research;
- evidence binding preserving truth status;
- Pursue activating a private workspace without external effect;
- stable five-area workspace IA;
- pre-contact next-move clarity;
- recruiter conversation context and debrief;
- selection stakeholder context;
- final/reference context;
- offer decision context;
- stage-specific evidence revisions projecting back into Opportunity Detail;
- same reporting-line fact projecting across Briefing, Detail and Workspace;
- comparison as named trade-offs without winner score;
- Shortlist independence from disposition;
- mobile list → detail behavior;
- zero browser runtime errors.

## Validation truth

A green smoke gate proves **prototype interaction/semantic integrity**, not product validation.

`ready_for_moderated_test` means the flows are representable and stable enough to test with humans. It does **not** mean:

- executives value Access Intelligence;
- the opportunity dossier beats their existing research workflow;
- `Open pursuit workspace` communicates the right commitment level;
- stage-aware workspace composition is useful;
- source data is production-feasible;
- model outputs are production-quality;
- technical architecture is selected;
- V1 scope is final.

Those claims require real ICP evidence.

## Current execution state

- target first round: **6–8 moderated ICP sessions**;
- actual session records: **0**;
- use `participant_screener.md` and `recruitment_outreach.md` for recruitment;
- store one anonymous record per completed session as `sessions/PV1-Pxx.json`;
- run `python3 docs/validation/validate_sessions.py` before synthesis;
- do not report hypothesis support from screenshots, smoke tests, moderator intuition, or synthetic participants.
