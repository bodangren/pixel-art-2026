#!/usr/bin/env python3
"""
Backfill existing runs with prompt_version_id and prompt_hash.
"""

import json
from pathlib import Path
from datetime import datetime, timezone

PROMPT_VERSION_ID = "prompt-001"
PROMPT_HASH = "ab3a91e3bb6751312fddc36f918f05788af855e20134906f1f6068250689062c"
PROMPT_VERSION = "v1.0"

def backfill_run(run_path: Path) -> bool:
    run_json_path = run_path / "run.json"
    if not run_json_path.exists():
        return False

    with open(run_json_path) as f:
        data = json.load(f)

    if "prompt_version_id" in data:
        return False

    data["prompt_version_id"] = PROMPT_VERSION_ID
    data["prompt_hash"] = PROMPT_HASH
    if "prompt_version" not in data:
        data["prompt_version"] = PROMPT_VERSION

    with open(run_json_path, "w") as f:
        json.dump(data, f, indent=2)

    return True

def main():
    runs_dir = Path("data/runs")
    count = 0

    for run_path in sorted(runs_dir.iterdir()):
        if run_path.is_dir():
            if backfill_run(run_path):
                print(f"Backfilled: {run_path.name}")
                count += 1

    print(f"\nTotal runs backfilled: {count}")

if __name__ == "__main__":
    main()