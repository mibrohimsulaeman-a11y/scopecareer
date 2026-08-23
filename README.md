# ScopeCareer — Open Specification for Personal Executive Career Intelligence Systems

An open, machine-readable blueprint for building **personal executive career intelligence
platforms**: how senior professionals (Director / VP / C-level) decide which opportunities
deserve attention, whether a role is a strong career move rather than merely a skills
match, how access routes beat reflexive applications, and how career evidence supports
positioning — with provenance, privacy, and trust handled as first-class concerns.

> **Status: specification + reference implementation, not a finished product.**
> The semantic contracts are frozen and internally validated. Product hypotheses have
> **not yet been validated with real users** (see [Product Validation](#product-validation)).
> Anyone building on this should treat it as a starting blueprint, not proven UX.

## What is here

| Directory | Contents |
|---|---|
| `contracts/v1/` | Frozen semantic contracts: 74 entities, 14 orthogonal state machines, 91 actions, 26 capabilities, 23 policies, AI-function registry with eval cases, Candidate MCP tools/schemas/resources, view models, journeys, conformance cases — plus `validate_contracts.py` |
| `docs/00..29` | Authoritative product & engineering documentation: concept, domain model, interaction grammar, trust/privacy governance, threat model, UX/state boundaries, test strategy, performance/SLO framework, delivery DAG, release/GA gates |
| `implementation/` | Machine-readable program layer: 31 work packages, 18 exit gates, dependency graph, quality gates, security controls, performance budgets, ADR log — plus `validate_program.py` |
| `web/` | Fixture-driven reference UI (behavioral reference, not a port target) with 121-check smoke suite |
| `docs/validation/` | Complete moderated research kit: screener, outreach copy, test protocol, session schema, evidence validator, synthesis template |

## Core ideas

```text
Capability → Object → State → Action → Policy → Evidence/Effect
Source → Observation → Assertion → Assessment → Recommendation
```

- **Orthogonal states, never one generic `Opportunity.status`:** candidate disposition,
  search state, selection state, and priority allocation are independent dimensions.
- **Epistemic honesty:** provenance and evidence status (`Known` requires sources) are
  never dropped or upgraded silently; assessments are versioned snapshots.
- **Fit ≠ pursuit:** no pseudo-objective 0–100 fit score as the primary decision surface.
- **UI is a projection:** business truth never lives in client code, prompts, or adapters;
  authorization and legality are decided server-side.
- **AI has no commit authority:** draft/prepare/assess are separated from external effects
  (apply/send/share); every external effect needs a recorded human approval.
- **Trust planes stay split:** candidate-side and recruiter/talent-side are separate products
  with separate trust boundaries.

## Run the validators

```bash
python3 contracts/v1/validate_contracts.py        # semantic contracts
python3 implementation/validate_program.py        # program layer
python3 implementation/validate_program.py --scan-clients   # duplication/UI-authority scan
python3 docs/validation/validate_sessions.py      # research evidence pipeline
```

## Try the reference prototype

```bash
python3 -m http.server 8765 --directory docs/validation/prototype-v3
# open http://127.0.0.1:8765/
```

The prototype tests category-defining interaction hypotheses against fictional fixtures
only. Researcher instrumentation is available at `?research=1`.

## Building on this

1. Start from `contracts/v1/` and treat it as canonical; derive your schemas, policies,
   clients, and prompts from it rather than redefining semantics locally.
2. Read `docs/21-IMPLEMENTATION-MASTER-PROGRAM.md` for the phase/gate model and
   `docs/22-ENGINEERING-INVARIANTS-AND-QUALITY-GATES.md` for the engineering constitution.
3. Validate with real users before investing in production architecture — the repository's
   own rule is that stack/vendor decisions come after human product validation, not before.
4. Semantic changes belong in `contracts/v1/` via its freeze rules; implementations adapt.

## Product validation

The included research kit defines 8 hypotheses (PV-H01..PV-H08) tested through moderated
sessions with executive ICP participants. As of this release, **zero sessions have been
conducted**. A green validator or smoke test proves internal integrity, not product-market
evidence. See `docs/validation/README.md`.

## License

[Apache-2.0](LICENSE). You may build commercial or open platforms on top of these
contracts and documents; attribution and license retention are required.
