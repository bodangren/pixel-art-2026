#!/usr/bin/env python3
"""Tests for style-specific validation rules."""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import tempfile
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    import pytest
    pytest.skip("Pillow not installed", allow_module_level=True)

from scripts.validate_run import (
    STYLE_PRESETS,
    validate_isometric_alignment,
    validate_scifi_grid,
    validate_font_monospace,
    weighted_score_calculation,
    score_asset
)


def create_test_image(path, size, mode="RGBA"):
    img = Image.new(mode, size)
    img.save(path)


class TestIsometricValidation:
    def test_valid_2_1_ratio(self, tmp_path):
        img_path = tmp_path / "iso_64x32.png"
        create_test_image(img_path, (64, 32))
        result = validate_isometric_alignment(str(img_path))
        assert result["valid"] is True
        assert result["ratio"] == "64:32"

    def test_invalid_ratio(self, tmp_path):
        img_path = tmp_path / "iso_64x48.png"
        create_test_image(img_path, (64, 48))
        result = validate_isometric_alignment(str(img_path))
        assert result["valid"] is False
        assert len(result["issues"]) > 0


class TestSciFiGridValidation:
    def test_valid_4x4_grid(self, tmp_path):
        img_path = tmp_path / "scifi_64x64.png"
        create_test_image(img_path, (64, 64))
        result = validate_scifi_grid(str(img_path))
        assert result["valid"] is True
        assert result["grid_size"] == 4

    def test_invalid_not_divisible(self, tmp_path):
        img_path = tmp_path / "scifi_63x63.png"
        create_test_image(img_path, (63, 63))
        result = validate_scifi_grid(str(img_path))
        assert result["valid"] is False


class TestFontMonospaceValidation:
    def test_valid_256x32(self, tmp_path):
        img_path = tmp_path / "font_256x32.png"
        create_test_image(img_path, (256, 32))
        result = validate_font_monospace(str(img_path))
        assert result["valid"] is True
        assert result["char_width"] == 16

    def test_invalid_not_16_divisible(self, tmp_path):
        img_path = tmp_path / "font_100x20.png"
        create_test_image(img_path, (100, 20))
        result = validate_font_monospace(str(img_path))
        assert result["valid"] is False


class TestStylePresets:
    def test_all_styles_defined(self):
        expected_styles = ["rpg", "isometric", "scifi", "ui", "font"]
        for style in expected_styles:
            assert style in STYLE_PRESETS
            preset = STYLE_PRESETS[style]
            assert "sprite_dimensions" in preset
            assert "color_limit" in preset
            assert "grid_alignment" in preset

    def test_rpg_64_color_limit(self):
        assert STYLE_PRESETS["rpg"]["color_limit"] == 64

    def test_isometric_2_1_ratio(self):
        assert STYLE_PRESETS["isometric"]["grid_alignment"] == "isometric"

    def test_scifi_32_color_limit(self):
        assert STYLE_PRESETS["scifi"]["color_limit"] == 32


class TestStyleWeightedScoring:
    def test_rpg_style_weights(self):
        criteria = {"dimensions": True, "grid_alignment": True, "transparency": True, "palette": False}
        score = weighted_score_calculation(criteria, "rpg")
        assert score == 75

    def test_font_palette_heavy(self):
        criteria = {"dimensions": True, "transparency": True, "palette": False}
        score = weighted_score_calculation(criteria, "font")
        assert score == 60

    def test_isometric_grid_heavy(self):
        criteria = {"dimensions": True, "grid_alignment": False, "transparency": True, "palette": True}
        score = weighted_score_calculation(criteria, "isometric")
        assert score == 70


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])