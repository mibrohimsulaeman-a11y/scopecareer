# ScopeCareer — Delivery DAG and Work Packages

Status: Multi-agent execution protocol (active for planning layer; binding from P4)
Last updated: 2026-08-23

## Model

Work is a directed acyclic graph of work packages, never a calendar:

```text
MASTER DAG
   ├── WP-A  explicit files/contracts owned
   ├── WP-B  explicit files/contracts owned
   └── WP-C  explicit files/contracts owned
```

Machine-readable authority: `implementation/work-packages.json` +
`implementation/dependency-graph.json`, validated by `implementation/validate_program.py`.
A phase's WPs become eligible only when their dependency gates are green.

## Agent brief schema

Every work package is executed by an agent (or human) holding a brief with:

```text
authority docs      — exact documents that govern the WP
scope               — outcome in one paragraph
allowed mutation    — paths/registries this WP may change
forbidden mutation  — everything else, explicitly listed
dependencies        — upstream WPs/gates required green
acceptance criteria — testable conditions
verification commands — commands whose real output proves done
expected receipt    — the artifact returned on completion
```

## Hard rules

1. **No two agents own the same authority surface concurrently** (`owns[]` must not
   overlap among active WPs).
2. No agent invents new semantics locally — semantics enter only through `contracts/v1`
   or registered implementation contracts.
3. No agent broad-refactors unrelated code inside a scoped WP.
4. No agent marks DONE without verification evidence (real command output attached to the
   receipt).
5. Agents run `AGENTS.md` verification before completion claims.
6. Conflicts resolve toward contracts and the decision register, never toward whichever
   change landed last.

## Integration agent checklist

After merging parallel WPs, the integration pass runs:

```text
merge → full semantic conformance → duplicate-semantics scan (--scan-clients)
→ dead-code scan → architecture boundary check → security review delta
→ full test suite → performance regression check (once baselines exist)
→ program validator → receipts archived
```

Any failure blocks further parallel dispatch until resolved.

## Work package lifecycle

```text
planned → eligible (deps green) → assigned (brief issued)
→ in_progress → review (integration checklist) → done (receipt archived)
```

Status transitions are recorded in `implementation/work-packages.json`.

## Repository policy

- Trunk-based development; short-lived branches per WP (`wp/p<n>-<nn>-slug`).
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `contracts:`).
- `main` protected once multi-actor execution starts; merges require the integration
  checklist output.

## Receipt format

```json
{
  "work_package": "WP-P5-01",
  "agent": "id",
  "verification": [{"command": "...", "exit_code": 0}],
  "files_mutated": ["..."],
  "invariants_reviewed": ["INV-01", "INV-10"],
  "dod": {"all_16": true, "notes": ""}
}
```

A receipt is evidence, not narrative: it contains commands and exit codes, not claims.
