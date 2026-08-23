# ScopeCareer — Decisions, Assumptions, Risks, and Open Questions

Status: Living register
Last updated: 2026-08-21

## 1. Locked / strong decisions

### D-001 Product category
ScopeCareer is a **Personal Executive Career Intelligence System**, not merely an AI job-search operating system.

### D-002 Initial wedge
Start with Director/VP/C-level technology, digital, transformation, and operations leaders for India/APAC/international roles.

### D-003 Evidence model
Candidate approval is not external verification. Provenance, evidence status, interpretation, and usage permission are independent.

### D-004 Fit vs pursuit
Fit and Pursuit are separate concepts. Do not default to candidate-facing pseudo-objective 0–100 fit as the primary decision surface.

### D-005 Opportunity without JD
Opportunity can exist without public JD/URL.

### D-006 Access Intelligence
Access is first-class in candidate V1.

### D-007 Relationship Lite
Represent recruiter/search-firm/contact relationships in V1, but do not build a full social graph.

### D-008 Offer core
Offer capture/decision support belongs in core lifecycle; advanced negotiation/benchmarking can be later.

### D-009 Interaction grammar
Canonical actions: Pass / Watch / Explore / Pursue / Priority.

### D-010 Progressive complexity
5-second triage → 5-minute intelligence → serious workspace.

### D-011 Surface strategy
MVP: Desktop-first Web + responsive PWA + browser capture + Candidate MCP. Native mobile is post-validation.

### D-012 MCP architecture
No physical server/codebase per persona. Persona/actor resolves to capability, data, object, and action policy.

### D-013 Candidate MCP V1
Candidate MCP is V1, not post-MVP.

### D-014 Trust-plane split
Candidate and Talent are separate trust planes.

### D-015 Coach model
Coach is delegated access into Candidate Plane, not a default separate data plane.

### D-016 External effects
Generate/Draft/Prepare/Assess are separate from Approve/Share/Send/Publish/Apply/Reject.

### D-017 Talent product
Recruiter/Search/Hiring functionality is a separate product track, not Candidate V1 scope.

### D-018 MCP protocol baseline
New implementation should target the current MCP revision at build time; as of 2026-08-21 the verified current revision is `2026-07-28`, with stateless-core assumptions.

### D-019 Semantic contract authority
Capability/Object/State/Action/Policy/Evidence/Effect are frozen as one coherent semantic contract layer. Capability and entity contracts must not evolve as independent semantic universes.

### D-020 Generic epistemic primitive
Use `Source → Observation → Assertion → Assessment → Recommendation`. Generic Assertion replaces OpportunityFact as the canonical epistemic primitive across domains.

### D-021 Orthogonal opportunity states
Candidate Disposition, Opportunity/Search State, Candidate Selection State, and Priority Allocation are independent dimensions. A generic `Opportunity.status` is prohibited.

### D-022 Versioned assessment snapshots
Material assessments are append/versioned against immutable input snapshots/evidence revisions and method/model versions; they are superseded, not silently overwritten.

### D-023 Relationship evidence vs interpretation
Relationship facts/evidence are separate from RelationshipAssessment and opportunity-specific AccessRouteAssessment. Do not store permanent numeric relationship strength as canonical fact.

### D-024 Priority semantics
Priority is private candidate attention/resource allocation, not an opportunity stage or external signal. Limits/budgets/refresh frequency are PriorityPolicy.

### D-025 Browser extension trust boundary
Browser extension is a first-class untrusted-content ingestion client: webpage → capture sandbox → source/observation → proposed domain mutation. Page content never grants tool/action authority.

### D-026 Early product validation
Category-defining product validation begins after semantic/policy plus prototypeable MCP/UX/AI contracts, before source/integration finalization and before technical architecture.

## 2. Working assumptions requiring validation

### A-001 Initial ICP willingness to use PWA/MCP
Need actual user interviews; executives may prefer email/calendar/WhatsApp-like workflows more than a dedicated PWA.

### A-002 Browser extension usefulness
Strong precedent exists in job-search products, but must validate for executive/recruiter-led opportunities.

### A-003 Relationship data source
Need a compliant, practical way to capture/import contacts and interaction history without depending on prohibited scraping.

### A-004 Opportunity source coverage
Need source strategy by geography/market and terms-of-service/API constraints.

### A-005 Company/market signals
Need reliable source quality, freshness, licensing, and cost model.

### A-006 Recruiter/search-firm intelligence coverage
Need source strategy and whether user-provided relationship data is primary.

### A-007 Voice debrief
High-value hypothesis; validate usage/privacy and transcription quality.

### A-008 Numeric internal ranking
May be useful internally, but requires calibration/evaluation before any strong probability-like interpretation.

## 3. Product risks

### R-001 Scope explosion
Market + relationship + opportunity + resume + interview + MCP can become too broad. V1 must prove the four core loops before expansion.

### R-002 Commodity regression
If implementation prioritizes resume/tracker/JD features and weakens Access/Pursuit/Market, product collapses toward existing job-search category.

### R-003 Research hallucination
Company/role/recruiter research must retain provenance, unknowns, and confidence.

### R-004 Privacy failure
A leak of confidential search intent, compensation, recruiter relationships, or current-employer data is high-impact.

### R-005 MCP overdependence
Host plan/capability differences mean MCP cannot be the only product path.

### R-006 Two-sided contamination
Adding recruiter features too early can compromise category clarity, consent boundaries, and regulatory posture.

### R-007 Gamification overreach
Dating-like simplicity can become trivializing or compulsive; keep executive-grade language and deliberate Pursue action.

### R-008 Opportunity Trust overclaim
Trust assessment must report evidence/risk, not claim certainty that cannot be established.

## 4. Open product questions

- Exact initial geography priority: India-first, Singapore/APAC-first, or combined?
- Exact initial role ontology for technology/digital/transformation/operations.
- What initial `PriorityPolicy.max_active`, research budget, and refresh frequency should V1 use? Priority semantics themselves are already locked.
- How much Market Intelligence belongs in V1 versus V1.1?
- Which relationship imports are supported first: manual, Google Contacts, Microsoft, CSV, email-derived with consent?
- How are recruiter/search-firm records sourced and maintained?
- What is the initial opportunity-source mix without brittle scraping?
- Which market signals are worth paying for?
- Does V1 need calendar/email integration, or can timeline/manual capture prove the loop first?
- Is voice debrief V1 or V1.1?
- How should candidate evidence be externally verified, if at all, without becoming a background-check product?

## 5. Open architecture questions

- Multi-tenant SaaS model and data-region requirements.
- Primary relational/search/vector storage choices.
- Research browsing/provider abstraction.
- LLM model routing and cost controls.
- Evaluation architecture for pursuit/access/research quality.
- OAuth/IAM provider.
- MCP SDK/language and deployment topology.
- Tool catalog cacheScope strategy for candidate/delegated principals.
- Long-running task persistence and scheduler architecture.
- Browser extension permission model.
- PWA offline requirements.

## 6. Open legal/compliance questions

- GDPR roles/lawful basis/data-subject request mechanics.
- India privacy requirements.
- Cross-border processing and subprocessors.
- Retention periods.
- Source licensing/terms for job/company/people data.
- Future employer-side AI high-risk obligations.
- Consent requirements for imported relationship/contact data.
- Recording/transcription consent across jurisdictions.

## 7. Decision change policy

When changing a locked decision:

1. record the reason/evidence;
2. identify affected documents/contracts;
3. update this register;
4. update downstream docs;
5. preserve superseded rationale where it matters.
