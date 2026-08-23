# Changelog

All notable changes to the ScopeCareer open specification.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning: specification releases tagged `vX.Y.Z`.

## [0.1.0] — 2026-08-24

First public, citable release of the open specification.

### Added

- `contracts/v1/` — frozen semantic contracts: entities, orthogonal state machines,
  actions, capabilities, policies, clients, AI functions with eval cases, Candidate MCP
  tools/schemas/resources, view models, journeys, conformance cases, validators.
- `docs/00–29` — authoritative product & engineering documentation (concept, domain
  model, interaction grammar, trust/privacy governance, threat model, UX/state
  boundaries, test strategy, performance/SLO framework, delivery DAG with exit gates
  P0–P17, release/GA gates).
- `implementation/` — machine-readable program layer: work packages, dependency graph,
  quality/release gates, security controls, performance budgets, ADR log, program
  validator with client scan.
- `web/` — fixture-driven reference UI with behavioral smoke suite.
- `docs/validation/` — complete moderated research kit for executive ICP validation:
  screener, outreach copy, test protocol, session schema and validator, synthesis
  template with pre-registered decision rules.
- Open-source publication infrastructure: Apache-2.0 LICENSE, public README,
  CONTRIBUTING guide, Code of Conduct, issue templates including inbound PV-1
  participant signup, CI (validators + browser suites), GitHub Pages landing page with
  live prototype.

### Known limitations

- Zero moderated validation sessions conducted; product hypotheses are unvalidated.
- Prototype is a disposable research artifact; it is not production code.
- Performance baselines deliberately unset until architecture decision gate (P3).
