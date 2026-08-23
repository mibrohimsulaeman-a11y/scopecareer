# ScopeCareer — Release Operations and GA Gates

Status: Release architecture standard (binding from P5)
Last updated: 2026-08-23

## Environment ladder

```text
Local → CI → Ephemeral/Test → Integration → Staging
     → Production candidate → Canary / controlled rollout → GA
```

Every promotion has a named gate in `implementation/release-gates.json`. No environment is
skipped; emergency hotfixes follow the same ladder at accelerated cadence, never around it.

## Mandatory release artifacts and disciplines

| Discipline | Requirement |
|---|---|
| Infrastructure as Code | All environments reproducible from code; no console-only changes |
| Immutable artifacts | Build once, promote the same artifact through every stage |
| SBOM + provenance | Software bill of materials and build provenance attached (from P5) |
| Secret management | No secrets in repo/config/images; managed secret store with rotation |
| Migration discipline | Every schema/data change versioned, tested up+down, backward-compatible within a release window |
| Backups | Automated, monitored; restore drills on defined cadence |
| Rollback | **Tested rollback path per release — release without tested rollback is not releasable** |
| Feature flags | Governed per doc 22 metadata rule; flags are not permanent architecture |
| Audit | Material operations auditable end-to-end (INV-15) |
| Observability | Distributed tracing, metrics, structured logging wired before first production user |
| Alerting | Actionable alerts tied to SLOs, not noise |
| SLO / error budget | Defined at P14 readiness; budgets gate release pace (doc 27) |
| Incident response | On-call, severity ladder, postmortem discipline from Private Beta |

## Gate definitions

- **GATE-P12 → Release candidate:** all verification classes of doc 26 green on the
  candidate artifact; security review complete; performance ratchets holding.
- **GATE-P13 → Beta acceptance:** real ICP users on production telemetry for a defined
  period; incident process exercised; support loop working.
- **GATE-P14 → Production GA:** legal/compliance items closed or accepted with register
  entries (GDPR, India privacy, retention, subprocessors); SLOs published; backup/restore
  drill passed; incident response staffed; rollout plan (canary stages + abort criteria)
  approved.

## Rollout mechanics

- Canary with explicit abort criteria (error rate, SLO burn, cost anomaly).
- Progressive exposure via governed feature flags, never via untested forks.
- Post-release production smoke is part of the release itself, not an afterthought.

## Continuous operation

P15 makes validation continuous: production metrics, session evidence, and support signal
feed back into the decision register; deferred capabilities re-enter as P16 releases under
the same gates.
