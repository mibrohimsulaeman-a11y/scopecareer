# ScopeCareer — Legal & Compliance Framework

**Status:** Desk research + draft control requirements — **not legal advice, not ratified**
**Created:** 2026-08-24
**Authority:** Subordinate to docs/21 (master program), docs/22 (engineering invariants), docs/11 (decision register). Semantic vocabulary is canonical in `contracts/v1/vocabulary.json`; this document reuses existing enums and introduces no new semantics.
**Counsel review required before:** first production user in any covered jurisdiction.

---

## Purpose and scope

This framework maps jurisdictional privacy/AI obligations to concrete control requirements for ScopeCareer's Candidate Plane. It is a desk-research artifact: every item is either (a) an already-existing invariant/control that this document links to, or (b) a new draft control requirement requiring qualified counsel sign-off and explicit decision-register entry before implementation. It does not ratify any legal position or select any vendor/stack.

### Covered jurisdictions

| Jurisdiction | Law | Status as of 2026-08-24 |
|---|---|---|
| EU/EEA | GDPR | In force |
| India | DPDP Act 2023 + DPDP Rules 2025 | Rules notified 13 Nov 2025; substantive obligations live ~12–14 May 2027; legacy IT Act §43A/SPDI Rules remain until then |
| Singapore | PDPA 2012 (as amended) | In force; amended by PDP(A)A 2020 |

---

## 1. Controller/fiduciary role classification

ScopeCareer is the controller under GDPR / data fiduciary under DPDP / data intermediary under PDPA for candidate Career Data Vault data. Recruiters/search firms receiving Share Packets are independent controllers/fiduciaries — not processors of ScopeCareer. This preserves D-014 (trust-plane split).

**Draft control LCR-01:** Maintain a written role register distinguishing:
- ScopeCareer as controller for all Vault data
- Third-party AI/LLM providers as processors (Art. 28 GDPR DPA required)
- Cloud/hosting subprocessors with their own DPAs
- Share Packet recipients as independent controllers (no processor contract; separate notice obligations)

**Owner:** WP-P4-01 (implementation contracts)
**Status:** Draft — counsel to confirm fiduciary-vs-processor determination for Share Packet recipients

---

## 2. Lawful basis per data category

The following matrices are draft positions pending counsel review. They reuse canonical sensitivity classes (`contracts/v1/vocabulary.json` enum `sensitivity`).

### 2a. GDPR lawful bases

| Data category (sensitivity class) | Recommended basis | Notes |
|---|---|---|
| Account/profile creation (career_internal) | Art. 6(1)(b) Contract | Service delivery |
| Compensation/intention-to-leave (highly_confidential) | Art. 6(1)(a) Consent | Explicit opt-in; withdrawal must be as easy as giving |
| Contact imports via Google/Microsoft (sensitive) | Art. 6(1)(a) Consent | Disclose imported field scope; third-party contact data raises transparency concerns |
| Browser-captured page content (sensitive) | Legitimate interest (Art. 6(1)(f)) + LIA | Untrusted-content boundary per D-025; minimize capture scope |
| Recruiter relationship records (career_internal) | Legitimate interest (professional contact management) | LIA documented |
| AI inference/recommendations (varies) | Legitimate interest + transparency | Right to object applies; advisory framing per D-004 avoids Art. 22 trigger |

**Special category (Art. 9):** AI extraction prompts must explicitly exclude health, religion, ethnicity, sexual orientation, trade union membership, biometric identifiers. This is an active design constraint on AI function definitions.

### 2b. India DPDP consent model

DPDP s6 requires free/specific/informed/unconditional/unambiguous affirmative consent with standalone plain-language notice (Rule 3 + First Schedule Pt A). The "purposes of employment" legitimate-use ground (s7) belongs to employer-side processing — do not build candidate-side posture on it.

**Draft control LCR-02:** Per-purpose consent ledger recording:
- Consent timestamp, version of notice presented, purpose(s), field-level sensitivity classes included
- Withdrawal mechanism at parity ease-of-use
- No dark patterns/coercive bundling
- Retention of consent records (≥ duration of processing + statutory limitation)

