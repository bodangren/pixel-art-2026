#!/usr/bin/env python3
"""
Pixel Art Asset Validation Tool

Validates generated pixel art assets against technical specifications:
- Correct dimensions
- 3x3 grid alignment
- Transparent backgrounds
- Color palette adherence
- Style-specific rules (RPG, Isometric, Sci-fi, UI, Font)
"""

import json
import sys
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is required. Install with: pip install pillow")
    sys.exit(1)


STYLE_PRESETS = {
    "rpg": {
        "sprite_dimensions": [(16, 16), (32, 32), (64, 64)],
        "color_limit": 64,
        "animation_frames": (4, 8),
        "grid_alignment": "3x3"
    },
    "isometric": {
        "sprite_dimensions": [(32, 16), (64, 32), (128, 64)],
        "color_limit": 48,
        "animation_frames": (2, 4),
        "grid_alignment": "isometric"
    },
    "scifi": {
        "sprite_dimensions": [(16, 16), (24, 24), (32, 32)],
        "color_limit": 32,
        "animation_frames": (2, 6),
        "grid_alignment": "4x4"
    },
    "ui": {
        "sprite_dimensions": [(16, 16), (24, 24), (32, 8)],
        "color_limit": 16,
        "animation_frames": (4, 8),
        "grid_alignment": "none"
    },
    "font": {
        "sprite_dimensions": [(128, 16), (256, 32)],
        "color_limit": 2,
        "animation_frames": (1, 1),
        "grid_alignment": "none"
    }
}


def validate_dimensions_3x3_sheet(image_path: str, expected_cell_size: int = 32) -> dict[str, Any]:
    """Validate that a 3x3 sprite sheet has correct dimensions."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            expected = expected_cell_size * 3
            result = {
                "valid": width == expected and height == expected,
                "dimensions": {"width": width, "height": height},
                "expected": {"width": expected, "height": expected},
                "issues": []
            }
            if not result["valid"]:
                result["issues"].append(f"dimensions: expected {expected}x{expected}, got {width}x{height}")
            return result
    except Exception as e:
        return {"valid": False, "issues": [f"Failed to open image: {e}"]}


def validate_dimensions_background(image_path: str, expected_size: int = 512) -> dict[str, Any]:
    """Validate that a background image has correct dimensions."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            result = {
                "valid": width == expected_size and height == expected_size,
                "dimensions": {"width": width, "height": height},
                "expected_size": expected_size,
                "issues": []
            }
            if not result["valid"]:
                result["issues"].append(f"dimensions: expected {expected_size}x{expected_size}, got {width}x{height}")
            return result
    except Exception as e:
        return {"valid": False, "issues": [f"Failed to open image: {e}"]}


def validate_transparency(image_path: str) -> dict[str, Any]:
    """Validate that an image has transparency (alpha channel)."""
    try:
        with Image.open(image_path) as img:
            has_alpha = img.mode in ("RGBA", "LA", "PA")
            if has_alpha:
                alpha_channel = img.split()[-1]
                min_alpha = min(alpha_channel.getdata())
                has_transparency = min_alpha < 255
            else:
                has_transparency = False
            return {
                "has_transparency": has_transparency,
                "mode": img.mode,
                "issues": [] if has_transparency else ["no alpha channel"]
            }
    except Exception as e:
        return {"has_transparency": False, "issues": [f"Failed to open image: {e}"]}


def validate_grid_alignment(image_path: str, expected_cells: int = 3) -> dict[str, Any]:
    """Validate that a sprite sheet has proper grid alignment."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            cell_width = width // expected_cells
            cell_height = height // expected_cells
            result = {
                "valid": width % expected_cells == 0 and height % expected_cells == 0,
                "grid_cells": {"cols": expected_cells, "rows": expected_cells},
                "cell_size": {"width": cell_width, "height": cell_height},
                "issues": []
            }
            if not result["valid"]:
                result["issues"].append(
                    f"grid: image {width}x{height} not evenly divisible by {expected_cells} cells"
                )
            return result
    except Exception as e:
        return {"valid": False, "issues": [f"Failed to open image: {e}"]}


def extract_palette(image_path: str) -> list[str]:
    """Extract unique colors from an image as hex codes."""
    try:
        with Image.open(image_path) as img:
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")
            colors = set()
            for pixel in img.getdata():
                if len(pixel) >= 3:
                    r, g, b = pixel[0], pixel[1], pixel[2]
                    colors.add(f"#{r:02x}{g:02x}{b:02x}".upper())
            return sorted(list(colors))
    except Exception as e:
        print(f"Warning: Failed to extract palette: {e}")
        return []


def validate_palette(image_path: str, max_colors: int = 16) -> dict[str, Any]:
    """Validate color palette constraints."""
    palette = extract_palette(image_path)
    result = {
        "palette": palette,
        "color_count": len(palette),
        "valid": len(palette) <= max_colors,
        "issues": []
    }
    if not result["valid"]:
        result["issues"].append(f"palette: {len(palette)} colors exceeds max {max_colors}")
    return result


def validate_isometric_alignment(image_path: str) -> dict[str, Any]:
    """Validate isometric sprite has correct 2:1 ratio."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            result = {
                "valid": height * 2 == width,
                "ratio": f"{width}:{height}",
                "issues": []
            }
            if not result["valid"]:
                result["issues"].append(f"isometric: expected 2:1 ratio, got {width}:{height}")
            return result
    except Exception as e:
        return {"valid": False, "issues": [f"Failed to open isometric validation: {e}"]}


