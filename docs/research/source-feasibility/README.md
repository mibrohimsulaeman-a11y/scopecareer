# ScopeCareer — Source / Integration Feasibility

Status: Desk research started; architecture-independent  
Verified: 2026-08-21

## Purpose

Determine which data/source categories are realistically available for ScopeCareer V1 before selecting production architecture.

This work answers:

- can the data be obtained legitimately and reliably?
- through which API/feed/user-capture path?
- what is the freshness/coverage profile?
- what permissions or commercial relationship are required?
- what provenance class should the source receive?
- what legal/ToS/redistribution questions remain?

It does **not** choose backend frameworks, storage engines, cloud providers, queues, or model providers.

## Status vocabulary

- `candidate_v1` — credible candidate for V1 source mix, subject to unresolved legal/commercial checks noted in matrix.
- `candidate_v1_optional` — technically useful but not necessary for first V1 cut.
- `defer_v1_1` — feasible but consent/scope complexity argues for deferral unless product validation changes priority.
- `manual_first` — use candidate-driven/manual capture before building automated source coverage.
- `not_core` — source is unsuitable as a core dependency for current candidate-side V1.
- `research_required` — evidence insufficient for a product decision.

## Preliminary source strategy

### Opportunity discovery baseline

Prefer a layered mix:

1. candidate/manual/confidential opportunity capture;
2. user-initiated browser capture;
3. direct public ATS job-board interfaces where available (Greenhouse, Lever, Ashby);
4. one licensed/contracted aggregator API may supplement recall if economics/redistribution terms pass review;
5. do not make LinkedIn scraping or undocumented career-site endpoints a core dependency.

### Company identity/context baseline

Use jurisdiction/public registries and authoritative filings where they fit geography:

- SEC EDGAR for US public companies/filing signals;
- Companies House for UK entities;
- ACRA open data/API for Singapore;
- India OGD/MCA-derived datasets as identity/reference input only after freshness is verified;
- GLEIF for LEI-backed global legal-entity identity/ownership relationships.

These sources do not by themselves solve leadership changes, funding/M&A globally, or executive mandate signals. General market/news-provider selection remains open.

### Relationship baseline

Start with:

- manual Person/Relationship/Interaction capture;
- optional Google Contacts import after explicit consent;
- Microsoft contacts as a later equivalent.

Do not infer strong relationship/access merely because a contact exists.

### Communication timeline

Gmail/Google Calendar/Microsoft Graph are technically feasible, but they are high-sensitivity integrations. Keep them `defer_v1_1` unless Product Validation-1 shows communication timeline is essential to category value.

## Primary evidence

See `source_matrix.json` and `source_matrix.md` for per-source details and official URLs.