**Mapping to product:** Each Share Packet is itself a consent artifact — recipient, purpose, included claims, restrictions, expiry, revocation, audit trail map cleanly onto itemized consent + withdrawal.

### 2c. Singapore PDPA consent model

PDPA requires consent for collection/use/disclosure unless an exception applies. The Business Improvement Process exception (First Schedule Part 3) may cover internal career-intelligence features but should not be relied upon as sole basis without counsel confirmation.

**Draft control LCR-03:** For each processing activity, document which PDPA exception (if any) is relied upon alongside consent, with counsel sign-off.

---

## 3. Data subject rights mechanics

Rights are implemented through existing product surfaces (`/settings` export/correct/delete flows), mapped below.

| Right | GDPR | DPDP | PDPA | Product surface |
|---|---|---|---|---|
| Access | Art. 15 | s11 access summary | s21 access request | `/settings/export` (machine-readable) |
| Rectification | Art. 16 | s12(1)(b) correction | s22 correction obligation | `/settings/correct` |
| Erasure | Art. 17 | s12(1)(c) erasure | s25 cessation of retention | `/settings/delete` → INV-11 propagation |
| Portability | Art. 20 | N/A | N/A | Export format includes candidate-provided fields only |
| Objection (LI processing) | Art. 21 | N/A | N/A | Kill switch per data category for LI-based processing |
| Automated decisions | Art. 22 | N/A | N/A | Advisory-only outputs per D-004; human review available |
| Nomination | N/A | s14 nomination | N/A | Future surface if DPDP designation applies |
| Grievance redressal | Art. 82 remedies | Published SLA ≤90 days | PDPC complaint route | Published grievance process |

**Draft control LCR-04:** Erasure must propagate to derived projections (search indexes, caches, backups per policy) per INV-11. Versioned assessment snapshots (D-022 append-only design) require documented resolution:
- Option A: pseudonymize superseded snapshot content while retaining cryptographic hash for integrity proof
- Option B: retain hash-of-deleted-content only, removing content itself
- Resolution owned by WP-P5-01 (persistence design)

**Draft control LCR-05:** Rights request intake must have SLA tracking (GDPR: 30 days extendable by 60; DPDP: ≤90 days published SLA; PDPA: reasonable time). A single triage queue routes requests to the appropriate jurisdictional clock.

---

## 4. Retention skeleton (pending P5 persistence design)

This is a skeleton, not a final matrix. Concrete periods land at P5 (WP-P5-01) with counsel input.

| Data class | Sensitivity | Indicative retention | Trigger for erasure |
|---|---|---|---|
| Log/traffic data | career_internal | ≥1 year (DPDP Rule 6 floor) + operational need | Not user content; carve-out class |
| Audit logs | highly_confidential | Legal hold overrides erasure | Legal hold release |
| Offer details | highly_confidential | Candidate-controlled | User-initiated deletion with confirm prompt |
| Relationship/contact data | sensitive | Until relationship inactive or user request | User-initiated or inactivity |
| Browser-captured content | sensitive | Ephemeral observation input; promote-to-vault only on user action | Auto-expiry or promotion |
| Public-source intelligence | public | Longer than private data but still honor erasure for identified individuals | Erasure for identified individuals |

**Note:** DPDP mandatory 3-year-inactivity erasure applies specifically to large e-commerce/social-media/gaming classes — likely **not** ScopeCareer at launch. We still define our own matrix. DPDP Rule 8 requires ≥48h pre-erasure notice before inactivity-based auto-erasure.

---

## 5. Cross-border transfer posture

### 5a. GDPR Chapter V

EU→non-EU transfers require SCCs + Transfer Impact Assessment (TIA). Region-pinnable storage architecture recommended even if V1 uses a single region.

**Draft control LCR-06:** Transfer register listing each cross-border flow: source region → destination region, legal mechanism (SCCs/TIA/adequacy), subprocessor chain, TIA date/review cycle.

### 5b. India DPDP negative-list model

Transfer allowed except to countries restricted by Central Government notification (s16). No negative-list countries notified yet as of 2026-08-24. Government may separately restrict making data available to foreign states/entities (pending).