def validate_scifi_grid(image_path: str, grid_size: int = 4) -> dict[str, Any]:
    """Validate sci-fi sprite is aligned to grid."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            result = {
                "valid": width % grid_size == 0 and height % grid_size == 0,
                "grid_size": grid_size,
                "issues": []
            }
            if not result["valid"]:
                result["issues"].append(f"sci-fi grid: {width}x{height} not divisible by {grid_size}")
            return result
    except Exception as e:
        return {"valid": False, "issues": [f"Failed to open sci-fi validation: {e}"]}


def validate_font_monospace(image_path: str) -> dict[str, Any]:
    """Validate font sheet has proper monospace grid."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            result = {
                "valid": width % 16 == 0 and height % 16 == 0,
                "char_width": width // 16,
                "issues": []
            }
            if not result["valid"]:
                result["issues"].append(f"font: {width}x{height} not divisible by 16 for monospace grid")
            return result
    except Exception as e:
        return {"valid": False, "issues": [f"Failed to open font validation: {e}"]}


DEFAULT_WEIGHTS = {
    "dimensions": 30,
    "grid_alignment": 25,
    "transparency": 20,
    "palette": 15,
    "color_adherence": 10
}

STYLE_WEIGHTS = {
    "rpg": {"dimensions": 30, "grid_alignment": 25, "transparency": 20, "palette": 25},
    "isometric": {"dimensions": 20, "grid_alignment": 30, "transparency": 25, "palette": 25},
    "scifi": {"dimensions": 25, "grid_alignment": 25, "transparency": 20, "palette": 30},
    "ui": {"dimensions": 25, "transparency": 30, "palette": 25, "grid_alignment": 20},
    "font": {"dimensions": 30, "palette": 40, "transparency": 30}
}


def weighted_score_calculation(criteria: dict[str, bool], style: str = None) -> int:
    """Calculate weighted score from boolean criteria."""
    weights = STYLE_WEIGHTS.get(style, DEFAULT_WEIGHTS)
    score = 100
    for criterion, passed in criteria.items():
        if not passed and criterion in weights:
            score -= weights[criterion]
    return max(0, score)


def score_asset(asset_result: dict[str, Any], style: str = None) -> int:
    """Calculate a score (0-100) for a validated asset."""
    has_transparency_issue = any("alpha" in issue or "transparency" in issue for issue in asset_result.get("issues", []))
    criteria = {
        "dimensions": not any("dimensions" in issue for issue in asset_result.get("issues", [])),
        "grid_alignment": not any("grid" in issue for issue in asset_result.get("issues", [])),
        "transparency": not has_transparency_issue,
        "palette": not any("palette" in issue for issue in asset_result.get("issues", []))
    }
    return weighted_score_calculation(criteria, style)


def validate_asset(asset_path: str, asset_type: str, style: str = None) -> dict[str, Any]:
    """Validate a single asset and return results."""
    result = {
        "path": asset_path,
        "type": asset_type,
        "style": style,
        "issues": []
    }

    if style and style in STYLE_PRESETS:
        preset = STYLE_PRESETS[style]

        if asset_type == "3x3-sheet" or preset["grid_alignment"] == "3x3":
            dim_result = validate_dimensions_3x3_sheet(asset_path)
            result.update(dim_result)

            grid_result = validate_grid_alignment(asset_path)
            result["grid_cells"] = grid_result.get("grid_cells")
            result["issues"].extend(grid_result.get("issues", []))
        elif asset_type == "background":
            dim_result = validate_dimensions_background(asset_path)
            result.update(dim_result)
        elif style == "isometric":
            dim_result = validate_dimensions_3x3_sheet(asset_path)
            result.update(dim_result)

            iso_result = validate_isometric_alignment(asset_path)
            result["issues"].extend(iso_result.get("issues", []))
        elif style == "scifi":
            dim_result = validate_dimensions_3x3_sheet(asset_path)
            result.update(dim_result)

            grid_result = validate_scifi_grid(asset_path)
            result["issues"].extend(grid_result.get("issues", []))
        elif style == "font":
            dim_result = validate_dimensions_background(asset_path, 256)
            result.update(dim_result)

            font_result = validate_font_monospace(asset_path)
            result["issues"].extend(font_result.get("issues", []))
    else:
        if asset_type == "3x3-sheet":
            dim_result = validate_dimensions_3x3_sheet(asset_path)
            result.update(dim_result)

            grid_result = validate_grid_alignment(asset_path)
            result["grid_cells"] = grid_result.get("grid_cells")
            result["issues"].extend(grid_result.get("issues", []))
        elif asset_type == "background":
            dim_result = validate_dimensions_background(asset_path)
            result.update(dim_result)

    trans_result = validate_transparency(asset_path)
    result["has_transparency"] = trans_result.get("has_transparency", False)
    result["issues"].extend(trans_result.get("issues", []))

    palette_limit = STYLE_PRESETS[style]["color_limit"] if style and style in STYLE_PRESETS else 16
    palette_result = validate_palette(asset_path, palette_limit)
    result["palette"] = palette_result.get("palette", [])
    result["color_count"] = palette_result.get("color_count", 0)
    result["issues"].extend(palette_result.get("issues", []))

    result["score"] = score_asset(result, style)
    return result


