# ScopeCareer — Performance, Reliability, and SLO Framework

Status: Budget categories + ratchet policy defined; baselines deferred to P3
Last updated: 2026-08-23

## Principle

Performance is not the last optimization pass. Categories and measurement definitions
exist now; numeric baselines are **not invented** — they are measured once architecture
candidates exist (P3) and then ratcheted.

## Performance budget matrix

| Surface | What is measured |
|---|---|
| Web/PWA | Core Web Vitals (LCP, INP, CLS), initial bundle size, interaction latency |
| API | p50 / p95 / p99 per endpoint class (read, mutation, projection) |
| Database | Query count per request, slow-query threshold violations |
| Search | Query latency, index freshness lag |
| AI | Time-to-first-token, complete-response latency per function class |
| Research | End-to-end task latency for bounded research operations |
| Queue | Scheduling delay, job start delay |
| MCP | Tool-call latency, output size ceilings |
| Extension | Capture overhead added to host pages |
| Background jobs | Throughput, backlog age |
| Cost | Cost per user, cost per intelligence operation |

Machine-readable: `implementation/performance-budgets.json` (`baseline: null` until P3;
validator rejects premature numbers).

## Ratchet policy

Once a baseline is measured and recorded at GATE-P3:

> A change may not make any measured critical path materially worse without an explicit,
> registered performance exception.

"Materially" thresholds are set with each baseline. Exceptions carry owner, reason, and an
expiry/review date like feature flags.

## Reliability framework (skeleton until P5)

- Failure-mode inventory per service: what degrades, how it announces itself.
- Degradation ladder: full → read-only/degraded banner → cached/offline → unavailable,
  mirroring the reference UI's degraded/empty/stale state coverage.
- Backup + restore: cadence defined at P5; **restore drills are mandatory** — a backup
  that has never been restored is not a backup.
- DR targets (RTO/RPO) chosen with persistence decisions at P4/P5.

## SLO / error budget skeleton

- Candidate SLO classes (finalized at P14 readiness): availability, mutation success,
  projection freshness, research-task completion, AI function success-within-budget.
- Error budgets gate release pace once production telemetry exists (P13+).
- SLOs are product statements ("briefing loads with fresh data"), not just uptime.

## Cost discipline

Cost per user and per intelligence operation are first-class budget rows because the
product is AI-heavy by design. Model routing and cost controls are open architecture
questions (`11 §5`) resolved at P3/P11 with measured data.
