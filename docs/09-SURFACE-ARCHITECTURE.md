# ScopeCareer — Surface Architecture

Status: Canonical channel direction
Last updated: 2026-08-21

## 1. Channel strategy

The product should not be Web-only as an end state, but native mobile should not dominate MVP scope.

Target sequence:

1. Desktop-first responsive Web — primary workspace
2. Browser capture — important capture surface
3. Mobile Web/PWA — MVP companion
4. Candidate MCP — V1 agent-access surface
5. Native iOS + Android companion — post-validation

## 2. Desktop Web

Primary for high-cognitive-load work:

- Career Evidence Graph construction;
- evidence review;
- company/opportunity deep research;
- Pursuit Intelligence;
- multi-opportunity comparison;
- resume review/edit/diff;
- positioning;
- strategy analysis;
- privacy administration.

## 3. Primary Web navigation — V1 validation direction

Top-level navigation is intentionally **not** 1:1 with backend domains.

```text
Briefing
Opportunities
Career
```

### Briefing

Temporal attention ledger: material changes, due follow-ups, preparation, and decisions that need attention now.

It projects Opportunity, Relationship/Interaction, Commitment, Market Signal, and Selection data without becoming a second catalog.

### Opportunities

The durable opportunity universe:

- Shortlist / All / Saved / Active / Closed;
- master-list + persistent detail;
- side-by-side comparison;
- research / Explore;
- explicit Pursue transition;
- active Pursuit Workspace entry.

Market research and target-company intelligence can be contextual modes inside this domain without requiring a permanent top-level `Market` tab in V1.

### Career

Career Evidence Graph, Career Intent, evidence permissions, narrative, and reusable artifacts.

### Contextual workspace areas

When an opportunity is active, the Pursuit Workspace exposes:

`Brief / People / Positioning / Process / Record`

These compose existing domains rather than creating new ones. For example, relationship/access data appears under `People`; selection/offer data appears under `Process`; sources/interactions/debriefs appear under `Record`.

Future validation may justify additional top-level surfaces such as Market or Strategy Intelligence, but they should not be added merely because corresponding backend domains exist.

## 4. Browser capture

Core action:

`Save to ScopeCareer`

Input:

- career-page URL;
- job-board URL where permitted;
- pasted JD;
- selected page text.

Result:

`Capture → Normalize → Source Snapshot → Trust Check → Opportunity Draft → Research`

Must preserve source/canonical URL and timestamp.

Confidential roles require manual/recruiter-note capture even without URL.

## 5. PWA/mobile web

Good for:

- daily shortlist;
- opportunity triage;
- Pass / Watch / Explore;
- compact pursuit summary;
- follow-up reminders;
- recruiter/search-consultant activity;
- interview reminders;
- quick company brief;
- interview prep;
- note/debrief capture;
- pipeline updates.

Do not force full desktop editing/research experience onto phone.

## 6. Native mobile — post-validation

If justified, target both iOS and Android for international executive ICP.

Native value drivers:

- push notifications;
- share sheet;
- voice capture;
- camera/document capture;
- calendar/contact integration;
- smoother post-call debrief;
- compact selection preparation.

Killer candidate workflow:

`Recruiter call ends → 90-second voice note → AI structures people/facts/concerns/commitments → opportunity update proposal → candidate approves`

## 7. MCP surface

MCP is a power surface for supported AI clients.

It can support:

- discovery;
- market research;
- pursuit reasoning;
- access planning;
- preparation;
- strategy review;
- rich cards via MCP Apps where available.

MCP is optional agent access, not a replacement for first-party UX.

## 8. Cross-surface invariants

- same canonical object IDs;
- same dispositions;
- same evidence/provenance semantics;
- same external-effect policy;
- same trust/privacy boundary;
- renderer may differ;
- gesture may differ;
- authorization never depends on UI surface.
