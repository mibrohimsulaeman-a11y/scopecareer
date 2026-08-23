# ScopeCareer Pull Request

## Summary

<!-- What changes and why, in 2–3 sentences. -->

## Semantic impact

- [ ] No semantics introduced outside `contracts/v1/`; implementations/views derive from canonical registries (INV-08).
- [ ] If contracts changed: decision-register entry exists (`docs/11 §7`) **before** this PR, and downstream registries/docs updated together.
- [ ] UI remains a projection; no legality/authorization/epistemic truth decided client-side (INV-05).
- [ ] AI functions keep zero commit authority; draft/prepare/assess stay separate from external effects (INV-04, INV-06).

## Verification (real output only — no fabricated results)

Paste the actual tail output of:

```bash
python3 contracts/v1/validate_contracts.py
python3 implementation/validate_program.py --scan-clients
python3 docs/validation/validate_sessions.py
```

Browser suites (`web/tests/run_smoke.py`, `docs/validation/browser_harness_v3.py`) run
automatically in CI for every push.
