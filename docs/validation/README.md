# ScopeCareer — Product Validation-1 Workspace

Status: V3 execution kit ready; recruitment / real ICP sessions not yet executed  
Last updated: 2026-08-24

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

## Kit artifacts

| Artifact | Purpose | Status |
|---|---|---|
| `participant_screener.md` | Screening criteria + questions | Ready |
| `recruitment_outreach.md` | Neutral DM/email copy | Copy-ready |
| `scheduling_templates.md` | Screener-pass → session → follow-up messages | Ready |
| `moderator_run_sheet.md` | Condensed live-session script | Ready |
| `test_protocol.md` | Full moderated test protocol (authoritative) | Ready |
| `session_data_entry.md` | Post-session notes → validated JSON workflow | Ready |
| `session_record.schema.json` | Machine-readable evidence format | Frozen |
| `sessions/_template.json` | Anonymous session template | Ready |
| `validate_sessions.py` | Evidence validator (schema + pipeline) | Active |
| `synthesis_template.md` | Cross-session synthesis (use only after real sessions) | Ready |
| `execution_checklist.md` | Operational gate checklist | Active |
| `participant_pipeline.json` | Funnel tracker (additive ops gate) | Active |

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

```bash
python3 -m http.server 8765 --directory docs/validation/prototype-v3
# open http://127.0.0.1:8765/
```

Researcher controls: `http://127.0.0.1:8765/?research=1`

Direct QA scenarios:
```
?view=pursuit&stage=precontact
?view=pursuit&stage=recruiter
?view=pursuit&stage=selection
?view=pursuit&stage=final
?view=pursuit&stage=offer
```

Interaction log: `window.__scopeCareerValidationLog`  
Assertion snapshot: `window.__scopeCareerAssertions`

## Run automated gate

```bash
python3 contracts/v1/validate_contracts.py
python3 docs/validation/browser_harness_v3.py
python3 docs/validation/validate_sessions.py
```

V3 smoke verifies 20 behavior/semantic checks including temporal briefing, provenance projection, explore-vs-pursue distinction, stable workspace IA across stages, and zero runtime errors.

## Session execution workflow

1. Recruit using screener + outreach copy; track in `participant_pipeline.json`.
2. Schedule using templates from `scheduling_templates.md`.
3. Conduct session using `moderator_run_sheet.md`.
4. Record evidence per `session_data_entry.md`; validate immediately after each session.
5. Synthesize only after 6–8 sessions using `synthesis_template.md`.

## Validation truth

A green smoke gate proves prototype interaction/semantic integrity, not product validation.

`ready_for_moderated_test` does NOT mean:
- executives value Access Intelligence;
- opportunity dossiers beat existing research workflows;
- commitment-level distinctions communicate correctly;
- stage-aware composition is useful;
- source data is production-feasible;
- technical architecture is selected.

Those claims require real ICP evidence.

## Current execution state

- target first round: **6–8 moderated ICP sessions**;
- actual session records: **0**;
- checkpoint after P01–P03: redesign gate;
- use `participant_screener.md` + `recruitment_outreach.md` for sourcing;
- store one anonymous record per completed session as `sessions/PV1-Pxx.json`;
- run `python3 docs/validation/validate_sessions.py` before synthesis;
- never report hypothesis support from screenshots, smoke tests, moderator intuition, or synthetic participants.
