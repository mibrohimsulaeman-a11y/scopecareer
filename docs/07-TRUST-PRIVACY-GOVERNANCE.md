# ScopeCareer — Trust, Privacy, AI Governance, and External Effects

Status: Canonical trust direction
Last updated: 2026-08-21

## 1. Career Data Vault

Career data is professionally sensitive and must be treated as a product capability, not a settings afterthought.

Potentially sensitive data includes:

- current compensation;
- career intent / intention to leave;
- confidential opportunities;
- recruiter/search-firm relationships;
- private coaching notes;
- unpublished employer metrics;
- references;
- offer details;
- relationship graph.

## 2. Data-vault principles

- candidate controls private career data;
- no training on private candidate data by default;
- export supported;
- correction supported;
- deletion supported subject to lawful/operational retention constraints;
- field-level sensitivity;
- opportunity-level confidentiality;
- explicit external-sharing permission;
- AI-use traceability;
- revocable sharing where technically/legally meaningful;
- minimal disclosure by purpose.

## 3. Sensitivity model — initial

Suggested classes:

- Public
- Career Internal
- Sensitive
- Highly Confidential

Exact retention and regulatory controls remain to be defined by market/legal review.

## 4. Career claim truth model

Never conflate candidate approval with independent verification.

Dimensions:

### Provenance
Resume / User / Document / Public / Imported / AI Extraction

### Evidence
Self-Attested / Source-Backed / Corroborated / Externally Verified

### Interpretation
Fact / Inference / Suggested Wording

### Usage
Private / Resume / Bio / Interview / Recruiter Sharing / External Sharing

## 5. AI output truth labels

Material output should be able to distinguish:

- Known Fact
- Candidate Claim
- External Evidence
- Inference
- Recommendation
- Suggested Wording
- Unknown

Confidence must be shown where inference materially affects a decision.

## 6. Evidence-grounded positioning

AI may select, prioritize, compress, clarify, restructure, and suggest wording.

AI must not invent experience, scope, achievement, employer, title, budget, P&L, geography, team size, or outcome.

If evidence is insufficient, output must say so.

## 7. External-effect boundary

Canonical separations:

- Generate ≠ Approve
- Draft ≠ Send
- Draft ≠ Publish
- Prepare ≠ Apply
- Assess ≠ Reject
- Shortlist ≠ Contact
- Approve ≠ Share

Material external actions need:

- explicit operation;
- server authorization;
- purpose check;
- sensitivity check;
- approval/step-up as required;
- idempotency where applicable;
- external receipt/outcome;
- audit.

## 8. Share Packet

Candidate-to-recruiter/talent sharing must use explicit bounded packets rather than implicit graph access.

Required semantics:

- candidate owner;
- recipient;
- purpose;
- included claims/artifacts;
- usage restrictions;
- expiry;
- revocation state;
- audit.

## 9. Delegated Coach

Coach access is candidate-delegated.

Example allowed scope:

- selected career evidence read;
- strategy review;
- opportunity commentary;
- session notes.

Example restricted unless explicitly granted:

- all relationships;
- compensation;
- external resume sharing;
- application submission.

## 10. Candidate vs Talent boundary

Candidate-side intelligence and employer-side candidate evaluation are separate product/governance domains.

Do not assume a candidate's private pursuit/fit assessment can be exposed to or reused by an employer.

Future talent/recruiter functionality must have a separate legal/regulatory assessment, permissions, and model-governance boundary.

## 11. Opportunity Trust

Opportunity/recruiter trust should be evidence-based, not false-certainty classification.

Possible signals:

- official company/search-firm source;
- verified/corroborated recruiter identity;
- domain consistency;
- canonical role source;
- duplicate/stale listing;
- suspicious information/payment request;
- inconsistent identity/company details.

Possible outputs:

- High
- Moderate
- Unresolved
- Elevated Risk

Always show reasons and unresolved evidence.

## 12. Privacy-safe notifications / Stealth Mode

Default lock-screen notification copy should avoid exposing sensitive employer/role data.

Prefer:

> New opportunity update

instead of naming a competitor, confidential role, compensation, or fit/pursuit details.

Allow:

- notification content control;
- sensitive-screen masking;
- email subject discretion;
- session/device management;
- opportunity confidentiality labels.

## 13. AI action broker

Canonical flow:

`User intent → AI proposes read/tool/action → Policy resolves principal/purpose/object/scope → approval if required → operation executes → receipt/audit → AI summarizes`

The model never decides its own authority.

## 14. MCP/server security requirements

- server-side authorization for every resource/tool/action;
- input validation;
- output validation/sanitization;
- least-privilege context assembly;
- no raw unrestricted database credentials for model/tool runtime;
- no MCP-token passthrough as downstream credential;
- scope/issuer/audience validation per chosen OAuth/MCP implementation;
- rate limiting/abuse controls;
- audit;
- policy changes must take effect even if a client cached tool lists;
- sensitive operations require explicit consent/approval as appropriate.

## 15. Legal/privacy research backlog

Before international launch, validate at minimum:

- GDPR/data-subject rights and lawful bases for supported markets;
- India data-protection requirements;
- cross-border transfer/vendor processing;
- retention/deletion obligations;
- employment/recruitment AI obligations for future Talent Plane;
- automated decision-making limitations;
- consent vs legitimate-interest boundaries;
- sensitive data categories;
- recruiter/search-firm sharing terms.

Do not treat product notes as legal advice.