def generate_validation_report(run_id: str, asset_validations: list[dict[str, Any]], style: str = None) -> dict[str, Any]:
    """Generate a complete validation report for a run."""
    total_score = sum(v.get("score", 0) for v in asset_validations)
    avg_score = total_score / len(asset_validations) if asset_validations else 0

    assets = {}
    for v in asset_validations:
        asset_name = Path(v["path"]).name
        assets[asset_name] = {
            "dimensions": v.get("dimensions"),
            "has_transparency": v.get("has_transparency", False),
            "palette": v.get("palette", []),
            "issues": v.get("issues", []),
            "score": v.get("score", 0),
            "style": v.get("style")
        }
        if "grid_cells" in v:
            assets[asset_name]["grid_cells"] = v["grid_cells"]

    return {
        "run_id": run_id,
        "style": style,
        "validation_timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "assets": assets,
        "overall_score": round(avg_score, 2),
        "passed": avg_score >= 70
    }


def validate_run(run_id: str, data_dir: str = "data/runs", style: str = None) -> dict[str, Any]:
    """Validate all assets for a given run."""
    run_path = Path(data_dir) / run_id
    run_json_path = run_path / "run.json"

    if not run_json_path.exists():
        return {"error": f"Run not found: {run_id}"}

    with open(run_json_path) as f:
        run_data = json.load(f)

    asset_validations = []
    asset_paths = run_data.get("asset_file_paths", {})

    for asset_key, asset_path_str in asset_paths.items():
        asset_path = Path(asset_path_str)

        if not asset_path.is_absolute():
            asset_path = run_path / asset_path

        if not asset_path.exists():
            asset_path = run_path / "assets" / asset_path.name

        if not asset_path.exists():
            continue

        if "sheet" in asset_key or "hero" in asset_key or "goblin" in asset_key or "enemy" in asset_key or "orb" in asset_key:
            asset_type = "3x3-sheet"
        else:
            asset_type = "background"

        result = validate_asset(str(asset_path), asset_type, style)
        asset_validations.append(result)

    return generate_validation_report(run_id, asset_validations, style)


def main():
    parser = argparse.ArgumentParser(
        description="Validate pixel art assets against technical specifications"
    )
    parser.add_argument("run_id", help="Run ID to validate (e.g., gemini-2.5-flash__2026-04-04__initial)")
    parser.add_argument("--data-dir", default="data/runs", help="Base directory for run data")
    parser.add_argument("--style", choices=["rpg", "isometric", "scifi", "ui", "font"],
                        help="Style category for style-specific validation")
    parser.add_argument("--output", help="Output file for validation report (JSON)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    report = validate_run(args.run_id, args.data_dir, args.style)

    if "error" in report:
        print(f"Error: {report['error']}")
        sys.exit(1)

    if args.verbose:
        print(f"\nValidation Report for: {report['run_id']}")
        if report.get("style"):
            print(f"Style: {report['style']}")
        print(f"Timestamp: {report['validation_timestamp']}")
        print(f"Overall Score: {report['overall_score']}/100")
        print(f"Passed: {'Yes' if report['passed'] else 'No'}")
        print("\nAsset Details:")
        for name, details in report["assets"].items():
            print(f"  {name}:")
            print(f"    Score: {details['score']}")
            if details.get("issues"):
                print(f"    Issues: {', '.join(details['issues'])}")

    output = json.dumps(report, indent=2)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"Report saved to: {args.output}")
    else:
        print(output)

    sys.exit(0 if report["passed"] else 1)


if __name__ == "__main__":
    main()