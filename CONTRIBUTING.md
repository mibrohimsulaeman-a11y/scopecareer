# Contributing

This repository is an **open specification**: frozen semantic contracts, a governed
program layer, and a fixture-driven reference UI. Contributions are welcome within the
governance rules below — they exist so that everyone can build on the same semantics
without drift.

## Ground rules

1. **Semantics live only in `contracts/v1/`.** Never redefine capabilities, objects,
   states, actions, policies, or enums in client code, docs prose, prompts, or adapters —
   derive them (`INV-08`). Prose may explain contracts; it must not silently redefine them.
2. **Semantic changes go through the freeze rules** (`contracts/v1/README.md`) and the
   decision-change policy (`docs/11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md §7`):
   record the reason/evidence first, then update register → contracts → downstream docs.
3. **No fabricated verification.** Claims of passing checks require real command output
   (`INV-17`). "Works in browser" is roughly 20% of done.
4. **UI stays a projection.** No legality, authorization, or epistemic truth decided in
   client code (`INV-05`).
5. **AI has no self-granted commit authority** over canonical state or external effects;
   draft/prepare/assess never imply send/share/apply (`INV-04`, `INV-06`).

## Before opening a pull request

Run all validators and include their real output:

```bash
python3 contracts/v1/validate_contracts.py
python3 implementation/validate_program.py
python3 implementation/validate_program.py --scan-clients
python3 docs/validation/validate_sessions.py
```

For reference-UI changes also run the browser smoke suite (`web/tests/run_smoke.py`,
needs Chrome).

## Good first contributions

- conformance cases in `contracts/v1/conformance/`;
- eval cases in `contracts/v1/ai-functions/eval_cases.json`;
- documentation clarifications that cite existing contracts;
- test coverage for the reference UI smoke suite.

## Building your own platform

You do not need to contribute here to build on this work — fork/adopt `contracts/v1/`
directly under the Apache-2.0 license. See the repository README for the recommended
starting path and read `AGENTS.md` for the authority chain used inside this repository.
