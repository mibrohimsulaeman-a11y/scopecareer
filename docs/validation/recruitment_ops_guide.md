# ScopeCareer PV-1 — Recruitment Operations Guide

Status: Operational; use immediately for week 1 execution
Last updated: 2026-08-24

## 1. Channel plan

### Channel A: Personal network / warm referrals (highest expected conversion)

- Expected volume week 1: **5–8 sourced**
- Conversion assumption: ~30–50% sourced → completed
- Action:
  - Identify 10–15 contacts in your network who match the ICP profile
  - Send personalised DM/WhatsApp using `recruitment_outreach.md` short template
  - Follow up after 48 hours if no response
  - Ask each respondent to refer 1–2 others in their network

### Channel B: GitHub issue signup (passive inbound)

- Expected volume week 1: **2–5 sourced** (depends on repository visibility)
- Conversion assumption: unknown until first data point; monitor weekly
- Action:
  - Ensure `participant-signup.yml` issue template is live and linked from README + Pages landing page
  - Share repo link on LinkedIn/Twitter with context about open-source specification + research signup
  - Check issues daily; move respondents to pipeline as `sourced`

### Channel C: LinkedIn direct outreach (cold)

- Expected volume week 1: **5–10 sourced** (low conversion, high volume needed)
- Conversion assumption: ~3–8% response rate → ~20% of responses pass screener → scheduled
- Action:
  - Search LinkedIn for Director/VP/C-level technology/digital/transformation/operations in India/Singapore/APAC
  - Use formal email template from `recruitment_outreach.md`
  - Send 10–15 connection requests + messages per day during week 1
  - Track every sent message in a simple spreadsheet or CRM (outside research evidence files)
  - Do not mention hypotheses or intended differentiators

### Channel D: Executive communities / Slack groups / forums

- Expected volume week 1: **2–4 sourced**
- Action:
  - Identify 3–5 communities where target ICP is active (e.g., CTO Craft, Engineering Leadership forums, APAC tech leadership groups)
  - Post a brief non-salesy message describing the research opportunity with link to GitHub signup
  - Respect community rules; ask moderator permission if required

---

## 2. Daily ops cadence (Week 1)

| Day | Actions |
|-----|---------|
| Day 1 (Mon) | Send 10+ LinkedIn outreach messages; post to 1–2 communities; verify GitHub signup form works |
| Day 2 (Tue) | Send 10+ more outreach; follow up on Day-1 messages that got views but no reply; check inbound issues |
| Day 3 (Wed) | Screen all sourced candidates so far; schedule first 2–3 sessions; continue outreach (10+) |
| Day 4 (Thu) | Continue outreach; screen new sourced; confirm Day 5+ session slots |
| Day 5 (Fri) | Weekly funnel review: count sourced/screened/scheduled/completed; decide if channels need widening |
| Weekend | Light follow-up only; prepare session materials |

**Target by end of Week 1:** ≥12 participants at `sourced` stage, ≥3 at `scheduled`.

---

## 3. Screening workflow

When someone responds positively:

1. Send the screening questions from `participant_screener.md` (all 8 questions).
2. Evaluate against mix requirements:
   - ≥4 with senior transition ≤3 years
   - ≥3 with recruiter/exec-search interaction
   - ≥2 with confidential opportunity experience
   - Mix of employed + actively searching
   - Not only highly technical AI enthusiasts
3. If passes: add to `participant_pipeline.json` with anonymous ID (`PV1-P01` etc.), set status `screened`.
4. Assign counterbalanced workspace stage scenario (see `participant_pipeline.json` targets).
5. Move to `scheduled` once a time slot is confirmed.

**Never store real names or contact details in research files.**

---

## 4. Scheduling template

After screening passes:

> Hi [name],
>
> Thank you for agreeing to participate! Here are some time slots that work on my end:
>
> - [Option 1 — date/time with timezone]
> - [Option 2]
> - [Option 3]
>
> The session will be 25–35 minutes via [Zoom/Google Meet]. I'll share a prototype link beforehand — no preparation is needed. Everything shown uses fictional data.
>
> Please let me know which slot suits you best.