**Draft control LCR-07:** Quarterly monitoring of MeitY negative-list notifications. Architecture remains restriction-ready per doc 23.

### 5c. Singapore PDPA comparable-protection standard

Transfers outside Singapore permitted when recipient bound by legally enforceable obligations providing comparable protection (e.g., contractual clauses, certification schemes, law).

**Draft transfer clause template** to be developed with counsel.

### 5d. Combined posture

All three jurisdictions allow transfers with appropriate safeguards; none mandate blanket localisation at launch. Keep vendor/subprocessor register, region-pinnable storage, quarterly regulatory monitoring.

**Draft control LCR-08:** Vendor/subprocessor list maintained publicly (or disclosed to users) with role classification, data categories processed, regions, and DPA status.

---

## 6. Subprocessor governance

**Draft control LCR-09:** Before adding any subprocessor:
1. Classify role (processor vs independent controller)
2. Execute DPA where required (GDPR Art. 28 minimum terms)
3. Add to transfer register (LCR-06)
4. Assess security controls against docs/24 threat catalog
5. Document purpose and data categories shared
6. Notify affected users where required by jurisdictional law
7. Record approval trail per docs/24 mandatory feature pipeline

---

## 7. Source licensing/ToS compliance

Aligned to docs/12 §6 blockers:

| Source | Compliance requirement | Status |
|---|---|---|
| ATS aggregation ToS | Confirm commercial terms before aggregation | Blocker |
| Adzuna commercial terms | Confirm commercial license tier | Blocker |
| Board discovery without crawling | Position paper from counsel needed | Blocker |
| India freshness | Verify freshness commitments | Open |
| Search-firm data without scraping | Counsel position paper | Blocker |
| News copyright/snapshot retention | Copyright analysis + retention policy | Open |
| Google CASA / Microsoft restricted-scope verification | Complete security verification | Open |
| Third-party contact consent | See §8a | Blocker |

---

## 8. Consent flows

### 8a. Contact import consent (A-003)

When a candidate imports contacts via Google/Microsoft OAuth:
1. Pre-import disclosure: what fields will be imported, what they will be used for, who can see them
2. Post-import classification as `relationship_private` (sensitive); do not auto-enrich non-user profiles absent defensible basis
3. Third-party contacts are personal data of non-users; transparency to them is limited by practicality but erasure honored on request
4. Flag for counsel alongside A-003

### 8b. PV-1 recording consent

Existing kit already has recording-consent checkbox in `docs/validation/execution_checklist.md`.

**Draft control LCR-10:** Recording/transcription consent flow must present:
- What is recorded, transcription method, storage location, retention, who has access
- Stop-recording affordance at any point
- Recording indicator during session
- Deletion option post-session
- Jurisdiction-specific notice (see §9)

---

## 9. Recording/transcription consent across jurisdictions

| Regime | Requirement |
|---|---|
| US two-party consent states (CA, FL, IL, etc.) | All-party consent before recording |
| US one-party states | At least one participant consents |
| EU (GDPR Art. 5(1)(a)+6) | Transparency + lawful basis (typically consent); no covert recording |
| India DPDP | Notice + consent under s5–6; voice data is personal data |
| Singapore PDPA | Notification obligation (s20); obtain consent for collection/use/disclosure |
| UK GDPR | Similar to EU GDPR; ICO guidance on workplace recordings |

**Draft control LCA-01:** Voice debrief (A-007) cannot ship without:
1. Per-jurisdiction consent flow (LCR-10)
2. Transcription provider DPA (LCR-09 subprocessor process)
3. Transcription output classified `sensitive` (canonical class)
4. Retention policy defined (P5 matrix)
5. Counsel sign-off on jurisdiction-specific notices

---

## 10. AI transparency and EU AI Act

### AI transparency labels

Existing `epistemic_status` enum (`unknown`, `needs_research`, `inferred`, `known`) directly supports GDPR Art. 50 transparency ("informed when interacting with AI-generated content") and EU AI Act Art. 50.

