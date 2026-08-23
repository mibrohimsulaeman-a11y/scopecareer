# ScopeCareer — Product Domains and Capabilities

Status: Working decomposition
Last updated: 2026-08-21

## 1. Domain model

The product is organized around stable business capabilities, not UI pages and not AI-agent count.

Primary domains:

1. Career
2. Market
3. Opportunity
4. Pursuit
5. Access
6. Positioning
7. Selection
8. Outcome / Strategy
9. Trust / Governance
10. Agent Access / MCP

## 2. Career domain

Purpose: represent what the executive has done, at what scale, with what evidence, and what they want next.

Capabilities:

- Career Evidence Graph management
- Resume/CV import and extraction
- Career claim provenance
- Evidence attachment/corroboration
- Usage permissions
- Employment history
- Leadership mandates
- Transformation programs
- Business/organisation/geographic scope
- Achievement and decision library
- Career Intent
- Executive Narrative
- Career transitions
- Credential/education representation
- Evidence search/retrieval

## 3. Market domain

Purpose: understand where executive opportunities may emerge.

Capabilities:

- Target-company watchlists
- Target-role landscape
- Company context
- Leadership/organisation signals
- Expansion/funding/M&A/transformation signals
- Search-firm directory/context
- Consultant/recruiter context
- Market research
- Target discovery
- Market watch/monitor definitions

## 4. Opportunity domain

Purpose: create and maintain an intelligence object for a potential career opportunity, including confidential and non-public roles.

Capabilities:

- Public opportunity ingestion
- Browser capture
- Manual/confidential opportunity creation
- Job/JD normalization
- Role mandate extraction
- Company-role context research
- Generic research assertions over Opportunity/Company/Person/SearchFirm (`Known/Inferred/Unknown/NeedsResearch`)
- Observation → Assertion provenance and freshness
- Opportunity Trust
- Source freshness and provenance
- Search stage
- Confidentiality handling
- Opportunity timeline

## 5. Pursuit domain

Purpose: determine whether an opportunity deserves attention and career/network capital.

Capabilities:

- Eligibility screening
- Evidence coverage assessment
- Mandate fit
- Scope/scale fit
- Industry adjacency
- Career Intent alignment
- Opportunity Quality
- Transition Intelligence
- Risk/unknown analysis
- Pursuit Recommendation
- Assessment confidence
- Ranking for discovery/shortlisting
- Priority Pursuit state

## 6. Access domain

Purpose: identify and manage routes into a company/opportunity.

Capabilities:

- Person/contact representation
- Relationship structural representation
- RelationshipEvidence / InteractionHistory
- versioned RelationshipAssessment
- opportunity-specific AccessRouteAssessment
- Search firm / recruiter representation
- Interaction history
- Introduction/referral tracking
- Access route generation
- Warm-route analysis
- Direct/recruiter/referral/network-first strategy
- Follow-up tracking
- Relationship reminders
- Share Packet creation for explicit external disclosure

## 7. Positioning domain

Purpose: turn approved evidence into opportunity-specific executive positioning without inventing claims.

Capabilities:

- Opportunity Positioning Brief
- Resume variant preparation
- Resume diff/evidence trace
- Resume versioning
- Executive Bio
- Executive Narrative
- Leadership Story Library
- JD terminology alignment when semantically justified
- Candidate review/accept/edit/reject workflow

## 8. Selection domain

Purpose: model and support the entire executive selection process.

Capabilities:

- Selection-process map
- Stakeholder map
- Stakeholder concern/agenda hypotheses
- Interview preparation
- Case/presentation preparation
- Search-consultant screen preparation
- Debrief capture
- Voice/text note structuring
- Unresolved question tracking
- Follow-up commitments
- Reference stage representation
- Selection timeline

## 9. Outcome and Strategy domain

Purpose: understand result and improve future career strategy.

Capabilities:

- Application/pursuit outcome
- Offer capture
- Decision brief
- Pipeline analytics
- Access-route effectiveness
- Role-family/geography/source patterns
- Confidence/sample-size-aware analytics
- Strategy hypotheses
- Strategy experiments
- Longitudinal career strategy review

## 10. Trust and Governance domain

Capabilities:

- Authentication
- Tenant/account boundary
- Career Data Vault
- Field-level sensitivity
- Opportunity-level confidentiality
- Consent
- Sharing scope/recipient/purpose/expiry
- Share Packet
- Revocation
- Audit trail
- AI provenance
- Model/tool traceability
- Data export/deletion/correction
- Stealth notification policy
- External-effect approval gates
- Policy evaluation
- Rate/risk controls

## 11. Agent Access / MCP domain

Capabilities:

- MCP gateway
- OAuth authorization
- principal resolution
- persona/capability-pack resolution
- purpose/data/object/action scope
- resource access
- tool invocation
- task lifecycle adapter
- MCP App / rich-result support when host supports it
- fallback structured content
- server-side authorization on every operation
- host capability degradation
- tool catalog/cache scoping
- audit

## 12. Cross-domain semantic spine

All channels share the same domain language:

`Capability → Object → State Machine → Action → Policy → Evidence/Audit/External Effect`

All intelligence follows:

`Source → Observation → Assertion → Assessment → Recommendation`

This is machine-authoritative in `../contracts/v1/`.

## 12. Cross-domain invariants

- UI navigation does not define domain boundaries.
- An AI agent does not own a domain.
- A persona does not own a deployment.
- A candidate-facing fit assessment is not reusable as employer-side candidate ranking by default.
- Every material generated claim can trace to evidence or be explicitly marked inference/suggestion.
- External effect must have a separate operation from draft/preparation.
- Unknown must remain a supported state.
- Confidential opportunity must not require a public JD.
- Relationship graph is candidate-private unless explicitly shared.
