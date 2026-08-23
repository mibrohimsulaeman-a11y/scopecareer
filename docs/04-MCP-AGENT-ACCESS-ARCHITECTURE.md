# ScopeCareer — Agent & MCP Access Architecture

Status: Canonical architecture direction
Last updated: 2026-08-21
External protocol facts verified: 2026-08-21

## 1. Product role of MCP

MCP is a first-class agent-access surface allowing users to operate their ScopeCareer intelligence from supported AI clients while keeping ScopeCareer as the trusted system of record.

```text
                    SCOPECAREER
                         │
            ┌────────────┴────────────┐
            │                         │
     FIRST-PARTY UX              AGENT ACCESS
            │                         │
 Web / PWA / Extension           MCP Gateway
                                      │
                         ChatGPT / Claude / Others
                                      │
                              Domain APIs/Services
```

MCP does not replace first-party Web/PWA.

## 2. No server-per-persona architecture

Do not implement one physical MCP codebase/server per persona.

Conceptual labels such as Candidate MCP, Coach MCP, Recruiter MCP, Search Consultant MCP are **capability packs / policy views**.

Canonical authorization shape:

`Principal + Trust Plane + Persona/Role + Delegation + Purpose + Capability/Tool + Object + Data Scope + Action + Current Policy → Decision`

This follows the KnowledgeHub design principle already used elsewhere: persona resolves capability/data/action scope; persona is not 1:1 with application or deployment.

## 3. MCP gateway

```text
AI Client
    │ OAuth
    ▼
MCP Gateway
    ├─ Principal resolution
    ├─ Tenant/account resolution
    ├─ Trust-plane resolution
    ├─ Delegation resolution
    ├─ Purpose binding
    ├─ Capability/tool policy
    ├─ Object/data scope
    ├─ Approval policy
    ├─ Rate/risk controls
    └─ Audit
          │
          ▼
Career Intelligence APIs
```

**Invariant:** tool visibility is UX; server authorization is security.

Every operation re-authorizes server-side even if the tool was previously returned by `tools/list`.

## 4. Trust planes

### Candidate Trust Plane

Contains candidate-private:

- Career Evidence Graph;
- Career Intent;
- relationships;
- confidential opportunities;
- private compensation;
- intention to leave;
- coach notes;
- offer data;
- private strategy.

### Talent Trust Plane — future separate product line

Contains:

- client mandates;
- search projects;
- recruiter workflow;
- candidate packets explicitly available to that plane;
- selection records under a separate governance basis.

**Hard invariant:** Candidate Plane data is not recruiter-searchable merely because both products share infrastructure.

### Coach

Coach is a delegated principal into Candidate Plane, not a third default trust plane.

Delegation must have explicit scope, actions, duration, and revocation.

## 5. Cross-plane sharing

Normal bridge is **Share Packet**.

```text
Career Evidence Graph
      ↓ candidate selects claims/artifacts
Purpose + Recipient + Allowed Use
      ↓
Share Packet
      ↓ expiry / revocation
Talent Plane / external recipient
```

No implicit full-profile sharing.

## 6. MCP 2026-07-28 protocol baseline

Verified from official MCP release material on 2026-08-21:

- protocol revision `2026-07-28` is the current target baseline;
- core is stateless request/response;
- old handshake/session assumptions are removed in the new revision;
- method/tool routing metadata is available in headers;
- list responses support cache hints/scope;
- Tasks are a formal extension;
- MCP Apps are part of the extensions model;
- authorization received hardening changes;
- legacy stateful assumptions must not be designed as the new baseline.

Implementation must follow the actual SDK/spec chosen at build time; these are architecture constraints, not a substitute for the normative MCP spec.

## 7. Cache-aware authorization

Because capability/resource/tool lists can be cached, persona-specific catalogs need scoped caching.

Requirements:

- never reuse private catalog content across principals/tenants;
- include correct cache scope semantics;
- tool catalog is coarse eligibility only;
- every actual resource read/tool call re-evaluates current authorization;
- revocation/policy change must not rely only on client catalog refresh.

## 8. Resources vs Tools vs Tasks vs Apps

### Resources = context/state

Examples:

- `career://me`
- `career://evidence/{id}`
- `opportunity://{id}`
- `company://{id}`
- `relationship://person/{id}`
- future `search://mandate/{id}`

Resource reads must return minimum-necessary authorized context, not unrestricted database objects.

### Tools = bounded operations

Examples:

- `opportunity.assess_pursuit`
- `access.plan`
- `positioning.prepare`
- future `job.publish`
- future `outreach.send`

### Tasks = long-running protocol work

Appropriate for bounded long work such as:

- deep research 20 opportunities;
- research 100 target companies;
- reconcile imported career evidence;
- build a bounded talent map in future Talent Plane.

**Do not model durable monitoring as a seven-day MCP task.**

Example:

`market.create_watch` → durable platform `MarketWatch` → platform scheduler/event engine.

MCP Task can orchestrate initial setup/research; business durability belongs to ScopeCareer.

### MCP Apps = rich conversational UI when supported

Use for opportunity cards, comparison, evidence selection, or decision widgets when host supports MCP Apps.

Canonical interaction grammar must survive hosts without rich UI.

## 9. Same grammar, not same renderer

Canonical semantics:

- Pass
- Watch
- Explore
- Pursue
- Priority

Canonical intelligence dimensions:

- Mandate
- Fit
- Quality
- Transition
- Access
- Trust
- Unknowns

Renderers may differ:

- Web: full product UI
- PWA: compact responsive
- Extension: capture/mini dossier
- MCP App: conversational embedded UI
- Plain MCP host: structured content/text fallback

## 10. ChatGPT availability constraint

Verified 2026-08-21 from OpenAI Help:

- full custom MCP including write/modify is in beta for ChatGPT Business and Enterprise/Edu;
- Pro can connect custom MCP in developer mode with read/fetch permissions, not full write/modify;
- therefore MCP cannot be the only primary UX for an individual-executive ICP.

V1 must keep Web/PWA fully capable while MCP degrades based on host capability.

## 11. Candidate MCP V1

Candidate MCP is in V1 because it strengthens the same category rather than creating a two-sided marketplace.

It should expose roughly 10–15 meaningful domain tools, not dozens of CRUD tools.

See `05-CANDIDATE-MCP-CONTRACT-V1.md`.

## 12. External-effect invariant

Always separate preparation from irreversible/external consequence.

- Generate ≠ Approve
- Draft ≠ Send
- Draft ≠ Publish
- Prepare ≠ Apply
- Shortlist ≠ Contact
- Assess ≠ Reject
- Approve ≠ Share

External-effect operations require their own policy class, authorization, audit, and receipt.

## 13. Tool annotations

MCP tool annotations may improve host UX/risk hints but are not server security contracts.

Server policy remains authoritative.

## 14. Token/credential boundary

Do not pass the MCP access token through as a downstream service credential.

```text
MCP token
  ↓
ScopeCareer MCP Gateway
  ↓ server authorization
separate internal/downstream credential
  ↓
Domain service / external integration
```

## 15. Audit

Material agent activity should record:

- principal;
- trust plane;
- delegation if any;
- purpose;
- tool/resource/task;
- object IDs;
- policy decision;
- model/client metadata where available/appropriate;
- approval/correction;
- external-effect receipt;
- timestamp/error/fallback.

## 16. Future policy packs

Logical packs can include:

- Candidate
- Delegated Coach
- Corporate Recruiter
- Executive Search Consultant
- Talent Sourcer
- Hiring Manager

They should map to the shared domain capabilities with different policy, not fork the platform.
