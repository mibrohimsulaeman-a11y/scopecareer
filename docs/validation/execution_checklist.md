# ScopeCareer Product Validation-1 — Execution Checklist

Status: Operational checklist  
Last updated: 2026-08-21

## Before recruitment

- [ ] Use `participant_screener.md`.
- [ ] Recruit 6–8 participants with the intended seniority/function mix.
- [ ] Assign anonymous participant IDs (`PV1-P01`, `PV1-P02`, ...).
- [ ] Never store participant name/email in research session JSON.
- [ ] Keep recruitment/contact details outside research evidence files.

## Before each session

- [ ] Run `python3 contracts/v1/validate_contracts.py`.
- [ ] Run `python3 validation/browser_harness_v3.py`.
- [ ] Confirm prototype uses fictional fixtures.
- [ ] Open prototype without `?research=1` for participant-facing view.
- [ ] Prepare moderator notes separately.
- [ ] Confirm recording consent status.
- [ ] Do not explain Pursuit Intelligence, Access Intelligence, or dating-app inspiration.

## During session

- [ ] Start timer at first prototype exposure.
- [ ] Record first meaningful action and time.
- [ ] Preserve participant's terminology verbatim where useful.
- [ ] Do not explain the intended difference between the contextual investigation/preparation action and `Open pursuit workspace` until after the behavioral task.
- [ ] Assign one counterbalanced workspace stage scenario for Task 7 before the session; do not let the participant choose the easiest scenario.
- [ ] Note whether participant believes any action contacts/applies externally.
- [ ] Ask what information would change the decision most.
- [ ] Capture requested features as observations, not scope commitments.
- [ ] Avoid collecting real confidential employer/recruiter details unless necessary and explicitly consented.

## After each session

- [ ] Create one JSON record using `session_record.schema.json`.
- [ ] Run `python3 validation/validate_sessions.py`.
- [ ] Mark every P0 hypothesis `supported`, `mixed`, `contradicted`, or `not_tested`.
- [ ] Record contradictions even when they conflict with product intent.
- [ ] Store no real names in session records.
- [ ] Add synthesis notes only after preserving participant-level evidence.

## Stop / redesign triggers

Pause further recruitment and revise prototype if any of these occur repeatedly in the first 3 sessions:

- the contextual investigation/preparation action is interpreted as Apply/Contact;
- `Open pursuit workspace` is interpreted as an external action;
- the participant cannot identify the Pursuit Workspace next move without opening multiple sections;
- the stage-aware workspace feels like a different product/module at each stage rather than one continuous working file;
- the recommended route into a company is consistently viewed as speculative/untrustworthy;
- evidence selection is interpreted as independent verification;
- Briefing is perceived as another opportunity list rather than a decision queue;
- participants cannot identify the key concern/unknown from the opportunity review;
- prototype terminology prevents task completion.

A redesign trigger is not a product failure; it is the purpose of Product Validation-1.
