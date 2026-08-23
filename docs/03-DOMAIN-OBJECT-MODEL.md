# ScopeCareer — Domain Object Model

Status: Working semantic model
Last updated: 2026-08-21

## 1. Modeling principles

- Objects represent durable product/business concepts, not database tables.
- Provenance and uncertainty are first-class.
- Public, candidate-private, delegated, and externally shared representations must be distinguishable.
- Candidate and Talent trust planes may share schemas, but not implicit data authority.
- Exact IDs/schema/constraints remain to be formalized in machine-readable contracts.

## 2. Identity and actor objects

### User
Account identity.

### Principal
Authenticated acting identity used for policy evaluation. Can be candidate, delegated coach, or future talent-side actor.

### DelegationGrant
Candidate-authorized access for another principal.

Fields to resolve later:

- grantor
- grantee
- purpose
- data scope
- object scope
- action scope
- start/end
- revocation

## 3. Career objects

### CareerProfile
Root candidate career context.

### CareerIntent
Desired direction, constraints, role families, mandates, geographies, company types, compensation, and avoidance criteria.

### EmploymentEpisode
Company/role/time period and structural context.

### LeadershipMandate
Problem/mission entrusted to the executive.

Examples: scale, turnaround, transformation, restructuring, integration, international expansion.

### TransformationProgram
Large program/change initiative linked to role/mandate.

### Achievement
Outcome-bearing accomplishment.

### DecisionExample
Executive decision context, alternatives, rationale, execution, result.

### ScopeFact
Represents measurable scope such as revenue, budget, P&L, team size, countries, customers, systems, transactions.

### StakeholderExposure
Board/executive/regulator/investor/customer/partner exposure.

### Skill
Functional/technical/domain/leadership competency label.

### Credential
Education, certification, professional qualification.

### CareerTransition
Promotion, step-up, lateral, industry/geography/function transition, entrepreneurial move, etc.

## 4. Evidence and epistemic objects

### Source
Origin material: resume, user input, public page, recruiter conversation, linked document, imported system, etc.

### Observation
What a Source actually stated/exposed before interpretation. Observation preserves source and observation time and does **not** automatically become a canonical fact.

### Assertion
Generic statement about any subject:

```text
subject
predicate
value
epistemic_status: Unknown | NeedsResearch | Inferred | Known
observation_refs[]
source_refs[]
confidence?
observed_at
valid_from?
valid_until?
supersedes?
sensitivity
```

`Assertion` replaces opportunity-specific epistemic modeling as the general primitive for Opportunity, Company, Person, SearchFirm, Selection, Career, and other intelligence objects.

Canonical chain:

`Source → Observation → Assertion → Assessment → Recommendation`

`Known` requires accepted evidence. AI confidence cannot silently upgrade `Inferred → Known`.

### EvidenceSnapshot
Immutable set of assertions/observations/revisions used as the input to a versioned assessment.

### Assessment
Versioned interpretation over an immutable EvidenceSnapshot. Required semantics include `input_snapshot_ref`, `evidence_revision`, `method_version`, `model_or_rule_version`, reasons, concerns, unknowns, confidence, created_at, and supersession.

### Recommendation
Action-oriented advice derived from assessments and kept separate from the assessment itself.

### CareerClaim
Atomic claim that may be used in positioning.

Required dimensions:

- text/structured value;
- provenance;
- evidence status;
- interpretation status;
- usage permission;
- sensitivity;
- linked evidence;
- candidate attestation status.

### EvidenceSource
Resume, document, user input, public source, imported system, transcript, etc.

### EvidenceLink
Relationship between claim and source.

### EvidenceAssessment
Self-Attested / Source-Backed / Corroborated / Externally Verified.

### UsageGrant
Where a claim may be used: private, resume, bio, interview, recruiter sharing, external sharing.

## 5. Market objects

### Company
Canonical company identity and public context.

### CompanyContext
Ownership, stage, industry, scale, geography, business model, strategic context.

### MarketSignal
Leadership change, expansion, M&A, funding, transformation, restructuring, strategic initiative, etc.

### TargetCompany
Candidate-specific target/watch relationship to a Company.

### SearchFirm
Executive-search/recruitment firm.

### SearchConsultant
Person associated with SearchFirm.

### MarketWatch
Durable monitoring definition; must not be modeled as a long-lived MCP protocol task.

## 6. Opportunity objects

### Opportunity
Root opportunity object; public or confidential.

Key links:

- Company
- Role
- Source
- SearchFirm/SearchConsultant
- RoleMandate
- SuccessProfile
- AccessRoutes
- Relationships
- SelectionProcess
- Offer

### OpportunitySource
Company career page, recruiter, search firm, referral, network conversation, manual capture, browser capture, other legitimate source.

### RoleMandate
What the role must accomplish.

### SuccessProfile
Required outcomes/evidence expected for success.

### OpportunityFact — deprecated semantic alias
Opportunity-specific fact storage is superseded by the generic `Assertion` primitive. Existing prose may say “opportunity fact”, but machine contracts represent it as an Assertion whose `subject_ref` is the Opportunity (or related Company/Person/SearchFirm object).

### OpportunityTrustAssessment
Source/recruiter/opportunity trust evidence and unresolved risk.

### OpportunityQualityAssessment
Mandate clarity, authority, sponsorship, company trajectory, role scope, compensation credibility, freshness, feasibility, etc.

