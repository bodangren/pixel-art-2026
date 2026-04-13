import unittest
import json
import os
from pathlib import Path
from PIL import Image
import tempfile


class TestDimensionValidation(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        
    def tearDown(self):
        for f in Path(self.temp_dir).glob("*.png"):
            f.unlink()
        Path(self.temp_dir).rmdir()
    
    def _create_image(self, path, size, mode="RGBA"):
        img = Image.new(mode, size)
        img.save(path)
        return path
    
    def test_3x3_sheet_correct_dimensions(self):
        from validate_run import validate_dimensions_3x3_sheet
        test_path = Path(self.temp_dir) / "test_3x3.png"
        self._create_image(test_path, (96, 96))
        result = validate_dimensions_3x3_sheet(str(test_path), expected_cell_size=32)
        self.assertTrue(result["valid"])
        self.assertEqual(result["dimensions"], {"width": 96, "height": 96})
    
    def test_3x3_sheet_wrong_dimensions(self):
        from validate_run import validate_dimensions_3x3_sheet
        test_path = Path(self.temp_dir) / "test_3x3_wrong.png"
        self._create_image(test_path, (64, 64))
        result = validate_dimensions_3x3_sheet(str(test_path), expected_cell_size=32)
        self.assertFalse(result["valid"])
        self.assertTrue(any("dimensions" in issue for issue in result["issues"]))
    
    def test_background_correct_dimensions(self):
        from validate_run import validate_dimensions_background
        test_path = Path(self.temp_dir) / "bg_512.png"
        self._create_image(test_path, (512, 512))
        result = validate_dimensions_background(str(test_path), expected_size=512)
        self.assertTrue(result["valid"])
    
    def test_background_wrong_dimensions(self):
        from validate_run import validate_dimensions_background
        test_path = Path(self.temp_dir) / "bg_wrong.png"
        self._create_image(test_path, (256, 256))
        result = validate_dimensions_background(str(test_path), expected_size=512)
        self.assertFalse(result["valid"])


class TestTransparencyValidation(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        
    def tearDown(self):
        for f in Path(self.temp_dir).glob("*.png"):
            f.unlink()
        Path(self.temp_dir).rmdir()
    
    def _create_image_with_alpha(self, path, size, has_transparency=False):
        if has_transparency:
            img = Image.new("RGBA", size)
            for x in range(size[0]):
                for y in range(size[1]):
                    if x < size[0] // 2 and y < size[1] // 2:
                        img.putpixel((x, y), (255, 0, 0, 0))
                    else:
                        img.putpixel((x, y), (255, 0, 0, 255))
        else:
            img = Image.new("RGB", size)
        img.save(path)
        return path
    
    def test_image_with_transparency(self):
        from validate_run import validate_transparency
        test_path = Path(self.temp_dir) / "transparent.png"
        self._create_image_with_alpha(test_path, (32, 32), has_transparency=True)
        result = validate_transparency(str(test_path))
        self.assertTrue(result["has_transparency"])
    
    def test_image_without_transparency(self):
        from validate_run import validate_transparency
        test_path = Path(self.temp_dir) / "opaque.png"
        self._create_image_with_alpha(test_path, (32, 32), has_transparency=False)
        result = validate_transparency(str(test_path))
        self.assertFalse(result["has_transparency"])


class TestGridAlignmentValidation(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        
    def tearDown(self):
        for f in Path(self.temp_dir).glob("*.png"):
            f.unlink()
        Path(self.temp_dir).rmdir()
    
    def _create_3x3_grid_image(self, path, cell_size=32):
        img = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
        for row in range(3):
            for col in range(3):
                x = col * cell_size + cell_size // 2
                y = row * cell_size + cell_size // 2
                for dx in range(-4, 5):
                    for dy in range(-4, 5):
                        if 0 <= x + dx < 96 and 0 <= y + dy < 96:
                            img.putpixel((x + dx, y + dy), (255, 0, 0, 255))
        img.save(path)
        return path
    
    def test_valid_3x3_grid_alignment(self):
        from validate_run import validate_grid_alignment
        test_path = Path(self.temp_dir) / "grid_valid.png"
        self._create_3x3_grid_image(test_path, cell_size=32)
        result = validate_grid_alignment(str(test_path), expected_cells=3)
        self.assertTrue(result["valid"])
        self.assertEqual(result["grid_cells"], {"cols": 3, "rows": 3})


class TestPaletteValidation(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        
    def tearDown(self):
        for f in Path(self.temp_dir).glob("*.png"):
            f.unlink()
        Path(self.temp_dir).rmdir()
    
    def _create_image_with_palette(self, path, colors):
        img = Image.new("RGBA", (32, 32))
        for i, color in enumerate(colors):
            for x in range(i * 8, (i + 1) * 8):
                for y in range(32):
                    img.putpixel((x, y), color)
        img.save(path)
        return path
    
    def test_palette_extraction(self):
        from validate_run import extract_palette
        test_path = Path(self.temp_dir) / "palette.png"
        colors = [(255, 0, 0, 255), (0, 255, 0, 255), (0, 0, 255, 255)]
        self._create_image_with_palette(test_path, colors)
        palette = extract_palette(str(test_path))
        self.assertGreaterEqual(len(palette), 3)
    
    def test_palette_hex_format(self):
        from validate_run import extract_palette
        test_path = Path(self.temp_dir) / "palette_hex.png"
        colors = [(255, 0, 0, 255)]
        self._create_image_with_palette(test_path, colors)
        palette = extract_palette(str(test_path))
        for color in palette:
            self.assertRegex(color, r"^#[0-9A-Fa-f]{6}$")


class TestValidationReportGeneration(unittest.TestCase):
    def test_report_structure(self):
        from validate_run import generate_validation_report
        report = generate_validation_report("test-run-id", [])
        self.assertIn("run_id", report)
        self.assertIn("validation_timestamp", report)
        self.assertIn("assets", report)
        self.assertIn("overall_score", report)
        self.assertIn("passed", report)


class TestWeightedScoring(unittest.TestCase):
    def test_default_weights_sum_to_100(self):
        from validate_run import DEFAULT_WEIGHTS
        total = sum(DEFAULT_WEIGHTS.values())
        self.assertEqual(total, 100)
    
    def test_score_asset_with_no_issues_returns_100(self):
        from validate_run import score_asset
        result = {"issues": []}
        self.assertEqual(score_asset(result), 100)
    
    def test_score_asset_with_all_major_issues_returns_10(self):
        from validate_run import score_asset
        result = {
            "issues": [
                "dimensions: wrong size",
                "grid: not aligned",
                "no alpha channel",
                "palette: too many colors"
            ]
        }
        self.assertEqual(score_asset(result), 10)
    
    def test_score_asset_deducts_correct_amounts(self):
        from validate_run import score_asset, DEFAULT_WEIGHTS
        result = {"issues": ["dimensions: wrong size"]}
        expected = 100 - DEFAULT_WEIGHTS["dimensions"]
        self.assertEqual(score_asset(result), expected)
    
    def test_weighted_score_calculation(self):
        from validate_run import weighted_score_calculation
        criteria = {
            "dimensions": True,
            "grid_alignment": True,
            "transparency": True,
            "palette_valid": True
        }
        score = weighted_score_calculation(criteria)
        self.assertEqual(score, 100)
    
    def test_weighted_score_with_failures(self):
        from validate_run import weighted_score_calculation
        criteria = {
            "dimensions": False,
            "grid_alignment": True,
            "transparency": True,
            "palette_valid": True
        }
        score = weighted_score_calculation(criteria)
        self.assertLess(score, 100)
        self.assertGreater(score, 0)


class TestPipelineIntegration(unittest.TestCase):
    def test_validation_report_has_expected_structure(self):
        from validate_run import generate_validation_report
        assets = [{
            "path": "/test/sheet.png",
            "type": "3x3-sheet",
            "dimensions": {"width": 96, "height": 96},
            "has_transparency": True,
            "palette": ["#FF0000"],
            "issues": [],
            "score": 100
        }]
        report = generate_validation_report("test-run", assets)
        self.assertIn("overall_score", report)
        self.assertIn("passed", report)
        self.assertTrue(report["passed"])

    def test_validation_report_fails_below_threshold(self):
        from validate_run import generate_validation_report
        assets = [{
            "path": "/test/sheet.png",
            "type": "3x3-sheet",
            "dimensions": {"width": 64, "height": 64},
            "has_transparency": False,
            "palette": ["#FF0000"],
            "issues": ["dimensions: wrong", "no alpha channel"],
            "score": 10
        }]
        report = generate_validation_report("test-run", assets)
        self.assertLess(report["overall_score"], 70)
        self.assertFalse(report["passed"])

    def test_multiple_assets_average_correctly(self):
        from validate_run import generate_validation_report
        assets = [
            {"path": "/test/sheet1.png", "score": 100, "issues": []},
            {"path": "/test/sheet2.png", "score": 50, "issues": []},
        ]
        report = generate_validation_report("test-run", assets)
        self.assertEqual(report["overall_score"], 75)


class TestCLIArgumentParsing(unittest.TestCase):
    def test_run_id_argument_required(self):
        import argparse
        from validate_run import main
        parser = argparse.ArgumentParser()
        parser.add_argument("run_id", help="Run ID to validate")
        parser.add_argument("--data-dir", default="data/runs")
        parser.add_argument("--output")
        parser.add_argument("--verbose", "-v", action="store_true")
        
        with self.assertRaises(SystemExit):
            parser.parse_args([])
    
    def test_verbose_flag_parses(self):
        import argparse
        parser = argparse.ArgumentParser()
        parser.add_argument("run_id")
        parser.add_argument("--verbose", "-v", action="store_true")
        
        args = parser.parse_args(["test-run", "--verbose"])
        self.assertTrue(args.verbose)
    
    def test_data_dir_default(self):
        import argparse
        parser = argparse.ArgumentParser()
        parser.add_argument("run_id")
        parser.add_argument("--data-dir", default="data/runs")
        
        args = parser.parse_args(["test-run"])
        self.assertEqual(args.data_dir, "data/runs")
    
    def test_output_option(self):
        import argparse
        parser = argparse.ArgumentParser()
        parser.add_argument("run_id")
        parser.add_argument("--output")
        
        args = parser.parse_args(["test-run", "--output", "report.json"])
        self.assertEqual(args.output, "report.json")


if __name__ == "__main__":
    unittest.main()