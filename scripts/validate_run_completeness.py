#!/usr/bin/env python3
"""
Run Completeness Validation Tool

Validates benchmark runs for completeness:
- PNG file sizes (reject < 1KB as broken/invalid)
- Expected asset count matches manifest (run.json asset_file_paths)
- JSON metadata validity (run.json exists and is valid JSON)
"""

import json
import sys
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from collections import defaultdict


MIN_FILE_SIZE_BYTES = 1024

REQUIRED_ASSET_KEYS = {"background", "hero-3x3-sheet", "goblin-3x3-sheet", "orb-sheet"}


def validate_json_file(json_path: Path) -> dict[str, Any]:
    """Check if a JSON file exists and is valid."""
    if not json_path.exists():
        return {
            "valid": False,
            "exists": False,
            "issues": [f"File not found: {json_path}"]
        }
    
    try:
        with open(json_path) as f:
            data = json.load(f)
        return {
            "valid": True,
            "exists": True,
            "data": data
        }
    except json.JSONDecodeError as e:
        return {
            "valid": False,
            "exists": True,
            "issues": [f"Invalid JSON in {json_path}: {e}"]
        }
    except Exception as e:
        return {
            "valid": False,
            "exists": True,
            "issues": [f"Error reading {json_path}: {e}"]
        }


def validate_asset_file(asset_path: Path) -> dict[str, Any]:
    """Validate a single asset file."""
    if not asset_path.exists():
        return {
            "valid": False,
            "exists": False,
            "size_bytes": 0,
            "issues": [f"Asset file not found: {asset_path}"]
        }
    
    try:
        size = asset_path.stat().st_size
        result = {
            "valid": size >= MIN_FILE_SIZE_BYTES,
            "exists": True,
            "size_bytes": size,
            "issues": []
        }
        if size < MIN_FILE_SIZE_BYTES:
            result["issues"].append(
                f"File too small: {size} bytes (minimum: {MIN_FILE_SIZE_BYTES} bytes)"
            )
        return result
    except Exception as e:
        return {
            "valid": False,
            "exists": False,
            "size_bytes": 0,
            "issues": [f"Error checking asset file {asset_path}: {e}"]
        }


def validate_run_completeness(run_id: str, data_dir: str = "data/runs") -> dict[str, Any]:
    """
    Validate a single run for completeness.
    
    Checks:
    1. run.json exists and is valid JSON
    2. All assets in manifest exist
    3. All asset files meet minimum size requirement
    """
    run_path = Path(data_dir) / run_id
    run_json_path = run_path / "run.json"
    
    result = {
        "run_id": run_id,
        "run_path": str(run_path),
        "validation_timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "run_json": {"valid": False, "exists": False, "issues": []},
        "assets": {},
        "expected_asset_count": 0,
        "actual_asset_count": 0,
        "missing_assets": [],
        "small_assets": [],
        "issues": [],
        "passed": False,
        "model_id": None
    }
    
    json_validation = validate_json_file(run_json_path)
    result["run_json"] = json_validation
    
    if not json_validation["valid"]:
        if not json_validation["exists"]:
            result["issues"].append(f"run.json not found at {run_json_path}")
        else:
            result["issues"].extend(json_validation.get("issues", []))
        return result
    
    run_data = json_validation.get("data", {})
    result["model_id"] = run_data.get("model_id", "unknown")
    
    asset_file_paths = run_data.get("asset_file_paths", {})
    result["expected_asset_count"] = len(asset_file_paths)
    
    if result["expected_asset_count"] == 0:
        result["issues"].append("No assets defined in run.json asset_file_paths")
        return result
    
    for asset_key, asset_path_str in asset_file_paths.items():
        asset_path = Path(asset_path_str)
        
        if not asset_path.is_absolute():
            asset_path = run_path / asset_path
        
        if not asset_path.exists():
            asset_path = run_path / "assets" / asset_path.name
        
        asset_validation = validate_asset_file(asset_path)
        result["assets"][asset_key] = {
            "path": str(asset_path),
            **asset_validation
        }
        
        if not asset_validation["exists"]:
            result["missing_assets"].append(asset_key)
        elif asset_validation["size_bytes"] < MIN_FILE_SIZE_BYTES:
            result["small_assets"].append(asset_key)
    
    result["actual_asset_count"] = sum(
        1 for a in result["assets"].values() if a["exists"]
    )
    
    if result["missing_assets"]:
        result["issues"].append(
            f"Missing {len(result['missing_assets'])} asset(s): {', '.join(sorted(result['missing_assets']))}"
        )
    
    if result["small_assets"]:
        result["issues"].append(
            f"Small/broken assets (<{MIN_FILE_SIZE_BYTES} bytes): {', '.join(sorted(result['small_assets']))}"
        )
    
    result["passed"] = (
        json_validation["valid"] and
        len(result["missing_assets"]) == 0 and
        len(result["small_assets"]) == 0
    )
    
    return result


