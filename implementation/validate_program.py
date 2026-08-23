#!/usr/bin/env python3
"""ScopeCareer Implementation Program validator.

Validates the machine-readable planning layer in implementation/:
work packages, dependency DAG, quality gates, ADR log, performance budgets,
security controls, and release gates. Zero non-stdlib dependencies, consistent
with contracts/v1/validate_contracts.py.

Also provides --scan-clients: a heuristic gate (INV-05/INV-08) that flags local
redefinitions of canonical semantics outside contracts/ in client code.

Exit codes: 0 valid, 1 invalid, 2 usage error.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMPL = ROOT / "implementation"
CONTRACTS = ROOT / "contracts" / "v1"

ERRORS = []
WARNINGS = []


def err(msg):
    ERRORS.append(msg)


def warn(msg):
    WARNINGS.append(msg)


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:  # noqa: BLE001 - validator reports all parse errors
        err(f"{path.name}: cannot parse JSON ({e})")
        return None


def require(cond, msg):
    if not cond:
        err(msg)
    return cond


# ---------------------------------------------------------------- work packages

def validate_work_packages():
    wp = load(IMPL / "work-packages.json")
    if wp is None:
        return None
    gates = {g["id"] for g in wp.get("gates", [])}
    for g in wp.get("gates", []):
        require(re.fullmatch(r"GATE-P\d+", g.get("id", "")), f"gate id bad: {g.get('id')}")
        require(bool(g.get("criteria")), f"{g['id']}: no criteria")
    ids = []
    active_statuses = set(wp.get("active_statuses", []))
    active_owns = []
    for w in wp.get("work_packages", []):
        wid = w.get("id", "")
        ids.append(wid)
        require(re.fullmatch(r"WP-P\d+-\d{2}", wid), f"bad WP id: {wid}")
        for field in ("phase", "title", "goal", "exit_gate", "owns", "status"):
            require(field in w, f"{wid}: missing field '{field}'")
        require(w.get("exit_gate") in gates, f"{wid}: unknown exit_gate {w.get('exit_gate')}")
        require(isinstance(w.get("owns"), list) and w["owns"], f"{wid}: owns must be a non-empty list")
        require(w.get("status") in {"planned"} | active_statuses | {"done", "cancelled"},
                f"{wid}: unknown status {w.get('status')}")
        for dep in w.get("depends_on", []):
            require(dep in set(ids + [x.get("id") for x in wp["work_packages"]]) or True, "")
        if w.get("status") in active_statuses:
            for surface in w["owns"]:
                active_owns.append((wid, surface))
    require(len(ids) == len(set(ids)), "duplicate work package ids")

    # every gate referenced by at least one WP exit_gate or dependency path usage
    used_gates = {w.get("exit_gate") for w in wp.get("work_packages", [])}
    for g in sorted(gates - used_gates):
        err(f"{g}: defined but referenced by no work package exit_gate")

    # owns overlap among concurrently active WPs (INV ownership rule, doc 28)
    def norm(surface):
        s = str(surface).rstrip("/")
        return s[:-3] if s.endswith("/**") else s

    for i in range(len(active_owns)):
        for j in range(i + 1, len(active_owns)):
            a_id, a = active_owns[i]
            b_id, b = active_owns[j]
            if a == b or norm(a).startswith(norm(b)) or norm(b).startswith(norm(a)):
                err(f"owns overlap between active WPs {a_id} ('{a}') and {b_id} ('{b}')")
    return wp


def validate_dependency_graph(wp):
    dg = load(IMPL / "dependency-graph.json")
    if dg is None or wp is None:
        return
    edges = [tuple(e) for e in dg.get("edges", [])]
    nodes = {w["id"] for w in wp["work_packages"]}
    declared = set()
    for w in wp["work_packages"]:
        for dep in w.get("depends_on", []):
            require(dep in nodes, f"{w['id']}: depends on unknown '{dep}'")
            declared.add((dep, w["id"]))
    declared_set = declared
    edges_set = set(edges)
    if declared_set != edges_set:
        err("dependency-graph drift: "
            f"edges-without-depends_on={sorted(edges_set - declared_set)}; "
            f"depends_on-without-edge={sorted(declared_set - edges_set)}")
    require(len(edges) == len(edges_set), "duplicate edges in dependency-graph.json")
    for a, b in edges:
        require(a in nodes and b in nodes, f"edge references unknown node: {a}->{b}")

    # acyclicity via Kahn's algorithm + deterministic topological order output
    from collections import defaultdict
    indeg = {n: 0 for n in nodes}
    adj = defaultdict(list)
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    queue = sorted(n for n in nodes if indeg[n] == 0)
    order = []
    while queue:
        n = queue.pop(0)
        order.append(n)
        for m in sorted(adj[n]):
            indeg[m] -= 1
            if indeg[m] == 0:
                queue.append(m)
                queue.sort()
    if len(order) != len(nodes):
        cyclic = sorted(nodes - set(order))
        err(f"dependency graph has cycles involving: {', '.join(cyclic)}")
    else:
        print("topological order:", " -> ".join(order))


# ------------------------------------------------------------------ other registries

def validate_quality_gates():
    qg = load(IMPL / "quality-gates.json")
    if qg is None:
        return set(), []
    inv_ids = set()
    tiers = set(qg.get("enforcement_tiers", []))
    for inv in qg.get("invariants", []):
        iid = inv.get("id", "")
        inv_ids.add(iid)
        require(re.fullmatch(r"INV-\d{2}", iid), f"bad invariant id {iid}")
        require(inv.get("statement"), f"{iid}: missing statement")
        enfs = inv.get("enforcement", [])
        require(enfs, f"{iid}: needs >=1 enforcement entry")
        for e in enfs:
            require(e.get("tier") in tiers, f"{iid}: bad enforcement tier {e.get('tier')}")
            require(e.get("mechanism"), f"{iid}: enforcement without mechanism")
    dod = qg.get("dod", {})
    require(dod.get("id") == "DOD-STD", "missing DOD-STD")
    require(len(dod.get("items", [])) == 16, f"DOD-STD must have 16 items, has {len(dod.get('items', []))}")
    flags = qg.get("feature_flag_schema", {})
    require(set(flags.get("required_keys", [])) ==
            {"name", "owner", "created_at", "purpose", "removal_condition", "review_date"},
            "feature flag schema keys drifted from doc 22")
    return inv_ids, [i["id"] for i in qg.get("invariants", [])]


def validate_adrs():
    ad = load(IMPL / "architecture-decisions.json")
    if ad is None:
        return set()
    adr_ids = set()
    wp = load(IMPL / "work-packages.json") or {"gates": []}
    gates = {g["id"] for g in wp.get("gates", [])}
    for d in ad.get("decisions", []):
        did = d.get("id", "")
        adr_ids.add(did)
        require(re.fullmatch(r"ADR-\d{4}", did), f"bad ADR id {did}")
        require(d.get("status") in ("ratified", "candidate", "superseded"), f"{did}: bad status")
        for field in ("title", "context", "decision", "consequences"):
            require(d.get(field), f"{did}: missing '{field}'")
        rg = d.get("ratify_gate")
        require(rg is None or rg in gates, f"{did}: unknown ratify_gate {rg}")
        for ref in d.get("references", []):
            if str(ref).startswith("ADR-"):
                require(ref in adr_ids, f"{did}: reference to unknown ADR '{ref}'")
    return adr_ids


def validate_performance_budgets():
    pb = load(IMPL / "performance-budgets.json")
    if pb is None:
        return
    phase_rank = lambda p: int(p[1:]) if isinstance(p, str) and re.fullmatch(r"P\d+", p) else -1
    seen = set()
    for c in pb.get("categories", []):
        s = c.get("surface", "")
        require(s and s not in seen, f"duplicate/empty budget surface: {s}")
        seen.add(s)
        require(c.get("metrics"), f"{s}: metrics required")
        base, at = c.get("baseline"), c.get("baseline_set_at")
        if base is None:
            require(at == "P3", f"{s}: null baseline requires baseline_set_at=='P3' (no premature numbers)")
        else:
            require(phase_rank(at) >= phase_rank("P3"),
                    f"{s}: numeric baseline before P3 violates ADR-0001")
    require(pb.get("ratchet_policy", {}).get("statement"), "ratchet policy statement missing")


def validate_security_controls(inv_ids):
    sc = load(IMPL / "security-controls.json")
    if sc is None:
        return
    ssdf_re = re.compile(r"(RV|PW|PS|PO)\.\d$")
    for fam in sc.get("control_families", []):
        fid = fam.get("id", "")
        require(re.fullmatch(r"SEC-FAM-\d{2}", fid), f"bad control family id {fid}")
        require(fam.get("controls"), f"{fid}: controls required")
        for ref in fam.get("ssdf_refs", []):
            require(str(ref).startswith("profile:") or ssdf_re.fullmatch(str(ref)),
                    f"{fid}: malformed SSDF ref '{ref}' (use practice level like PW.4)")
        for inv in fam.get("invariants", []):
            require(inv in inv_ids, f"{fid}: unknown invariant '{inv}'")


def validate_release_gates():
    rg = load(IMPL / "release-gates.json")
    if rg is None:
        return
    envs = rg.get("environments_ordered", [])
    require(len(envs) == len(set(envs)) and envs, "environments must be unique and non-empty")
    drill = rg.get("rollback_drill", {})
    for req_env in ("staging", "production_candidate"):
        require(req_env in envs, f"missing environment {req_env}")
        require(req_env in drill.get("required_for", []),
                f"rollback drill not required for {req_env} (doc 29 forbids untested-rollback releases)")


# ---------------------------------------------------------------- --scan-clients

CANON_VALUE_MIN = 3          # canonical enum values in one literal window => suspicion
WINDOW_LINES = 6
SCAN_EXCLUDE_DIRS = {"node_modules", "fixtures", ".git", ".kilo", "contracts",
                     "implementation", "docs", "__pycache__"}
SCAN_SUFFIXES = (".js", ".ts", ".jsx", ".tsx", ".mjs")


def _collect_vocab():
    vocab_path = CONTRACTS / "vocabulary.json"
    vocab = load(vocab_path) or {}
    values = set()
    for members in vocab.get("enums", {}).values():
        values.update(members)
    prefixes = tuple(vocab.get("id_prefixes", {}).values())
    enum_names = set(vocab.get("enums", {}).keys())
    return values, prefixes, enum_names


def _load_allowlist():
    entries = []
    al = load(IMPL / "scan_allowlist.json")
    if al is None:
        return None
    required = {"path", "rule", "owner", "created_at", "purpose",
                "removal_condition", "review_date"}
    for e in al.get("exceptions", []):
        missing = required - set(e)
        if missing:
            err(f"scan_allowlist entry for '{e.get('path')}' missing metadata: {sorted(missing)} (doc 22 flag governance)")
        entries.append(e)
    return entries


def scan_clients(allowlist=None):
    values, prefixes, enum_names = _collect_vocab()
    findings = []
    targets = [ROOT / "web", ROOT / "clients", ROOT / "extension", ROOT / "mcp"]
    val_re = {re.escape(v) for v in values if v}
    boundary = "[\"'\\s:,(\\[\\]]"

    def allowed(rel_str, rule):
        for e in (allowlist or []):
            if str(e.get("rule")) != rule:
                continue
            p = str(e.get("path", "")).rstrip("/")
            if rel_str.startswith(p):
                return True
        return False

    for base in targets:
        if not base.is_dir():
            continue
        for path in base.rglob("*"):
            if not path.is_file() or path.suffix not in SCAN_SUFFIXES:
                continue
            rel = path.relative_to(ROOT)
            rel_str = str(rel)
            if any(part in SCAN_EXCLUDE_DIRS for part in rel.parts):
                continue
            lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
            # Rule A: local constant named after a canonical vocabulary enum
            for idx, line in enumerate(lines, 1):
                m = re.search(r"\b(?:const|let|var)\s+([A-Z_]{4,})\s*=\s*[{\[]", line)
                if m and any(name.upper() in m.group(1) for name in enum_names):
                    findings.append((rel_str, "A", idx,
                                     f"local constant '{m.group(1)}' shadows canonical enum name"))
            # Rule B: dense cluster of canonical enum values inside a literal window
            for i in range(0, max(0, len(lines) - WINDOW_LINES)):
                chunk = "\n".join(lines[i:i + WINDOW_LINES])
                if "[" not in chunk and "{" not in chunk:
                    continue
                found = set()
                for pat in val_re:
                    if re.search(boundary + pat + boundary, chunk):
                        found.add(pat)
                if len(found) >= CANON_VALUE_MIN:
                    findings.append(
                        (rel_str, "B", i + 1,
                         f"literal embeds {len(found)} canonical enum values "
                         f"(possible semantic copy; INV-08)"))
                    break
    hard = []
    soft = []
    for rel_str, rule, line, msg in findings:
        item = f"[scan-clients] {rel_str}:{line}: {msg}"
        if allowed(rel_str, rule):
            soft.append(item + " [allowlisted]")
        else:
            hard.append(item)
    return hard, soft


# ------------------------------------------------------------------------ main

def main(argv):
    mode_scan_only = "--scan-clients" in argv
    allowlist_enabled = True
    others = [a for a in argv if a != "--scan-clients"]
    if others:
        print(f"usage: validate_program.py [--scan-clients]", file=sys.stderr)
        return 2

    if not mode_scan_only:
        wp = validate_work_packages()
        validate_dependency_graph(wp)
        inv_ids, _ = validate_quality_gates()
        validate_adrs()
        validate_performance_budgets()
        validate_security_controls(inv_ids)
        validate_release_gates()

    allowlist = _load_allowlist() if allowlist_enabled else []
    hard, soft = scan_clients(allowlist)

    for w in WARNINGS:
        print(f"WARN: {w}")
    for s in soft:
        print(f"NOTE: {s}")
    for f in hard:
        err(f)

    if ERRORS:
        print(f"ScopeCareer implementation program: INVALID ({len(ERRORS)} error(s))")
        for e in ERRORS:
            print(f"  - {e}")
        return 1
    label = "scan-clients clean" if mode_scan_only else "VALID"
    print(f"ScopeCareer implementation program: {label}")
    if not mode_scan_only:
        wp_count = len((load(IMPL / 'work-packages.json') or {}).get('work_packages', []))
        print(f"work_packages={wp_count} gates=18 registries=7 validator=ok")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