**Draft control LCR-11:** Every AI-generated artifact carries its epistemic label visible to the user. Labels are semantic-contract-governed (INV-08) and never decided by UI code alone (INV-05).

### EU AI Act classification boundary

Annex III(4) covers employment/workers-management high-risk systems including recruitment/selection. ScopeCareer is candidate-side — it augments human decision-making by the candidate, not the employer. It does not make hiring/firing decisions. Key boundary questions:

- If future Talent track (WP-P17-01) uses AI for ranking/screening candidates → unambiguously Annex III(4) high-risk
- If recommendation outputs materially affect opportunity access → Art. 22 automated-decision risk
- GPAI model provenance documentation required for deployers using foundation models

**Timeline:** High-risk obligations apply from 2 Aug 2026. GPAI obligations began 2 Aug 2025. Prohibited practices already in force since Feb 2025.

**Draft control LCR-12:** If ever classified high-risk under Annex III(4):
- Conformity assessment
- Technical documentation
- Human oversight measures
- Risk management system per Art. 9
- Post-market monitoring plan

**Draft control LCR-13:** Model provenance register: model name/version/provider/date integrated, intended use, limitations, known risks. Required for deployer-side transparency regardless of classification.

---

## 11. Breach notification timelines

Dual/triple clocks must be managed from a single incident-response runbook.

| Jurisdiction | Clock | Trigger |
|---|---|---|
| GDPR Art. 33 | 72 hours to supervisory authority | Awareness of personal-data breach |
| India CERT-In | 6 hours to CERT-In | Cyber-incident reporting direction (2002/2022) |
| India DPDP Board | Without delay + detailed report within 72h | Personal-data breach |
| India data principals | Without delay | Affected individuals |
| PDPC Singapore | 3 calendar days after determining breach is notifiable | After assessment phase that breach meets notifiability criteria |

PDPC requires notification within 3 calendar days after determining the breach is notifiable. The assessment phase has no fixed statutory deadline but must be conducted expeditiously. Notifiability criteria: significant harm to affected individuals OR significant scale (≥500 individuals).

**Draft control LCR-14:** Incident-response runbook with parallel clocks from single triage intake. Each clock tracked independently. Runbook tested before first production user and annually thereafter.

---

## 11b. Significant Data Fiduciary watch items (India)

SDF designations pending notification. If designated: India-based DPO, annual DPIA + independent audit reported to Board, due diligence that algorithmic software doesn't risk data-principal rights, potential localisation of government-notified categories.

**Watch item:** Quarterly MeitY SDF list check. Algorithmic-risk documentation treated as standing artifact from P4 onward.

---

## 12. DPIA requirement

Systematic processing of sensitive personal data at scale triggers Art. 35 DPIA under GDPR. Initiate during WP-P2-01 (V1 recut), not deferred to WP-P12-01 (security hardening).

**Draft control LCR-15:** DPIA initiated at WP-P2-01, covering:
1. Systematic description of processing
2. Necessity and proportionality
3. Risks to rights and freedoms
4. Mitigating measures linked to existing invariants (INV-05..INV-11, T-01..T-10)
5. Consultation threshold assessment (prior consultation with supervisory authority if residual risk high)

---

## 13. Children's data (India DPDP s9)

Verifiable parental consent required for <18. No tracking/behavioral monitoring/targeted advertising directed at children.

**Recommendation (pending decision-register entry):** Adopt 18+ age declaration at signup; block minor accounts rather than building parental-consent stack for V1. Keep ad-tech/behavioral-profiling patterns out of any youth-adjacent surface.

### Startup exemption (India)

Power exists (s17(3)) but **no operative notification found** as of 2026-08-24. Assume full compliance posture. Even a future exemption would skip consent/security/breach-reporting/children provisions — nothing material changes our posture.

---

## 14. Mapping to existing invariants