def validate_all_runs(data_dir: str = "data/runs") -> dict[str, Any]:
    """Validate all runs in the data directory."""
    runs_dir = Path(data_dir)
    
    if not runs_dir.exists():
        return {
            "error": f"Data directory not found: {data_dir}",
            "runs_validated": 0,
            "runs_passed": 0,
            "runs_failed": 0
        }
    
    run_validations = []
    model_summary = defaultdict(lambda: {"total": 0, "passed": 0, "failed": 0})
    
    for run_path in sorted(runs_dir.iterdir()):
        if not run_path.is_dir():
            continue
        
        run_id = run_path.name
        validation = validate_run_completeness(run_id, data_dir)
        run_validations.append(validation)
        
        model_id = validation.get("model_id", "unknown")
        model_summary[model_id]["total"] += 1
        if validation["passed"]:
            model_summary[model_id]["passed"] += 1
        else:
            model_summary[model_id]["failed"] += 1
    
    runs_passed = sum(1 for v in run_validations if v["passed"])
    runs_failed = len(run_validations) - runs_passed
    
    return {
        "data_dir": data_dir,
        "validation_timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "runs_validated": len(run_validations),
        "runs_passed": runs_passed,
        "runs_failed": runs_failed,
        "model_summary": dict(model_summary),
        "runs": run_validations
    }


def generate_summary_report(validation_result: dict[str, Any]) -> str:
    """Generate a human-readable summary report."""
    if "error" in validation_result:
        return f"Error: {validation_result['error']}"
    
    lines = []
    lines.append("=" * 60)
    lines.append("RUN COMPLETENESS VALIDATION REPORT")
    lines.append("=" * 60)
    lines.append(f"Timestamp: {validation_result['validation_timestamp']}")
    lines.append(f"Data Directory: {validation_result['data_dir']}")
    lines.append("")
    lines.append(f"Total Runs: {validation_result['runs_validated']}")
    lines.append(f"Passed: {validation_result['runs_passed']}")
    lines.append(f"Failed: {validation_result['runs_failed']}")
    lines.append("")
    
    if validation_result['runs_failed'] > 0:
        lines.append("FAILED RUNS:")
        lines.append("-" * 40)
        for run in validation_result['runs']:
            if not run["passed"]:
                lines.append(f"  {run['run_id']}")
                lines.append(f"    Model: {run.get('model_id', 'unknown')}")
                for issue in run['issues']:
                    lines.append(f"    - {issue}")
                if run['missing_assets']:
                    lines.append(f"    Missing: {', '.join(run['missing_assets'])}")
                if run['small_assets']:
                    lines.append(f"    Small: {', '.join(run['small_assets'])}")
        lines.append("")
    
    lines.append("MODEL SUMMARY:")
    lines.append("-" * 40)
    for model_id, stats in sorted(validation_result['model_summary'].items()):
        status = "✓" if stats['failed'] == 0 else "✗"
        lines.append(f"  {status} {model_id}: {stats['passed']}/{stats['total']} passed")
    
    lines.append("=" * 60)
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Validate benchmark runs for completeness"
    )
    parser.add_argument(
        "--run-id",
        help="Specific run ID to validate (default: validate all runs)"
    )
    parser.add_argument(
        "--data-dir",
        default="data/runs",
        help="Base directory for run data"
    )
    parser.add_argument(
        "--output",
        help="Output file for validation report (JSON)"
    )
    parser.add_argument(
        "--summary",
        action="store_true",
        help="Print human-readable summary"
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Verbose output"
    )
    
    args = parser.parse_args()
    
    if args.run_id:
        result = validate_run_completeness(args.run_id, args.data_dir)
    else:
        result = validate_all_runs(args.data_dir)
    
    if args.summary:
        print(generate_summary_report(result))
    
    if args.verbose and args.run_id:
        print(f"\nValidation Report for: {result['run_id']}")
        print(f"Model: {result.get('model_id', 'unknown')}")
        print(f"Passed: {'Yes' if result['passed'] else 'No'}")
        print(f"\nExpected Assets: {result['expected_asset_count']}")
        print(f"Actual Assets: {result['actual_asset_count']}")
        if result['issues']:
            print("\nIssues:")
            for issue in result['issues']:
                print(f"  - {issue}")
        print("\nAsset Details:")
        for asset_key, asset_info in result.get('assets', {}).items():
            size = asset_info.get('size_bytes', 0)
            status = "✓" if asset_info.get('valid', False) else "✗"
            lines = [f"    {status} {asset_key}: {size} bytes"]
            for issue in asset_info.get('issues', []):
                lines.append(f"      - {issue}")
            print("\n".join(lines))
    
    output = json.dumps(result, indent=2)
    
    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"\nReport saved to: {args.output}")
    else:
        print(output)
    
    sys.exit(0 if result.get("passed", False) else 1)


if __name__ == "__main__":
    main()