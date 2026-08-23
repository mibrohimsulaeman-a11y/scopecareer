# ScopeCareer — Canonical User Journeys

Status: Working journey authority
Last updated: 2026-08-21

## 1. Purpose

These journeys capture the product behaviors that must remain coherent across first-party Web/PWA and Candidate MCP. They are not final screen flows; they are product-value flows.

## 2. Journey A — Career evidence onboarding

Goal: create a trustworthy executive career model without forcing the user to manually rebuild a CV.

```text
Import Resume / Add Sources
        ↓
AI extracts claims/history/scope/mandates
        ↓
Claims labeled by provenance
        ↓
Candidate reviews / corrects / attests
        ↓
Usage permissions selected
        ↓
Career Evidence Graph ready
```

Acceptance principles:

- extraction never upgrades self-attested data to externally verified;
- ambiguous scale/achievement is surfaced for review;
- candidate can keep claims private;
- candidate can link supporting sources later.

## 3. Journey B — Define Career Intent

Goal: describe desired trajectory rather than a keyword alert.

```text
Target role families
+ desired mandates
+ scope/seniority
+ geography
+ company context
+ compensation/constraints
+ transitions/avoidances
        ↓
Career Intent
```

Output becomes input to market discovery, opportunity discovery, pursuit, and strategy learning.

## 4. Journey C — Morning Opportunity Intelligence

Prompt/entry intent:

> What's worth my attention today?

```text
New opportunities
+ target-company signals
+ recruiter/search-consultant activity
+ follow-up due
+ selection actions
+ Priority Pursuit changes
        ↓
Attention ranking
        ↓
Daily Shortlist
```

Product output should emphasize 3–5 high-value items rather than job volume.

Actions:

`Pass / Watch / Explore`

## 5. Journey D — Strategic target discovery without vacancy

Intent:

> Find companies that may need someone like me even if there is no public vacancy.

```text
Career Intent
+ Leadership Mandates
+ Career Evidence
        ↓
Target-company discovery
        ↓
Market/company signals
        ↓
Target hypotheses
        ↓
Watch / Explore company
```

Do not create fake job opportunities from market signals. Keep `MarketSignal` distinct from `Opportunity`.

## 6. Journey E — Capture a public opportunity

```text
Company career page / legitimate job source
        ↓
Browser: Save to ScopeCareer
        ↓
Canonical URL + source snapshot
        ↓
Normalize role/company/JD
        ↓
Trust/source checks
        ↓
Opportunity draft
        ↓
5-second card
```

User may Pass/Watch/Explore without entering a long workspace.

## 7. Journey F — Capture a confidential recruiter-led opportunity

```text
Recruiter call / message
        ↓
Create confidential opportunity
        ↓
Company/role may be partially known
        ↓
Facts tagged Known/Inferred/Unknown/Needs Research
        ↓
Search firm/recruiter linked
        ↓
Explore/Pursue without public JD
```

A public URL/JD is never required.

## 8. Journey G — Pursuit triage

Intent:

> Of these opportunities, which deserve serious time?

```text
Candidate Evidence
+ Career Intent
+ Role Mandate
+ Opportunity Quality
+ Transition Value
+ Access
+ Risk / Unknowns
        ↓
Pursuit assessment
```

Output:

- recommendation;
- reasons for;
- concerns;
- open questions;
- confidence;
- evidence.

Do not collapse to one opaque percentage.

## 9. Journey H — Access-first strategy

Intent:

> Don't prepare an application yet. Find the strongest route in.

```text
Opportunity
+ Company
+ Search firm/recruiter context
+ Candidate Relationship Graph
        ↓
Access routes
        ↓
Direct / Recruiter / Warm Referral / Internal Intro / Network First
        ↓
Access Plan
```

External outreach is not automatic.

## 10. Journey I — Bind career evidence to mandate

```text
Role mandate fragment
        ↓
Candidate selects "Relevant to me"
        ↓
System retrieves plausible Career Evidence
        ↓
Candidate selects best evidence
        ↓
Evidence binding saved
        ↓
Reused in pursuit / positioning / resume / selection prep
```

This is a signature interaction proving the Career Evidence Graph is useful to the user, not just an internal data structure.

## 11. Journey J — Pursue and create serious workspace

```text
Explore
   ↓
Deep intelligence
   ↓
Candidate chooses Pursue
   ↓
Opportunity Workspace activates
```

Candidate-facing workspace areas:

- **Brief** — research synthesis, current picture, open questions, next move;
- **People** — relationships, access, recruiter/search-consultant and selection stakeholders;
- **Positioning** — evidence bindings, positioning brief, resume/documents;
- **Process** — recruiter conversation, selection, final/reference, offer when relevant;
- **Record** — timeline, sources, interactions, debriefs and commitments.

These areas are projections over existing canonical domains, not replacement domain objects. Workspace composition is stage-aware: pre-contact → recruiter conversation → selection → final/references → offer.

## 12. Journey K — Prepare executive positioning

```text
Opportunity mandate
+ selected career evidence
+ open risks/gaps
        ↓
Positioning Brief
        ↓
Resume change proposals
+ Executive Narrative
+ Leadership Stories
```

Every proposed factual statement traces to permitted evidence.

`prepare ≠ share`.

## 13. Journey L — Recruiter/search-consultant call debrief

High-value mobile/agent workflow:

```text
Call ends
   ↓
Candidate records short voice/text debrief
   ↓
AI structures
   ├─ Person
   ├─ Opportunity
   ├─ New facts
   ├─ Concerns
   ├─ Commitments
   ├─ Open questions
   └─ Follow-up
   ↓
Suggested opportunity updates
   ↓
Candidate reviews/approves
```

Example extracted changes:

- reports to CEO;
- team ~180 — inferred/self-attested from recruiter conversation;
- search confidential;
- CEO focused on international expansion;
- concern: direct fintech experience;
- follow-up Monday.

## 14. Journey M — Selection-process preparation

```text
Current stage + participant
        ↓
Known agenda / concerns / history
        ↓
Relevant Career Evidence
        ↓
Questions / stories / open risks
        ↓
Preparation Brief
```

After stage completes, debrief updates next-round strategy.

## 15. Journey N — Offer decision

```text
Offer captured
        ↓
Financial + non-financial terms
        ↓
Mandate / authority / team / trajectory / risk / lifestyle / optionality
        ↓
Decision Brief
        ↓
Candidate decides
```

System assists; it does not autonomously accept/decline.

## 16. Journey O — Career strategy review

Intent:

> I keep progressing for Head of Engineering but not CTO. Why?

```text
Opportunity history
+ access routes
+ selection progression
+ outcomes
        ↓
Patterns with sample size/context
        ↓
Preliminary signal
        ↓
Strategy hypothesis / experiment
```

Never state strong career conclusions from small samples without uncertainty.

## 17. Journey P — Priority Pursuit

Candidate marks a small number of opportunities Priority.

System increases:

- research refresh;
- market/company monitoring;
- access monitoring;
- relationship follow-up;
- selection readiness.

Priority remains private and causes no employer-side signal.
