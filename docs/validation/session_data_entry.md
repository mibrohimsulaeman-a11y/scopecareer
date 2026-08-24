# PV-1 Session Data Entry Workflow

Status: Operational reference  
Use after every completed session, within 30 minutes.

## Step 1 — Start from template

```bash
cp docs/validation/sessions/_template.json docs/validation/sessions/PV1-P0N.json
```

Replace `N` with the next sequential number (01, 02, ...).

## Step 2 — Fill participant_segment

From your warm-up notes:

| Field | Source |
|---|---|
| `seniority` | Warm-up question 1 |
| `function` | Warm-up question 2 |
| `search_state` | Screener response or warm-up |
| `recent_transition` | true/false from screener Q3 |
| `recruiter_or_search_firm_experience` | true/false from screener Q4 |
| `confidential_opportunity_experience` | true/false from screener Q5 |
| `international_search_experience` | true/false from screener Q6 |

## Step 3 — Fill tasks array

For each of the 8 required tasks (`attention`, `opportunity_compare`, `opportunity_dossier`, `explore_pursue`, `pursuit_workspace`, `access_plan`, `evidence_binding`, `stage_aware_workspace`):

| Field | How to fill |
|---|---|
| `completed` | Did the participant reach the task's decision/answer? |
| `time_to_first_action_seconds` | Seconds from task prompt to first meaningful prototype interaction; null if not measured |
| `observations` | Behavioral notes: what they clicked, what they said while doing it, what surprised you |
| `participant_quotes` | Verbatim quotes — use exact wording, especially for confusions and value statements |
| `confusions` | Specific terminology or concept misunderstandings observed during THIS task |

Optional Task 9 (`mobile_companion`) may be appended if conducted.

## Step 4 — Assign hypothesis outcomes

Map each hypothesis to its task evidence:

| Hypothesis | Primary evidence source |
|---|---|
| PV-H01 | `attention` task observations + quotes |
| PV-H02 | `explore_pursue` — did they distinguish commitment levels? Any external-effect confusion? |
| PV-H03 | `opportunity_dossier` — could they identify supported vs estimated vs open? Trace provenance? |
| PV-H04 | `access_plan` — was route credible? Distinguished fact from interpretation? |
| PV-H05 | `evidence_binding` — did they understand selection ≠ verification? Worth friction? |
| PV-H06 | `opportunity_compare` — did comparison improve trade-off reasoning? |
| PV-H07 | `pursuit_workspace` — could they find next move without opening all sections? |
| PV-H08 | `stage_aware_workspace` — coherent across stage change? |

Outcome scale:
- **supported** — behavior matched the intended comprehension without prompting
- **mixed** — partial comprehension with some friction or initial misread
- **contradicted** — clear misunderstanding or rejection of the intended concept
- **not_tested** — task skipped or participant blocked before reaching the relevant interaction

Confidence: `high` = unambiguous behavioral evidence; `moderate` = some ambiguity; `low` = thin evidence.

## Step 5 — Fill cross-cutting arrays

| Field | What goes here |
|---|---|
| `terminology_confusion` | Words/labels the participant found unclear or used differently |
| `trust_concerns` | Privacy, data-source credibility, "who sees this?" concerns |
| `missing_information` | Things they expected to see but didn't |
| `requested_features` | Feature requests captured as observations ("I wish I could...") |
| `spontaneous_value_statements` | Unprompted positive/negative value reactions |
| `overall_notes` | Anything else: session conditions, moderator impressions (clearly labeled as such) |

## Step 6 — Validate

```bash
python3 docs/validation/validate_sessions.py
```

Expected output includes your session count incrementing. If INVALID, read the error message carefully — it names the exact field and reason.

## Step 7 — Update pipeline

Edit `docs/validation/participant_pipeline.json`:

1. Find the participant entry by ID.
2. Change `"stage"` to `"completed"`.
3. Add `"session_file": "sessions/PV1-P0N.json"`.
4. Update `"updated_at"` to today.
5. Re-run validator to confirm.

## Step 8 — Check redesign triggers

Review `execution_checklist.md` § Stop/redesign triggers against your session evidence. If any trigger fired, flag it in `overall_notes` with prefix `[REDESIGN-TRIGGER]`.

## Rules

- Never store real names, emails, employer names, or compensation in the JSON.
- Store recruitment contact details outside `sessions/`.
- Do not modify another session's record retroactively without noting why.
- If recording consent was given, store the recording outside the repository and note only `"recording": true`.