| Invariant/Decision | Compliance alignment |
|---|---|
| INV-05 (UI never decides legality/truth) | Art. 22 no fully automated decisions; AI Act human oversight |
| INV-06 (AI no commit authority over canonical state) | Accountability principle; traceability |
| INV-08 (semantics only through contracts/v1) | Central governance of privacy semantics |
| INV-10 (security horizontal gate) | Art. 32 security of processing; DPDP s8(5) safeguards; PDPA protection obligation |
| INV-11 (privacy horizontal gate) | DPIA support; erasure propagation; retention |
| INV-17 (real verification, no green-by-mock) | Accountability evidence; audit trail integrity |
| D-004 (no pseudo-objective fit score as primary decision surface) | Reduces Art. 22 exposure; avoids high-risk classification trigger |
| D-014 (trust-plane split) | Data-minimization principle; prevents unauthorized cross-plane access |
| D-016 (external effects gated) | Art. 50 transparency; prevents unintended disclosures |
| D-022 (append/versioned snapshots) | Creates tension with Art. 17 erasure; resolution at P5 |
| D-025 (extension trust boundary) | Captured page content not auto-promoted to vault; supports minimization |

---

## 15. Open items feeding docs/11 §6

Each open question in docs/11 §6 now has a draft framework section here. None are resolved — all require qualified counsel sign-off and explicit decision-register entries.

| docs/11 §6 question | Section in doc 31 | Next action |
|---|---|---|
| GDPR roles/lawful basis/DPIA | §1, §2a, §12 | Initiate DPIA at WP-P2-01 |
| India privacy requirements | §2b, §4, §5b, §11, §11b, §13 | Engage Indian counsel for notice text, Share Packet recipient terms, extension-ingestion position paper |
| Cross-border processing and subprocessors | §5, §6, LCR-06..09 | Develop transfer clause templates with counsel |
| Retention periods | §4 | P5 persistence design with counsel input |
| Source licensing/terms | §7 | Resolve blockers per docs/12 §6 |
| Future employer-side AI high-risk obligations | §10 EU AI Act | Counsel opinion before Talent track |
| Consent for imported relationship/contact data | §8a | Counsel position paper on third-party contact handling |
| Recording/transcription consent | §8b, §9, LCR-10/LCA-01 | Counsel sign-off on jurisdiction-specific notices |

---

## 16. Counsel-review backlog

Items marked **[counsel]** require qualified counsel engagement before implementation.

1. [counsel] Master privacy notice text (all three jurisdictions)
2. [counsel] Share Packet recipient terms (fiduciary-vs-processor determination)
3. [counsel] Extension ingestion position paper (third-party data minimization)
4. [counsel] Transfer clause templates (SCCs, PDPA comparable-protection clauses)
5. [counsel] DPIA facilitation at WP-P2-01
6. [counsel] Age-declaration copy and enforcement approach
7. [counsel] Recording/transcription consent copy (per-jurisdiction)
8. [counsel] AI Act classification opinion (candidate-side positioning argument)

---

## Appendix: Primary sources consulted

Research was conducted via live web search on 2026-08-24 across three parallel lanes:

**India DPDP:**
- Official Rules text (Gazette): https://www.dpdpa.com/DPDP_Rules_2025_English_only.pdf
- MeitY Explanatory Note: https://www.meity.gov.in/writereaddata/files/Explanatory-Note-DPDP-Rules-2025.pdf
- CADP implementation tracker: https://cadp.in/resources/guides/dpdp-implementation-tracker/
- KPMG guidance: https://assets.kpmg.com/content/dam/kpmgsites/in/pdf/2025/11/dpdp-rules-2025-guidance-to-dpdp-act-implementation.pdf
- KS&K cross-border analysis: https://ksandk.com/data-protection-and-data-privacy/indias-new-cross-border-data-transfer-framework/
- Employment-basis analyses: AZB Partners, Cyril Amarchand Mangaldas

**Singapore PDPA:**
- PDPC advisory guidelines on key concepts
- PDPC breach notification guidance
- PDP(A)A 2020 amendments overview

**GDPR/EU AI Act:**
- Regulation (EU) 2016/679 (GDPR) consolidated text
- Regulation (EU) 2024/1689 (AI Act) timeline and Annex III
- EDPB guidelines on controller/processor roles, SCCs, DPIAs

*All citations verified 2026-08-24. This document is desk research only.*
