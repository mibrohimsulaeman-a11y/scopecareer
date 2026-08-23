#!/usr/bin/env python3
import json
from pathlib import Path
import sys

import jsonschema

ROOT = Path(__file__).resolve().parent
SCHEMA = json.loads((ROOT / "session_record.schema.json").read_text(encoding="utf-8"))
SESSIONS = ROOT / "sessions"


def main():
    files = sorted(p for p in SESSIONS.glob("*.json") if not p.name.startswith("_"))
    for path in files:
        data = json.loads(path.read_text(encoding="utf-8"))
        jsonschema.Draft202012Validator(SCHEMA).validate(data)
        task_ids = [x["task_id"] for x in data["tasks"]]
        hyp_ids = [x["hypothesis_id"] for x in data["hypotheses"]]
        if len(task_ids) != len(set(task_ids)):
            raise AssertionError(f"duplicate task ids in {path.name}")
        if len(hyp_ids) != len(set(hyp_ids)):
            raise AssertionError(f"duplicate hypothesis ids in {path.name}")
    print(f"Product Validation-1 session records: VALID ({len(files)} actual sessions)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Product Validation-1 session records: INVALID: {exc}", file=sys.stderr)
        raise
