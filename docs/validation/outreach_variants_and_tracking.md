# PV-1 — Outreach Message Variants & Tracking Template

Status: Ready to use immediately
Last updated: 2026-08-24

## LinkedIn DM variants (A/B test across personas)

### Variant A — CTO / VP Engineering / Head of Technology

> Hi [Name] — I'm building an open-source career intelligence specification for senior tech leaders (Director/VP/C-level). It's not a job board or resume tool — it's about how executives decide which opportunities deserve pursuit, and how access routes (recruiter/referral/warm intro) factor in.
>
> Looking for a few people for a 25–35 min screen-share session with a fictional-data prototype. No job applications involved.
>
> If you've had a senior transition or recruiter interaction recently, I'd value your perspective. Happy to send screening questions.

### Variant B — Chief Transformation / Digital Officer / VP Operations

> Hi [Name] — I'm researching how senior operations/transformation leaders evaluate career opportunities beyond just "is this a skills match." The focus is on: which opportunities are strategically worth pursuing, what access routes matter (recruiter vs referral vs direct), and how career evidence supports positioning.
>
> Running 25–35 minute moderated sessions with a fictional-data prototype (no real applications or messages sent). If you've considered or completed a senior-level move recently, I'd appreciate your input.

### Variant C — Executive search / talent leader (for warm referrals)

> Hi [Name] — I'm building a career intelligence product concept specifically for Director/VP/C-level candidates (not recruiters). One key hypothesis is that executive-search-consultant-led opportunities behave differently from public postings.
>
> I'm running short research sessions (25–35 min) with senior leaders who've been through recruiter-led searches recently. If you know anyone in your network who fits — or if you'd be willing to share the research signup link — that would help enormously.
>
> Signup: https://github.com/mibrohimsulaeman-a11y/scopecareer/issues/new?template=participant-signup.yml

### Variant D — Short follow-up (48h after initial message viewed but no reply)

> Hi [Name] — following up briefly on my earlier note about the career intelligence research sessions. If the timing isn't right now, no problem at all. If you'd prefer, you can sign up directly here and we'll reach out when slots open: [signup link]

---

## Outreach tracking template

Copy this into Google Sheets / Airtable / Notion. **Do NOT store participant names in any file inside this repository.**

| Column | Purpose | Example |
|--------|---------|---------|
| `outreach_id` | Internal tracking ref only | `OUT-001` |
| `channel` | Where contacted | `linkedin_dm`, `github_issue`, `referral`, `community_post`, `warm_intro` |
| `persona_variant` | Which message variant used | `A`, `B`, `C`, `D` |
| `seniority_hint` | Approximate level (no name) | `VP Tech`, `CTO`, `Dir Ops` |
| `region_tz` | Timezone for scheduling | `IST`, `SGT`, `WIB` |
| `sent_date` | Date outreach sent | `2026-08-24` |
| `status` | Current funnel stage | `sent`, `viewed`, `replied`, `screener_sent`, `screened_pass`, `screened_fail`, `scheduled`, `completed`, `excluded`, `ghosted` |
| `pipeline_id` | Link to PV1-PXX if screened pass | `PV1-P01` |
| `notes` | Any useful context | `Referred by X; prefers evening IST` |

### Status flow

```
sent → viewed → replied → screener_sent → screened_pass → scheduled → completed
                                                    → screened_fail
         → ghosted (no response after 2 follow-ups)
```

---

## Weekly funnel review template

Use every Friday at end of day. Fill from tracking sheet + `participant_pipeline.json`.

| Metric | Week 1 target | Actual | Gap | Action if gap |
|--------|--------------|--------|-----|---------------|
| Total sent | 40+ | ___ | ___ | Increase daily volume |
| Response rate | ≥15% | ___% | ___ | Revise copy; try different variant |
| Screener sent | ≥12 | ___ | ___ | Follow up on replies faster |
| Screened pass | ≥8 | ___ | ___ | Widen ICP criteria slightly |
| Scheduled | ≥3 | ___ | ___ | Offer more time slots |
| Completed | ≥0 (week 1) | ___ | ___ | N/A for week 1 |

### Channel performance review

| Channel | Sent | Replied | Screened pass | Conversion % | Keep/Widen/Drop |
|---------|------|---------|---------------|-------------|-----------------|
| LinkedIn DM (Variant A) | | | | | |
| LinkedIn DM (Variant B) | | | | | |
| GitHub inbound | | | | | |
| Warm referrals | | | | | |
| Community posts | | | | | |

---

## Escalation triggers

| Condition | Action |
|-----------|--------|
| Sourced < 12 by end of Week 1 | Add 2+ new channels; increase to 20/day outreach |
| Response rate < 10% after 30+ sent | Rewrite subject line + first sentence; test shorter version |
| Scheduled < 3 after Week 1 | Reduce session length to 25 min max; offer weekend slots |
| Zero completed after 2 weeks | Consider incentive (e.g., ₹2000/US$25 gift card); check prototype loads correctly |
