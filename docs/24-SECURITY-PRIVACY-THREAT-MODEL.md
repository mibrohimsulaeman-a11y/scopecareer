# ScopeCareer — Security, Privacy, and Threat Model

Status: Living security lane document; threat catalog seeded
Last updated: 2026-08-23

## Why this is a lane, not an appendix

ScopeCareer holds extremely sensitive personal data: intention to leave, compensation,
confidential opportunities, recruiter relationships, offers, private career strategy, and
career evidence. A privacy or trust failure is existential for the category. Security and
privacy are therefore horizontal gates (INV-10, INV-11) applied to every work package.

## Data classification

Classification vocabulary comes from `contracts/v1/vocabulary.json` (sensitivity classes).
Every new field/flow declares its class in the DoD. Minimum classes:

- `public` — non-personal reference data.
- `candidate_private` — everything in the Career Data Vault (default for candidate data).
- `candidate_sensitive` — compensation, intention-to-leave, offer terms, strategy notes.
- `confidential_opportunity` — recruiter-mandate / no-public-JD material.
- `relationship_private` — contact/relationship facts.

Trust planes remain split (D-014): Candidate data is never recruiter-searchable by virtue
of shared infrastructure.

## Secure development lifecycle alignment

- Baseline: **NIST SSDF v1.1** (NIST SP 800-218, final, Feb 2022) — the current final
  standard.
- AI-specific practices: **NIST SP 800-218A** (SSDF Community Profile for Generative AI
  and Dual-Use Foundation Models, final, Jul 2024).
- **NIST SSDF v1.2** (SP 800-218r1) is an **initial public draft (Dec 2025)** — tracked,
  not claimed as final. The program re-evaluates at each gate until final.
- Accessibility target: WCAG 2.2 AA (W3C Recommendation).

Control mapping lives in `implementation/security-controls.json`.

## Mandatory feature security pipeline

Every feature passes:

```text
Data classification → Threat analysis → Authorization model
→ Abuse cases → Logging/audit plan → Retention/deletion → Security tests
```

## AI / MCP request pipeline (mandatory shape)

No AI path may bypass these stages:

```text
User → AuthN → Principal + purpose → Policy decision
→ Tool/action selection → Domain validation → Effect gate
→ Execution → Receipt + audit
```

Forbidden outright: `LLM → database`, `LLM → email`, `LLM → apply`, or any external
effect without recorded human approval (INV-04, INV-06, D-016).

## Threat catalog (seeded; extended per service at P3/P5)

| ID | Threat | Primary mitigations |
|---|---|---|
| T-01 | Prompt injection via captured webpage/emails (untrusted content) | Ingestion gateway marks provenance untrusted; AI functions never treat captured content as instructions; adversarial eval suite |
| T-02 | Research hallucination entering canonical state | AI has no commit authority; assertions require source + observation; inference can never become `Known` |
| T-03 | Privacy failure / data exfiltration | Deny-by-default policy engine; purpose-scoped access; sensitivity classes; audit on every read of sensitive classes |
| T-04 | Two-sided contamination (candidate ↔ recruiter) | Hard trust-plane separation; no shared search index across planes (R-006, D-014) |
| T-05 | Opportunity Trust overclaim | Epistemic labels mandatory in view models; confidence never rendered as pseudo-precise scores (R-008) |
| T-06 | Unauthorized external effect (apply/send/publish) | Effect gates + recorded approval receipts (D-016, INV-04) |
| T-07 | Compromise of extension client | Extension is untrusted ingestion client only (D-025); content sanitized; no authority production |
| T-08 | Insider/agent misuse of admin surfaces | Least privilege, audit trail on admin actions, no shared credentials |
| T-09 | Confidential opportunity leakage | Confidential class handling; access logging; minimization in projections |
| T-10 | Supply chain compromise | Dependency pinning, SBOM, provenance attestation (from P5) |

## Abuse cases (minimum set)

- Ex-employer or recruiter attempting to infer a candidate's job search from any shared
  surface.
- AI user tricking a research function into mutating state or sending external effects.
- Malicious opportunity source crafting content to poison dossiers.
- Curious operator browsing sensitive candidate data (must be impossible without purpose +
  audit).

## Privacy register (open items carried, not resolved here)

GDPR roles/lawful basis and data-subject request mechanics; India privacy requirements;
cross-border processing and subprocessors; retention periods per class; source licensing
and ToS for job/company/people data; consent for imported relationship/contact data;
recording/transcription consent across jurisdictions. These remain open in
`11 §6` until resolved by explicit decisions.

## Retention & deletion

The Vault owns retention/deletion per sensitivity class; deletion must propagate to
derived projections (search indexes, caches, backups per policy). Concrete matrix lands at
P5 with the persistence design; the invariant (INV-11) applies from the first production
field.
