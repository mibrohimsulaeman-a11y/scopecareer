# PV-1 Moderator Run-Sheet

Status: Live-session quick reference  
Derived from: `test_protocol.md` (authoritative)  
Print one copy per session; do not substitute this sheet for the protocol when recording evidence.

## Pre-flight checklist (T-15 min)

| # | Check | Done |
|---|-------|------|
| 1 | `python3 contracts/v1/validate_contracts.py` → VALID | ☐ |
| 2 | `python3 docs/validation/browser_harness_v3.py` → PASS 20/20 | ☐ |
| 3 | Prototype URL ready: `http://127.0.0.1:8765/` | ☐ |
| 4 | Researcher view tab ready: `?research=1` | ☐ |
| 5 | Stage scenario URL pre-loaded (Task 7 counterbalance) | ☐ |
| 6 | Recording consent confirmed and noted | ☐ |
| 7 | Timer / stopwatch visible | ☐ |
| 8 | Session JSON template open (`sessions/_template.json`) | ☐ |

## Rules of engagement

- Do NOT explain Pursuit Intelligence, Access Intelligence, state-machine names, or dating-app inspiration.
- Do NOT explain the intended difference between Investigate and Open Pursuit Workspace until after Task 4.
- Do NOT explain the five workspace areas or that they are expected to remain stable across stages.
- Preserve participant wording verbatim where useful.
- If the participant asks "does this send/contact anything?" — record it verbatim; do not confirm or deny before the task is done.

## Session flow

### Warm-up (2 min)
Confirm: role/seniority, function, recent search experience, current search state. Note these for `participant_segment`.

---

### T1 — Briefing attention (5 min)

> "You have five minutes between meetings. Open this product and tell me what needs your attention in the next day."

Watch for: Briefing understood as event/action ledger vs job list; reaches opportunity without re-searching.

Then:
> "Where would you go to see every opportunity you are currently considering?"

Record as: `attention` / PV-H01

---

### T2 — Shortlist comparison (5 min)

> "Show me the roles on the shortlist. Pick two you are genuinely weighing and compare them."

Watch for: discovers Shortlist + compare; whether aggregate score is requested; comparison changes preference or next action.

Record as: `opportunity_compare` / PV-H06

---

### T3 — Opportunity dossier (7 min)

> "Open the VP Technology role. Explain whether it deserves more of your time and what could still change your mind."

Do not explain Confirmed / Estimate / Open unless blocked. After exploration:

> "Where did the claim that this reports to the CEO come from?"

Failure signal: cannot trace material claim to source OR treats estimate/open question as fact.

Record as: `opportunity_dossier` / PV-H03

---

### T4 — Explore vs Pursue (5 min)

> "You are interested, but you are not ready to spend network capital yet. What would you do next?"

After investigation action:
> "You now want to treat this as a serious live opportunity. Show me what you would do."

Only after both actions:
- "What did the investigation action mean?"
- "What did Open pursuit workspace mean?"
- "Did either imply applying, submitting, sharing, or contacting anyone?"

Failure signal: either action interpreted as external effect.

Record as: `explore_pursue` / PV-H02

---

### T5 — Pursuit Workspace next move (6 min)

Participant should be in Pre-contact workspace.

> "Without opening every section, tell me what you should do next, what you know now, and what is still blocking the decision."

Watch for: time-to-next-move; whether Brief works by default; expects auto-send?

Then:
> "If you closed the product and came back later, what would you expect this workspace to remember?"

Record as: `pursuit_workspace` / PV-H07

---

### T6 — Access route + evidence binding (8 min)

Prompt A:
> "Assume you do not want to click Apply. What is the strongest route into this company, and how confident are you in that route?"

Watch for: relationship fact vs interpretation vs route recommendation vs external action.

Record as: `access_plan` / PV-H04

Prompt B:
> "The role values international platform scaling. Show which part of the candidate's experience supports that mandate."

After selection:
> "What changed when you selected that evidence? Was it verified, selected, or rewritten?"

Correct ≈ "selected/bound"; truth status unchanged.

Record as: `evidence_binding` / PV-H05

---

### T7 — Stage-aware workspace (6 min)

Switch to pre-assigned stage scenario. Say only:

> "Time has moved forward. This opportunity is now at [stage]. Tell me what changed, what matters most now, and what you would do next."

Stage-specific focus:
- Recruiter → debrief / commitments
- Selection → next stakeholder / known concern / evidence
- Final → case/reference work
- Offer → terms/trade-offs; offer intent ≠ external acceptance

Record as: `stage_aware_workspace` / PV-H08

---

### Post-task interview (5 min, only if time permits)

1. What would make this part of a real executive-search routine?
2. Which part felt most differentiated?
3. Which labels felt unnatural?
4. Where did it ask too much interpretation/data?
5. Which decision still required leaving the product?
6. At what point was the workspace too heavy?
7. Would this remain useful when not actively searching?

---

## Immediate post-session actions

1. Fill session JSON within 30 minutes (memory degrades fast).
2. Run `python3 docs/validation/validate_sessions.py`.
3. Update participant pipeline stage.
4. Flag any stop/redesign trigger from `execution_checklist.md`.

## Redesign triggers — watch continuously

Pause recruitment if any occurs repeatedly in first 3 sessions:
- Investigation/Pursue read as external Apply/Contact
- Workspace next move unclear without opening all sections
- Stage-aware workspace feels like different product per stage
- Access route viewed as speculative/untrustworthy
- Evidence binding misread as verification
- Briefing perceived as another list
- Key concern/unknown unidentifiable
- Terminology blocks completion
