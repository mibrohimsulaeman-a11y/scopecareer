# ScopeCareer — Initial Source Feasibility Matrix

Verified: 2026-08-21  
Status: Architecture-independent desk research; not a final vendor/source decision

| Source | Use | Current assessment | V1 posture |
|---|---|---|---|
| Greenhouse Job Board API | Published jobs | Public GET job-board API; strong direct-employer source; board token/ToS/aggregation review remains | Candidate V1 |
| Lever Postings API | Published jobs | Public published postings by site; no full-text search; browser CORS limitations | Candidate V1 |
| Ashby Public Job Posting API | Published jobs | Public job-board endpoint, optional published compensation; strong direct source | Candidate V1 |
| Adzuna API | Aggregated discovery | Search API with app credentials; country coverage and commercial/display terms need review | Optional V1 |
| LinkedIn Talent APIs | Job posting/ATS distribution | Partner-oriented posting lifecycle, not open candidate-side discovery | Not core |
| SEC EDGAR | US public-company filings/signals | Public JSON APIs, real-time during day, no key; narrow geography/company type | Optional V1 signal source |
| UK Companies House | UK company identity/status | Official live API with credentials | Optional by geography |
| GLEIF | Legal entity/ownership | Global LEI identity/ownership where covered; public data/API | Optional corroboration |
| Singapore ACRA open data | Singapore entity identity | Monthly open datasets; open-data licence; strong fit for Singapore wedge | Candidate V1 |
| ACRA Business Profile API | Richer Singapore profiles | Real-time/richer subscription API through Marketplace | Evaluate after V1 recut |
| India OGD Company Master Data | India entity identity | Official MCA-derived dataset/API, but freshness must be proven against actual records | Research required |
| Google People API | Contacts/relationships | Delegated contacts import is technically clean; highly sensitive personal data | Optional V1 |
| Microsoft Graph Contacts | Contacts/relationships | Delegated Contacts.Read path exists | Optional V1, likely after first contacts connector |
| Gmail API | Communication timeline | Technically feasible but very high-sensitivity | V1.1 unless validation elevates |
| Google Calendar API | Selection/recruiter timeline | Technically feasible; high sensitivity | V1.1 unless validation elevates |
| Microsoft Graph Mail/Calendar | Communication timeline | Technically feasible equivalent path | V1.1 unless validation elevates |
| Executive-search firm / consultant public context | Search-firm/access context | Public firm/consultant pages and candidate registration flows exist, but no general public bulk API is assumed | Manual first / legal review |
| Manual confidential capture | Non-public executive role | Essential and architecture-independent | Candidate V1 |
| Browser capture | User-selected public/source page | Essential capture channel; source-specific rights + untrusted content boundary | Candidate V1 |

## What this means for V1 discovery

A credible first source strategy does **not** require solving the whole job-web ecosystem.

The minimum coherent mix is:

```text
Manual/confidential capture
+
Browser capture
+
Direct ATS public boards
(Greenhouse / Lever / Ashby where detected)
+
Optional licensed aggregator for recall
```

This preserves the executive thesis because confidential/recruiter-led opportunities remain first-class instead of forcing everything through a public job aggregator.

## Company context

No single source covers the required global executive context.

Use official sources as evidence components:

```text
Company identity / registry
        +
Regulatory/filing signals
        +
Company-published evidence
        +
Future licensed market/news provider
```

Do not treat registry presence as company quality, opportunity quality, or growth signal.

## Relationship imports

Recommended feasibility sequence:

```text
Manual relationships
→ Google Contacts read import
→ validate value/privacy
→ Microsoft Contacts equivalent
```

Contacts create `Person`/relationship evidence candidates; they do not create a canonical relationship-strength score.

## Communication integrations

Email/calendar integration is technically feasible but should remain behind Product Validation evidence because it expands the privacy and permission surface substantially. It is not required to prove Daily Shortlist, Pursuit, Access Plan, or Evidence Binding.

## Primary-source evidence URLs

- Greenhouse Job Board API: https://developer.greenhouse.io/job-board.html
- Greenhouse API overview: https://support.greenhouse.io/hc/en-us/articles/10568627186203-Greenhouse-API-overview
- Lever Postings API: https://github.com/lever/postings-api/blob/master/README.md
- Ashby Public Job Posting API: https://developers.ashbyhq.com/docs/public-job-posting-api
- Adzuna Search API: https://developer.adzuna.com/docs/search
- LinkedIn Job Posting API: https://learn.microsoft.com/en-us/linkedin/talent/job-postings/api/sync-job-postings?view=li-lts-2026-03
- SEC EDGAR APIs: https://www.sec.gov/search-filings/edgar-application-programming-interfaces
- Companies House: https://developer.company-information.service.gov.uk/get-started
- GLEIF API: https://www.gleif.org/en/lei-data/gleif-api-public-beta
- Singapore ACRA Open Data: https://www.acra.gov.sg/resources/open-data-initiative/
- Singapore ACRA API Marketplace: https://www.acra.gov.sg/resources/eservice-tools-portals/api-marketplace/
- India Company Master Data: https://data.gov.in/catalog/company-master-data
- Google People API: https://developers.google.com/people/api/rest/v1/people.connections/list
- Gmail API: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list
- Google Calendar Events: https://developers.google.com/workspace/calendar/api/v3/reference/events/list
- Microsoft Graph Contacts: https://learn.microsoft.com/en-us/graph/api/user-list-contacts?view=graph-rest-1.0
- Microsoft Graph Messages: https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0
- Microsoft Graph Calendar: https://learn.microsoft.com/en-us/graph/api/calendar-list-events?view=graph-rest-1.0
- Spencer Stuart Connect: https://www.spencerstuart.com/connect
- Russell Reynolds Careers with Clients: https://www.russellreynolds.com/en/careers/careers-with-our-clients
- Russell Reynolds candidate profile: https://www.russellreynolds.com/ja-jp/contact-us/share-your-resume
- Korn Ferry consultant example: https://www.kornferry.com/about-us/consultants/deslaynitjia

## Remaining research blockers

Before source recut, still resolve:

1. exact Greenhouse/Lever/Ashby terms for aggregation, caching, retention, and redistribution;
2. Adzuna commercial/display/caching terms and target-country coverage;
3. reliable board/company discovery for direct ATS sources without prohibited crawling;
4. India company-data freshness using actual sampled entities;
5. executive-search-firm/public-consultant data source strategy without scraping dependency;
6. global leadership-change/funding/M&A provider shortlist and economics;
7. company-news/public-web copyright and snapshot-retention policy;
8. Google/Microsoft restricted-data/privacy verification requirements if email/contact scopes enter V1;
9. consent/legal basis for importing third-party contact details into Career Data Vault.
