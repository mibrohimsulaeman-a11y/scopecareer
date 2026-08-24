#!/usr/bin/env python3
"""ScopeCareer — Work Package Receipt Archiving Tool

Validates and archives work package receipts per docs/28 protocol.
Usage:
  python3 implementation/receipt_tool.py validate <receipt.json>
  python3 implementation/receipt_tool.py archive <receipt.json> --archive-dir receipts/
  python3 implementation/receipt_tool.py list [--archive-dir receipts/]
"""
import json
import sys
import hashlib
from pathlib import Path
from datetime import datetime, timezone

RECEIPT_SCHEMA_REQUIRED = {
    "work_package": str,
    "agent": str,
    "verification": list,
    "files_mutated": list,
    "invariants_reviewed": list,
    "dod": dict,
}

DOD_REQUIRED_KEYS = [
    "all_16", "contract_satisfied", "invariants_preserved",
    "no_new_semantics", "security_reviewed", "privacy_classified",
    "tests_added", "conformance_green", "no_duplication",
    "no_dead_code", "architecture_respected", "a11y_checked",
    "performance_checked", "observability_included",
    "failure_handled", "migration_handled"
]

def compute_hash(data: dict) -> str:
    canonical = json.dumps(data, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode()).hexdigest()

def validate_receipt(receipt_path: str) -> tuple[bool, list[str]]:
    errors = []
    try:
        receipt = json.loads(Path(receipt_path).read_text())
    except (json.JSONDecodeError, FileNotFoundError) as e:
        return False, [f"Cannot read receipt file: {e}"]

    for key, expected_type in RECEIPT_SCHEMA_REQUIRED.items():
        if key not in receipt:
            errors.append(f"Missing required field: '{key}'")
        elif not isinstance(receipt[key], expected_type):
            errors.append(f"Field '{key}' must be {expected_type.__name__}, got {type(receipt[key]).__name__}")

    # Verify verification entries have real command + exit_code
    if isinstance(receipt.get("verification"), list):
        for i, v in enumerate(receipt["verification"]):
            if not isinstance(v, dict) or "command" not in v or "exit_code" not in v:
                errors.append(f"verification[{i}] missing 'command' or 'exit_code'")
            elif v["exit_code"] != 0:
                errors.append(f"verification[{i}] has non-zero exit code: {v['exit_code']}")

    # Verify DoD completeness
    dod = receipt.get("dod", {})
    for key in DOD_REQUIRED_KEYS:
        if key not in dod:
            errors.append(f"dod missing required key: '{key}'")
        elif key != "notes" and dod[key] is not True:
            errors.append(f"dod['{key}'] is not true — all 16 items must be satisfied")

    # Check that files_mutated are within owned paths (basic check)
    wp_id = receipt.get("work_package", "")
    files = receipt.get("files_mutated", [])
    if wp_id and files:
        try:
            wp_data = json.loads(Path("implementation/work-packages.json").read_text())
            wp = next((w for w in wp_data["work_packages"] if w["id"] == wp_id), None)
            if wp and wp.get("owns"):
                owns = wp["owns"]
                for f in files:
                    matched = any(Path(f).match(pattern) or str(Path(f)).startswith(pattern.rstrip("*")) for pattern in owns)
                    if not matched:
                        errors.append(f"File '{f}' not in owned paths {owns}")
        except Exception as e:
            errors.append(f"Could not check ownership against work-packages.json: {e}")

    return len(errors) == 0, errors

def archive_receipt(receipt_path: str, archive_dir: str = "receipts") -> dict:
    valid, errors = validate_receipt(receipt_path)
    if not valid:
        return {"archived": False, "errors": errors}

    receipt = json.loads(Path(receipt_path).read_text())
    content_hash = compute_hash(receipt)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    archive_path = Path(archive_dir)
    archive_path.mkdir(parents=True, exist_ok=True)

    wp_id = receipt.get("work_package", "unknown")
    out_file = archive_path / f"{wp_id}_{timestamp}.json"

    record = {
        **receipt,
        "_receipt_hash_sha256": content_hash,
        "_archived_at": datetime.now(timezone.utc).isoformat(),
        "_source_file": receipt_path,
    }
    out_file.write_text(json.dumps(record, indent=2))
    return {"archived": True, "path": str(out_file), "hash": content_hash}

def list_receipts(archive_dir: str = "receipts") -> list[dict]:
    archive_path = Path(archive_dir)
    if not archive_path.exists():
        return []
    results = []
    for f in sorted(archive_path.glob("*.json")):
        try:
            data = json.loads(f.read_text())
            results.append({
                "file": f.name,
                "work_package": data.get("work_package"),
                "agent": data.get("agent"),
                "archived_at": data.get("_archived_at"),
                "hash": data.get("_receipt_hash_sha256")[:16] if data.get("_receipt_hash_sha256") else None,
            })
        except json.JSONDecodeError:
            results.append({"file": f.name, "error": "corrupted"})
    return results

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    action = sys.argv[1]

    if action == "validate":
        if len(sys.argv) < 3:
            print("Usage: receipt_tool.py validate <receipt.json>")
            sys.exit(1)
        ok, errs = validate_receipt(sys.argv[2])
        if ok:
            print(f"RECEIPT VALID: {sys.argv[2]}")
            sys.exit(0)
        else:
            print("RECEIPT INVALID:")
            for e in errs:
                print(f"  - {e}")
            sys.exit(1)

    elif action == "archive":
        if len(sys.argv) < 3:
            print("Usage: receipt_tool.py archive <receipt.json>")
            sys.exit(1)
        archive_dir = "receipts"
        if "--archive-dir" in sys.argv:
            idx = sys.argv.index("--archive-dir")
            archive_dir = sys.argv[idx + 1]
        result = archive_receipt(sys.argv[2], archive_dir)
        print(json.dumps(result, indent=2))
        sys.exit(0 if result.get("archived") else 1)

    elif action == "list":
        archive_dir = "receipts"
        if "--archive-dir" in sys.argv:
            idx = sys.argv.index("--archive-dir")
            archive_dir = sys.argv[idx + 1]
        receipts = list_receipts(archive_dir)
        if not receipts:
            print("No archived receipts found.")
        else:
            print(json.dumps(receipts, indent=2))
        sys.exit(0)

    else:
        print(f"Unknown action: '{action}'. Use validate/archive/list.")
        sys.exit(1)

if __name__ == "__main__":
    main()
