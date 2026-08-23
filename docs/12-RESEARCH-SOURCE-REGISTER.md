# ScopeCareer — Research and Source Register

Status: Living register
Last updated: 2026-08-21

## 1. Source-use policy

Separate:

- **Product Decision** — chosen design direction;
- **External Fact** — current source-dependent fact;
- **Inference/Hypothesis** — reasoning that still needs validation;
- **Competitive Signal** — observed product capability, not proof of user need.

Current web facts should carry a verification date because product plans/protocols can change.

## 2. Internal KnowledgeHub design precedent

### Persona/capability/authority model

Source:

`Documents/KnowledgeHub/Ancol-Research/source/books/02-authority-safety.md`

Relevant principle:

`Persona + specialization + action + capability/resource + scope attributes + operational state + authority overlay → decision`

Used here to support:

- no persona-per-MCP-server architecture;
- policy resolution beyond simple RBAC;
- server-side authority separate from UI/tool visibility.

### AI tool/authority model

Source:

`Documents/KnowledgeHub/Ancol-Research/source/books/06-ai-intelligence.md`

Relevant principles:

- AI receives explicit typed tools, not unrestricted DB credentials;
- context assembly is purpose/scope/authority bounded;
- server-side tool authorization;
- policy broker/action broker;
- approval gates by risk;
- audit of material AI interactions.

Used as reusable architecture precedent, not as domain evidence for career/recruitment.

## 3. MCP protocol sources

### MCP 2026-07-28 release

URL: https://blog.modelcontextprotocol.io/posts/2026-07-28/
Verified: 2026-08-21

Supports:

- current revision `2026-07-28`;
- stateless core;
- no old handshake/session assumptions in the revision;
- header-based routing;
- cacheable list responses;
- formal extensions framework;
- Tasks extension;
- authorization hardening;
- deprecation policy.

### MCP 2026-07-28 release candidate background

URL: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
Verified: 2026-08-21

Useful for migration/history of Tasks and stateless design.

### MCP TypeScript SDK migration notes

URL: https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28
Verified: 2026-08-21

Useful when implementation language/SDK is selected; do not treat SDK migration notes as the primary normative spec.

## 4. ChatGPT MCP availability

### OpenAI Help — Developer mode and MCP apps

URL: https://help.openai.com/id-id/articles/12584461-mode-pengembang-dan-aplikasi-mcp-di-chatgpt-beta
Verified: 2026-08-21

Current fact used in architecture:

- full MCP including write/modify is in beta for Business and Enterprise/Edu;
- full MCP is not currently available to Pro; Pro can connect custom MCP with read/fetch permissions in developer mode;
- therefore Candidate MCP must be additive to Web/PWA for individual-executive ICP.

Also note: availability/UI/permissions are explicitly beta and can change.

## 5. Competitor/source backlog — verify before canonical competitive claims

The following categories informed the product discussion but should be documented with current primary sources before producing a formal competitor report:

- Teal: job matching, resume tailoring, tracker, browser extension;
- Huntr: resume tailoring, application packets, interview prep, tracker, contacts, extension/mobile;
- Jobright: matching, insider/referral signals, alerts, tracker, mobile;
- LinkedIn Recruiter/Hiring Assistant: natural-language search, qualification summaries, sourcing/outreach/application review;
- executive-search guidance: Spencer Stuart, Korn Ferry;
- confidential executive opportunity products: ExecThread;
- job-scam guidance: FTC;
- employment AI regulation: EU AI Act.

Do not freeze exact percentages or market-wide claims without source/date/context.

## 6. Research still required

### Executive-search workflow

Need current primary-source research on:

- retained vs contingent executive search workflow;
- candidate/search-consultant relationship lifecycle;
- confidential search mechanics;
- reference and offer stages;
- board/C-level selection patterns.

### Market-data / integration sources — initial feasibility research started

Machine-readable/working source matrix:

`../research/source-feasibility/source_matrix.json`

Human-readable synthesis:

`../research/source-feasibility/source_matrix.md`

Initial primary-source-verified candidates include:

- Greenhouse Job Board API, Lever Postings API, Ashby Public Job Posting API for published employer jobs;
- Adzuna API as technically feasible but commercially/licensing constrained beyond validation use;
- SEC EDGAR, Companies House, GLEIF, Singapore ACRA open data/API, and India OGD/MCA-derived company data for selected company identity/filing evidence;
- Google People and Microsoft Graph Contacts for consented relationship imports;
- Gmail/Google Calendar/Microsoft Graph Mail/Calendar as technically feasible but high-sensitivity integrations currently better treated as V1.1 candidates.

Important gaps remain:

- leadership changes and global funding/M&A signal provider;
- reliable executive-search-firm/consultant data without scraping dependency;
- exact ATS aggregation/cache/redistribution terms;
- India company dataset freshness verification;
- compensation source economics/licensing;
- source-specific snapshot/copyright retention policy.

For each source continue recording coverage, geography, license/ToS, API/feed availability, freshness, cost, redistribution rights, PII implications, and failure/degradation behavior.

### User research

Interview initial ICP on:

- current search process;
- executive-search consultant relationships;
- opportunity discovery channels;
- confidential role handling;
- relationship tracking;
- current resume/positioning workflow;
- mobile vs desktop behavior;
- AI-client usage;
- willingness to connect MCP;
- privacy concerns;
- highest-friction decisions.
