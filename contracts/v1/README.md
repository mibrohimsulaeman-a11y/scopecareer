# ScopeCareer Contract Layer v1

Status: semantic freeze / validation-prototype-ready contract draft
Last updated: 2026-08-21

## Purpose

This directory is the machine-readable authority for ScopeCareer semantics. It binds the same domain language across Web, PWA, browser extension, MCP, and AI.

Canonical chain:

`Capability → Object → State Machine → Action → Policy → Evidence/Audit/External Effect`

Epistemic chain:

`Source → Observation → Assertion → Assessment → Recommendation`

## Authority

Until superseded by a later version:

1. Explicit decisions in `../../docs/11-DECISIONS-ASSUMPTIONS-OPEN-QUESTIONS.md`.
2. Machine-readable semantic contracts in this directory.
3. Machine-readable policy contracts in this directory.
4. MCP / UX / AI contracts derived from those semantics.
5. Prose explanation in `docs/`.

A prose document may explain a contract but must not silently redefine it.

## Registries

- `vocabulary.json` — canonical IDs, enum vocabularies, effect classes, confidence, sensitivity, trust planes.
- `entities/entity_registry.json` — durable semantic objects and their invariants.
- `states/state_registry.json` — orthogonal state dimensions and legal transitions.
- `actions/action_registry.json` — canonical mutations/reads and their effect classes.
- `capabilities/capability_registry.json` — capability ownership/read/write/action bindings.
- `policies/policy_registry.json` — authorization vocabulary, trust boundaries, external-effect rules.
- `clients/client_registry.json` — first-party/MCP/extension client trust semantics.
- `ai-functions/ai_function_registry.json` — bounded AI functions and commit authority.
- `ai-functions/eval_cases.json` — function-specific evaluation cases and hard-failure semantics.
- `mcp/candidate_tools.json` — Candidate MCP tools bound to canonical actions and schema references.
- `mcp/candidate_schema_registry.json` — exact Candidate MCP input/output JSON Schemas.
- `mcp/candidate_resources.json` — bounded resource URI projections, sensitivity, policy and cache scopes.
- `views/view_model_registry.json` — canonical UX projections/actions shared across supported clients.
- `journeys/journey_registry.json` — category-defining journeys bound to canonical semantics.
- `conformance/cases.json` — executable/automatable semantic cases.
- `validate_contracts.py` — cross-registry + JSON Schema integrity validator.

## Freeze rules

- No single generic `Opportunity.status` enum is allowed.
- Candidate disposition, search state, selection state, and priority allocation are orthogonal.
- Priority is private candidate attention allocation, not employer-visible state and not search/selection stage.
- `Known` is not an AI confidence label. It requires evidence/source support under assertion policy.
- AI may propose observations/assertions/assessments/recommendations but does not self-authorize canonical mutations.
- Assessments are versioned snapshots and are never silently overwritten.
- Relationship evidence/facts are separate from contextual relationship/access assessments.
- Browser extension is an untrusted-content ingestion client and never an authority producer.
- Draft/prepare/assess are distinct from external effects such as share/send/publish/apply.
