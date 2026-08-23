# ScopeCareer — Future Agent Capability Packs

Status: Future product notes; not Candidate V1 scope unless explicitly promoted
Last updated: 2026-08-21

## 1. Architectural rule

Names such as Candidate MCP, Coach MCP, Recruiter MCP, and Search Consultant MCP are logical product/capability packs over a shared MCP gateway and domain platform.

Do not create a separate physical server merely because a persona differs.

## 2. Candidate pack — V1

Current Candidate V1 contract is authoritative in `05-CANDIDATE-MCP-CONTRACT-V1.md`.

## 3. Delegated Career Coach pack — V1.x candidate

Candidate explicitly delegates selected access.

Potential tools:

| Tool | Purpose |
|---|---|
| `client.review_career` | Review trajectory and current strategy |
| `client.find_evidence_gaps` | Identify weak/unsupported claims |
| `client.review_positioning` | Review narrative and positioning |
| `client.review_opportunity` | Provide second opinion on opportunity |
| `strategy.design_experiment` | Define role/geography/mandate/access test |
| `strategy.review_results` | Review experiment outcomes |
| `session.prepare` | Prepare coaching session brief |
| `session.capture_notes` | Record session notes within delegated scope |
| `action_plan.create` | Create candidate-reviewable action plan |
| `progress.review` | Longitudinal progress review |

Coach must not inherit access to all relationships, compensation, confidential opportunities, or external effects by default.

## 4. Corporate Recruiter pack — separate Talent product

Potential tools:

| Recruiter job | Tool/capability |
|---|---|
| Understand hiring need | `mandate.create_from_intake` |
| Define success | `mandate.define_success_profile` |
| Draft role | `job.draft` |
| Review wording/risk | `job.review` |
| Publish approved role | `job.publish` |
| Market map | `talent.map_market` |
| Candidate discovery | `talent.search` |
| Qualification evidence | `candidate.review_qualifications` |
| Evidence comparison | `candidate.compare_evidence` |
| Search strategy | `search.recommend_strategy` |
| Draft outreach | `outreach.draft` |
| Send approved outreach | `outreach.send` |
| Prescreen preparation | `screen.prepare` |
| Pipeline update | `candidate.update_pipeline` |
| Interview plan | `selection.build_plan` |
| Client/hiring-team brief | `search.prepare_client_brief` |
| Search analytics | `search.review_progress` |

Avoid opaque primitives such as `candidate.score` and `candidate.rank_best` as the default abstraction.

## 5. Corporate recruiter canonical workflows — future

### Search strategy from mandate

```text
mandate.create_from_intake
        ↓
mandate.define_success_profile
        ↓
talent.map_market
        ↓
talent.search
        ↓
candidate.review_qualifications
        ↓
search.recommend_strategy
```

### Draft but do not publish

```text
job.draft
   ↓
Recruiter review
   ↓
explicit approval
   ↓
job.publish
```

### Build evidence longlist without contacting

```text
talent.search
   ↓
candidate.map_evidence
   ↓
longlist dossiers
```

No outreach side effect.

## 6. Executive Search Consultant specialization — future

Additional tools/capabilities:

| Tool | Purpose |
|---|---|
| `search.create_longlist` | Research-grade longlist |
| `search.map_companies` | Target-company/adjacency mapping |
| `candidate.prepare_dossier` | Evidence-backed candidate dossier |
| `candidate.track_relationship` | Long-term relationship history |
| `mandate.track_confidentiality` | Confidential search controls |
| `client.prepare_progress_review` | Market feedback/search progress |
| `candidate.prepare_client_packet` | Candidate presentation packet |
| `reference.prepare` | Structured reference workflow |
| `search.close_and_learn` | Outcome → mandate/search learning |

Executive Search Consultant differs from corporate recruiter through retained/confidential search, client advisory, market mapping, and long-term relationship management.

## 7. Talent Sourcer pack — future

Focus question: **Where is the talent?**

Potential tools:

- `market.map_talent`
- `market.map_companies`
- `market.analyze_role_supply`
- `search.build_query`
- `search.expand_adjacent_profiles`
- `talent.search`
- `talent.build_longlist`
- `talent.identify_evidence`
- `search.review_conversion`

## 8. Hiring Manager pack — future

Focus question: **What evidence remains unresolved for this selection process?**

Smaller toolset:

- `role.review_mandate`
- `role.review_success_profile`
- `candidate.review_packet`
- `candidate.compare_against_requirements`
- `selection.prepare_interview`
- `selection.capture_feedback`
- `selection.identify_open_questions`
- `decision.prepare_packet`

Do not give broad sourcing/talent-search access by default.

## 9. Talent-plane safety principles

- recruiter remains decision maker;
- evidence and gaps are more important than opaque ranking;
- candidate private pursuit/strategy data is unavailable unless explicitly shared;
- candidate Share Packet defines scope/purpose/expiry;
- draft ≠ send/publish;
- candidate shortlist ≠ outreach;
- protected/sensitive attributes require separate policy/legal controls;
- employer-side AI is a separate governance problem from candidate-side intelligence.

## 10. Low-frequency actors do not need MCP

Do not create MCP packs for every actor such as referrer, former colleague, board contact, or reference provider.

Use secure, small Web/link workflows for low-frequency actors unless recurring AI-intensive work justifies MCP.
