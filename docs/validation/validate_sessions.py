#!/usr/bin/env python3
import json
from pathlib import Path
import sys

import jsonschema

ROOT = Path(__file__).resolve().parent
SCHEMA = json.loads((ROOT / "session_record.schema.json").read_text(encoding="utf-8"))
SESSIONS = ROOT / "sessions"
PIPELINE = ROOT / "participant_pipeline.json"

PIPELINE_STAGES = ("sourced", "screened", "scheduled", "completed", "excluded")
TARGET_COMPLETED_RANGE = (6, 8)


def validate_pipeline():
    """Additive PV-1 ops gate: validates participant_pipeline.json (doc 21, P1)."""
    pipe = json.loads(PIPELINE.read_text(encoding="utf-8"))
    participants = pipe.get("participants", [])
    counts = {stage: 0 for stage in PIPELINE_STAGES}
    seen_ids = set()
    session_files = {p.name for p in SESSIONS.glob("*.json")}
    for entry in participants:
        pid = entry.get("participant_id", "")
        if not __import__("re").fullmatch(r"PV-P\d{2,3}", pid):
            raise AssertionError(f"pipeline: bad participant_id '{pid}'")
        if pid in seen_ids:
            raise AssertionError(f"pipeline: duplicate participant_id '{pid}'")
        seen_ids.add(pid)
        stage = entry.get("stage")
        if stage not in PIPELINE_STAGES:
            raise AssertionError(f"pipeline {pid}: unknown stage '{stage}'")
        counts[stage] += 1
        for field in ("source", "updated_at"):
            if not entry.get(field):
                raise AssertionError(f"pipeline {pid}: missing '{field}'")
        if entry.get("screener_pass") not in (True, False, None):
            raise AssertionError(f"pipeline {pid}: screener_pass must be boolean or null")
        session_file = entry.get("session_file")
        if stage == "completed":
            if not session_file:
                raise AssertionError(f"pipeline {pid}: completed but no session_file")
            if session_file not in session_files:
                raise AssertionError(
                    f"pipeline {pid}: session_file '{session_file}' not found in sessions/")
        elif session_file:
            raise AssertionError(f"pipeline {pid}: session_file set before completion")
    lo, hi = TARGET_COMPLETED_RANGE
    print(
        "PV-1 participant pipeline: VALID "
        f"(sourced={counts['sourced']} screened={counts['screened']} "
        f"scheduled={counts['scheduled']} completed={counts['completed']} "
        f"excluded={counts['excluded']}; target {lo}-{hi} completed)")


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
    validate_pipeline()


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Product Validation-1 session records: INVALID: {exc}", file=sys.stderr)
        raise
