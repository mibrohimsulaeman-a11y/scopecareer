#!/usr/bin/env python3
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
PATH = ROOT / "source_matrix.json"
ALLOWED_STATUS = {
    "candidate_v1",
    "candidate_v1_optional",
    "defer_v1_1",
    "manual_first",
    "not_core",
    "research_required",
    "commercially_constrained"
}
REQUIRED = {
    "id", "category", "provider", "interface", "access", "coverage", "freshness",
    "geography", "pii", "redistribution_terms", "status", "notes", "evidence"
}


def main():
    doc = json.loads(PATH.read_text(encoding="utf-8"))
    rows = doc["sources"]
    ids = [x["id"] for x in rows]
    if len(ids) != len(set(ids)):
        raise AssertionError("duplicate source ids")
    for row in rows:
        missing = REQUIRED - set(row)
        if missing:
            raise AssertionError(f"{row['id']} missing {sorted(missing)}")
        if row["status"] not in ALLOWED_STATUS:
            raise AssertionError(f"{row['id']} invalid status {row['status']}")
        if not isinstance(row["notes"], list):
            raise AssertionError(f"{row['id']} notes must be list")
        if not isinstance(row["evidence"], list):
            raise AssertionError(f"{row['id']} evidence must be list")
        if row["provider"] not in {"candidate / recruiter conversation", "arbitrary webpage selected by candidate"} and not row["evidence"]:
            raise AssertionError(f"{row['id']} external source requires evidence URL")
    print(f"ScopeCareer source feasibility matrix: VALID ({len(rows)} sources)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ScopeCareer source feasibility matrix: INVALID: {exc}", file=sys.stderr)
        raise
