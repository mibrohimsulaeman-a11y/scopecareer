# ScopeCareer — Future Multi-Sided Product Boundary

Status: Future product boundary
Last updated: 2026-08-21

## 1. Product-line separation

Do not turn V1 into a two-sided recruiting marketplace.

Roadmap boundary:

```text
V1
Candidate Plane
+ Candidate MCP
+ Web/PWA/Extension

V1.x
Delegated Coach
+ Coach MCP

Separate Product Track
Talent Intelligence Plane
+ Recruiter
+ Executive Search Consultant
+ Sourcer
+ Hiring Manager
```

## 2. Candidate Plane

Owns candidate-private:

- career evidence;
- career intent;
- private relationships;
- opportunity research;
- pursuit decisions;
- positioning;
- private selection notes;
- offers;
- strategy.

## 3. Coach delegated access

Coach accesses selected Candidate Plane data through explicit delegation.

Potential tools:

- `client.review_career`
- `client.find_evidence_gaps`
- `client.review_positioning`
- `client.review_opportunity`
- `strategy.design_experiment`
- `strategy.review_results`
- `session.prepare`
- `session.capture_notes`
- `action_plan.create`
- `progress.review`

Exact names are future contracts.

## 4. Talent Plane

Separate product/governance environment for employer/search-firm workflows.

Candidate data enters only under a valid sharing/data basis; candidate-private graph is not globally searchable.

## 5. Corporate Recruiter capability direction

Possible future capabilities:

- mandate intake;
- success profile;
- job draft/review/publish;
- market map;
- talent search;
- evidence review;
- search strategy;
- outreach draft/send;
- prescreen prep;
- pipeline;
- selection plan;
- client/update analytics.

Avoid primitive opaque tools such as `candidate.score` or `candidate.rank_best` as the primary abstraction.

Prefer:

- `candidate.review_qualifications`
- `candidate.map_evidence`
- `candidate.identify_gaps`
- `candidate.compare_evidence`

## 6. Executive Search Consultant specialization

Additional future capabilities:

- longlist;
- company adjacency mapping;
- candidate dossier;
- long-term relationship tracking;
- confidential mandate controls;
- client progress review;
- candidate client packet;
- reference workflow;
- search close-and-learn.

## 7. Talent Sourcer specialization

Focus:

- market/talent mapping;
- role supply;
- query building;
- adjacent-profile expansion;
- longlist construction;
- evidence identification;
- search conversion analysis.

## 8. Hiring Manager specialization

Smaller toolset:

- mandate review;
- success-profile review;
- candidate packet review;
- requirement/evidence comparison;
- interview preparation;
- feedback capture;
- unresolved questions;
- decision packet.

Do not give broad talent-search universe by default.

## 9. Talent UX rule

Candidate discovery may use lightweight card interaction. Talent-side candidate evaluation should be evidence-first and should avoid superficial swipe-style judgement.

## 10. Regulatory/product boundary

Future employer-side ranking/selection AI is materially different from candidate-side decision support and requires separate legal, fairness, governance, data, and audit design.

Do not reuse candidate-private `PursuitAssessment` as employer candidate score.