Once confirmed:
1. Update pipeline status to `scheduled`.
2. Send calendar invite.
3. 24 hours before: send reminder + prototype URL (without `?research=1`).
4. Day of session: run through the condensed day-of checklist below.

---

## 5. Session day-of checklist (printable card)

```
BEFORE SESSION STARTS
□ Run: python3 contracts/v1/validate_contracts.py
□ Run: python3 docs/validation/browser_harness_v3.py
□ Confirm prototype shows fictional fixtures only
□ Open prototype WITHOUT ?research=1
□ Prepare moderator notes document (separate file)
□ Confirm recording consent status
□ Confirm participant ID assignment

DURING SESSION
□ Start timer at first prototype exposure
□ Record first meaningful action + timestamp
□ Capture participant terminology verbatim where useful
□ Do NOT explain Pursuit Intelligence, Access Intelligence, or dating-app inspiration
□ Do NOT explain Investigate vs Open pursuit workspace difference before behavioral task
□ Assign pre-assigned counterbalanced scenario for Task 7
□ Note whether participant believes any action contacts/applies externally
□ Ask: "What information would change your decision most?"
□ Capture requested features as observations, not scope commitments
□ Avoid collecting real confidential employer/recruiter details unless consented

AFTER SESSION
□ Create one JSON record per session_record.schema.json
□ Run: python3 docs/validation/validate_sessions.py
□ Mark every P0 hypothesis supported/mixed/contradicted/not_tested
□ Record contradictions even when they conflict with product intent
□ Verify no real names stored
□ Add synthesis notes only after preserving participant-level evidence
□ Move pipeline status to 'completed'
```

---

## 6. Redesign checkpoint protocol (after P01–P03)

After completing sessions P01, P02, and P03:

1. Review each session record for critical failure signals (defined in test_protocol.md).
2. Count how many sessions had each critical failure signal.
3. **If any single critical failure occurs in ≥2 of 3 sessions:**
   - Pause further recruitment immediately.
   - Revise the prototype to address the failure.
   - Restart counterbalance allocation from scratch (reset pipeline stage assignments).
   - Document the redesign in decision register.
   - Resume recruitment with revised prototype.
4. **If no critical failures reach threshold:** continue recruiting toward 6–8 total sessions.

A redesign trigger is not product failure — it validates that the methodology catches problems early.

---

## 7. Escalation / widening rules

| Condition | Action |
|-----------|--------|
| Sourced < 12 after week 1 | Widen: add 2+ new channels; increase daily outreach volume; ask existing sourced for referrals |
| Scheduled < 3 after week 1 | Revisit outreach copy; consider reducing friction (offer shorter 20-min option) |
| Completed < 6 after 3 weeks | Consider incentive (gift card / donation); extend timeline; expand geography |
| Any channel converting < 5% | Deprioritise that channel; shift effort to higher-converting channels |
| Redesign trigger fires | Pause recruitment; fix prototype; restart allocation |

---

## 8. Inline copy snippets

### Short WhatsApp/DM opener

> Hi — saya sedang menguji prototype produk career intelligence untuk Director/VP/C-level. Fokusnya bagaimana senior leaders memilih opportunity yang layak dikejar dan memakai evidence karier lebih terstruktur. Saya mencari beberapa orang untuk sesi research 25–35 menit. Prototype dengan data fiktif, tidak ada application atau outreach yang dikirim.

### Formal email subject line

> Subject: 30-minute research session — executive career intelligence prototype

### Community post template

> I'm running a small product-research round for an executive career intelligence concept designed for Director/VP/C-level leaders in tech/digital/transformation/operations. Looking for 25–35 minute screen-shared sessions using a fictional-data prototype. If you've had a senior-level transition or recruiter interaction recently and are curious, you can sign up here: [GitHub issue link]. No job applications are involved — this is purely research.
