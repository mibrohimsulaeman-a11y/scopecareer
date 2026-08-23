# AGENTS.md — ScopeCareer Agent Entry Point

Every coding agent (and human contributor) working in this repository starts here.

## Authority chain (binding order)

1. Decisions: `docs/11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md` (change only via its policy)
2. Semantic/policy contracts: `contracts/v1/` — frozen semantics; never redefine locally
3. Implementation program registries: `implementation/` — DAG, gates, ADRs
   (`python3 implementation/validate_program.py` must stay green)
4. Execution protocol: `docs/28-DELIVERY-DAG-AND-WORK-PACKAGES.md`
5. Engineering constitution: `docs/22-ENGINEERING-INVARIANTS-AND-QUALITY-GATES.md`
   (INV-01..INV-17 + uniform 16-item Definition of Done)

## Hard rules

- No new semantics in client/UI/adapter code — semantics enter only through `contracts/v1`
  or registered implementation contracts (INV-08; `--scan-clients` enforces).
- The UI never decides legality, authorization, or epistemic truth (INV-05, doc 25).
- AI has no commit authority over canonical state or external effects (INV-06, doc 24).
- No production stack/vendor choices — deferred to GATE-P3 per ADR-0001.
- No two agents own the same `owns[]` surface concurrently (doc 28).
- DONE requires real verification output attached to the receipt — no green-by-mock (INV-17).
- Feature flags and scan-allowlist entries need full metadata (owner, created_at, purpose,
  removal_condition, review_date) or validation fails.

## Verification commands (run before claiming done)

```bash
python3 contracts/v1/validate_contracts.py        # semantic contracts: must print VALID
python3 implementation/validate_program.py        # program layer: must print VALID
python3 implementation/validate_program.py --scan-clients   # INV-05/08 scan: clean
python3 docs/validation/validate_sessions.py      # PV-1 records + pipeline: VALID
python3 web/tests/run_smoke.py                    # reference UI: PASS 121/121 (needs Chrome)
```

## Current program state

- Phase P0 (repository baseline + planning layer): done — see `docs/21-IMPLEMENTATION-MASTER-PROGRAM.md`.
- Next gate: GATE-P1 — Product Validation-1, 6–8 moderated ICP sessions
  (kit: `docs/validation/`; tracker: `docs/validation/participant_pipeline.json`).
- Work packages: `implementation/work-packages.json`; dependency order is authoritative,
  never a calendar.

## Repository layout

```text
contracts/v1/        canonical semantic registries + validator
implementation/      program DAG/gates/ADRs/budgets + program validator
docs/                product + engineering authority (00 index, 01-29)
docs/validation/     PV-1 prototype, protocols, session evidence, ops kit
docs/research/       source/integration feasibility desk research
web/                 fixture-driven reference UI (behavioral reference, not a port target)
```