### FitAssessment
Candidate capability/evidence alignment to role/mandate.

### TransitionAssessment
Career trajectory impact.

### PursuitAssessment
Versioned synthesis of fit, intent, quality, transition, access, risk, and unknowns over an immutable EvidenceSnapshot. It does **not** directly mutate candidate disposition and does not silently overwrite prior assessments.

### PursuitRecommendation
Separate candidate-facing recommendation derived from a PursuitAssessment. Recommendation is advice; candidate disposition remains an explicit candidate action.

### OpportunityDisposition
Candidate-private attention/intent dimension:

- Discovered
- Passed
- Watching
- Exploring
- Pursuing
- Closed

This is **not** the opportunity/search lifecycle and **not** the candidate selection lifecycle.

Orthogonal dimensions are required:

```text
Candidate Disposition
+ Opportunity/Search State
+ Candidate Selection State
+ Priority Allocation
```

A single opportunity can therefore be `Pursuing + Priority Active + Search Open + Recruiter Screen` simultaneously.

### PriorityAllocation / PriorityPolicy
Priority is a private candidate resource-allocation overlay, not an opportunity stage and not an external signal. Numeric limits, research budget, refresh frequency, and attention weight belong to configurable `PriorityPolicy`, not enum semantics.

## 7. Access and relationship objects

### Person
Candidate-known or opportunity-related person.

### Relationship
Structural candidate-to-person/company/search-firm relationship identity. It must not carry a permanent pseudo-factual strength score.

### RelationshipEvidence
Historical evidence such as shared employment, prior interaction, introduction, conversation, or other source-backed context.

### RelationshipAssessment
Versioned/contextual interpretation of relationship relevance/strength. “Worked with Sarah in 2021” may be evidence; “Sarah is a strong introduction route for this CTO role” is an assessment.

### AccessRouteAssessment
Opportunity-specific evaluation of a direct/recruiter/referral/internal/network route.

### Interaction
Call, email, meeting, message, recruiter conversation, coaching session, interview, etc.

### Introduction
Introduction route and state.

### Referral
Referral route and state.

### AccessRoute
Direct, recruiter-first, search consultant, warm referral, internal introduction, network-first, executive outreach.

### AccessPlan
Opportunity-specific recommended access strategy with evidence/confidence.

## 8. Positioning objects

### ExecutiveNarrative
Candidate-wide positioning.

### PositioningBrief
Opportunity-specific positioning strategy.

### ResumeMaster
Approved master resume representation.

### ResumeVariant
Opportunity-specific version.

### ResumeChange
Original/proposed/evidence/reason/approval state.

### ExecutiveBio
Short external-facing leadership profile.

### LeadershipStory
Reusable evidence-backed story for selection conversations.

## 9. Selection objects

### SelectionProcess
Opportunity-specific process graph.

### SelectionStage
Search consultant, hiring executive, peer, CHRO, CEO, board, case, reference, offer, or custom.

### SelectionParticipant
Person/stakeholder associated with a stage.

### StakeholderHypothesis
Likely agenda/concern/decision influence; explicitly inference unless source-backed.

### PreparationBrief
Stage/person-specific preparation.

### Debrief
Candidate notes/voice after interaction.

### OpenQuestion
Information that materially affects pursuit/selection decision.

### Commitment
Follow-up/action promised by either party.

## 10. Offer and outcome objects

### Offer
Compensation and non-financial terms.

### OfferComponent
Base, bonus, equity, sign-on, benefits, etc.

### DecisionCriterion
Mandate, authority, team, trajectory, compensation, risk, lifestyle, geography, optionality.

### DecisionBrief
Structured decision support.

### Outcome
Withdrawn, rejected, offer, accepted, declined, closed, etc.

## 11. Strategy objects

### StrategySignal
Observed longitudinal pattern with sample size/confidence/context.

### StrategyHypothesis
Candidate-facing hypothesis to test.

### StrategyExperiment
Role/geography/mandate/access/positioning experiment.

### ExperimentObservation
Outcome/interaction evidence supporting or weakening a hypothesis.

## 12. Sharing and governance objects

### SharePacket
Explicit cross-plane disclosure bundle.

Must include:

- owner candidate;
- recipient;
- purpose;
- included objects/claims;
- excluded sensitive categories if relevant;
- created time;
- expiry;
- revocation state;
- allowed uses.

### ConsentRecord
Explicit consent event.

### PolicyDecision
Server authorization result and basis.

### AIInteractionRecord
Model/provider/version, source refs, prompt/template version where material, tool proposals/calls, approvals/corrections, result used/not used.

### ExternalEffectReceipt
Evidence that send/publish/share/apply actually occurred.

## 13. Relationship summary

```text
Candidate
 ├─ CareerIntent
 ├─ CareerClaim ─ EvidenceSource
 ├─ EmploymentEpisode ─ LeadershipMandate ─ Achievement
 ├─ TargetCompany ─ Company ─ MarketSignal
 ├─ Relationship ─ Person/SearchFirm
 └─ Opportunity
      ├─ RoleMandate
      ├─ FitAssessment
      ├─ OpportunityQualityAssessment
      ├─ TransitionAssessment
      ├─ PursuitAssessment
      ├─ AccessPlan
      ├─ PositioningBrief / ResumeVariant
      ├─ SelectionProcess
      └─ Offer / Outcome
```
