# ScopeCareer — Candidate MCP Contract v1

Status: Machine-bound V1 contract draft
Last updated: 2026-08-21

## 1. Goal

Allow a candidate to use supported AI clients as a reasoning/conversation layer over ScopeCareer while ScopeCareer remains authoritative for evidence, opportunities, state, policy, audit, and external effects.

## 2. Tool-design rules

- Prefer domain-meaningful tools over CRUD primitives.
- Return evidence/confidence/unknowns explicitly.
- Avoid sending the entire Career Evidence Graph by default.
- Ask server for purpose-bounded context.
- Read and draft tools should be useful even in read/fetch-limited hosts.
- Mutations must be separate from external effects.
- All tools are re-authorized server-side.
Machine-readable authority:

- tool/action bindings: `../contracts/v1/mcp/candidate_tools.json`;
- exact tool input/output JSON Schemas: `../contracts/v1/mcp/candidate_schema_registry.json`;
- exact resource projections/cache policy: `../contracts/v1/mcp/candidate_resources.json`.

The prose below explains intent. It does not override those registries.

## 3. Candidate tools

### `career.get_context`

Purpose: obtain minimum-necessary career context for a declared purpose.

Suggested inputs:

- `purpose`
- `opportunity_id?`
- `requested_dimensions?`

Output may include:

- relevant intent;
- evidence summaries;
- approved claims;
- restrictions/sensitivity;
- unknowns.

Must not blindly dump compensation, private relationships, coach notes, or confidential facts.

### `career.review_strategy`

Purpose: analyze longitudinal outcome/strategy patterns with confidence and sample size.
### `career.bind_evidence`

Purpose: bind a specific Role Mandate fragment to candidate-selected Career Claims/evidence for downstream Pursuit, Positioning, Resume, and Selection reuse.

Binding is explicit candidate action and **does not change evidence status**.

### `market.discover_targets`

Purpose: identify companies/market targets aligned with Career Intent and mandate evidence.

### `market.research`

Purpose: bounded research on companies, markets, leadership context, and relevant signals.

### `opportunity.discover`

Purpose: discover relevant opportunities beyond title matching.

Should consider:

- Career Intent;
- leadership mandate;
- scale;
- geography;
- company context;
- opportunity source/trust.

### `opportunity.capture`

Purpose: normalize a URL, pasted JD, recruiter note, or confidential/manual role into an Opportunity draft.

Capture must preserve source/provenance.

### `opportunity.research`

Purpose: deepen company, role, mandate, search context, stakeholders, unknowns.

### `opportunity.check_trust`

Purpose: assess source/recruiter/opportunity trust evidence.

Never claim fake/real certainty beyond evidence.

### `opportunity.assess_pursuit`

Purpose: synthesize fit, quality, transition, access, risk, unknowns, and confidence.

Default output is not a pseudo-objective percentage.

### `access.plan`

Purpose: identify credible routes into an opportunity/company.

Output:

- direct route;
- recruiter/search consultant;
- known/warm relationships;
- referral possibilities;
- network-first strategy;
- confidence and missing information.

### `positioning.prepare`

Purpose: prepare opportunity-specific executive positioning brief grounded in permitted evidence.

### `resume.prepare_variant`

Purpose: prepare a resume variant/change proposal.

Must preserve evidence links and never invent claims.

This tool prepares; it does not externally share or submit.

### `selection.prepare`

Purpose: prepare for a stage/stakeholder in the selection process.

### `interaction.debrief`

Purpose: structure typed/voice-derived conversation/interview notes into facts, inferences, concerns, commitments, open questions, and suggested opportunity updates.

Suggested updates remain reviewable.

### `opportunity.set_disposition`

Purpose: mutate **Candidate Disposition only**: Pass, Watch, Explore, Pursue, Close.

It cannot mutate opportunity/search state or selection state.

### `opportunity.set_priority`

Purpose: activate/deactivate the private Priority Allocation overlay subject to PriorityPolicy. Priority is not an opportunity stage and creates no employer-side signal.

### `selection.update_state`

Purpose: mutate **Candidate Selection State only**: Contacted, Applied, Recruiter Screen, Interview, Final, Reference, Offer, Closed.

It cannot mutate Candidate Disposition.

External application submission, outreach, or other external effects remain separate operations with receipts.

## 4. Candidate resources

Initial resource families:

- `career://me`
- `career://intent`
- `career://evidence/{id}`
- `opportunity://{id}`
- `company://{id}`
- `relationship://person/{id}`
- `selection://{opportunity_id}`

Exact URI templates, output schemas, sensitivity, policy references, and private cache scopes are now contracted in `../contracts/v1/mcp/candidate_resources.json`.

## 5. Candidate MCP native workflows

### Morning opportunity intelligence

Prompt intent: "What's worth my attention today?"

Inputs:

- new opportunities;
- target-company signals;
- recruiter/follow-up due;
- selection actions;
- Priority Pursuit changes.

Output should prioritize attention, not volume.

### Strategic discovery

Prompt intent: "Find companies that may need someone like me even without a public vacancy."

Uses:

`career.get_context → market.discover_targets → market.research`

### Pursuit triage

Prompt intent: "Of these opportunities, which deserve serious time?"

Uses evidence, quality, transition, access, risk, unknowns.

### Access-first

Prompt intent: "Do not prepare an application. Find the strongest route in."

Uses `access.plan`; no resume/application side effect.

### Career adviser

Prompt intent: "Why am I progressing for Head of Engineering but not CTO?"

Uses outcome history with sample-size/confidence caveats.

## 6. Long-running work

Potential MCP-task use:

- deep-research selected opportunities;
- bounded target-company research;
- evidence import reconciliation.

Durable monitoring should create first-class ScopeCareer watch objects, not rely on protocol task lifetime.

## 7. Host capability degradation

If host is read/fetch-only:

- research/discovery/assessment/context still work;
- mutation tools may be unavailable or return a first-party deep link/action packet;
- external effects remain first-party or supported authorized host only.

## 8. External-effect tools are not Candidate V1 defaults

Future operations such as:

- `candidate.share_packet`
- `outreach.send`
- `application.submit`

must be explicit separate tools with stronger approval/security semantics.

## 9. Acceptance properties

Candidate MCP is not conformant unless tests prove:

- private-field minimization;
- deny on wrong principal/object;
- delegation expiry/revocation;
- cross-plane isolation;
- evidence-grounded positioning;
- unknown/confidence preservation;
- disposition/search/selection/priority dimensions cannot collapse into one status;
- assessment versions preserve input snapshots/evidence revisions;
- no prepare→send collapse;
- audit completeness;
- cached tool catalog cannot widen authorization;
- read-only host degradation remains useful.
