import unittest
import json
import tempfile
from pathlib import Path
from PIL import Image


class TestJsonValidation(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        for f in Path(self.temp_dir).glob("**/*"):
            if f.is_file():
                f.unlink()
        Path(self.temp_dir).rmdir()

    def test_valid_json_file(self):
        from validate_run_completeness import validate_json_file
        json_path = Path(self.temp_dir) / "test.json"
        with open(json_path, "w") as f:
            json.dump({"key": "value"}, f)
        result = validate_json_file(json_path)
        self.assertTrue(result["valid"])
        self.assertTrue(result["exists"])

    def test_missing_json_file(self):
        from validate_run_completeness import validate_json_file
        json_path = Path(self.temp_dir) / "missing.json"
        result = validate_json_file(json_path)
        self.assertFalse(result["valid"])
        self.assertFalse(result["exists"])
        self.assertIn("not found", result["issues"][0])

    def test_invalid_json_file(self):
        from validate_run_completeness import validate_json_file
        json_path = Path(self.temp_dir) / "invalid.json"
        with open(json_path, "w") as f:
            f.write("{ invalid json }")
        result = validate_json_file(json_path)
        self.assertFalse(result["valid"])
        self.assertTrue(result["exists"])
        self.assertTrue(any("Invalid JSON" in issue for issue in result["issues"]))


class TestAssetFileValidation(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        for f in Path(self.temp_dir).glob("**/*"):
            if f.is_file():
                f.unlink()
        Path(self.temp_dir).rmdir()

    def _create_image(self, path, size_bytes=None):
        img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
        img.save(path)
        if size_bytes is not None:
            with open(path, "r+b") as f:
                f.truncate(size_bytes)
        return path

    def test_valid_sized_asset(self):
        from validate_run_completeness import validate_asset_file, MIN_FILE_SIZE_BYTES
        test_path = Path(self.temp_dir) / "valid.png"
        self._create_image(test_path, 2048)
        result = validate_asset_file(test_path)
        self.assertTrue(result["valid"])
        self.assertTrue(result["exists"])
        self.assertEqual(result["size_bytes"], 2048)

    def test_small_asset_rejected(self):
        from validate_run_completeness import validate_asset_file, MIN_FILE_SIZE_BYTES
        test_path = Path(self.temp_dir) / "small.png"
        self._create_image(test_path, 223)
        result = validate_asset_file(test_path)
        self.assertFalse(result["valid"])
        self.assertTrue(result["exists"])
        self.assertEqual(result["size_bytes"], 223)
        self.assertTrue(any("too small" in issue.lower() for issue in result["issues"]))

    def test_missing_asset(self):
        from validate_run_completeness import validate_asset_file
        test_path = Path(self.temp_dir) / "missing.png"
        result = validate_asset_file(test_path)
        self.assertFalse(result["valid"])
        self.assertFalse(result["exists"])
        self.assertIn("not found", result["issues"][0])


class TestRunCompleteness(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.run_id = "test-model__2026-04-04__initial"
        self.run_path = Path(self.temp_dir) / self.run_id
        self.run_path.mkdir()
        (self.run_path / "assets").mkdir()

    def tearDown(self):
        import shutil
        shutil.rmtree(self.temp_dir)

    def _create_asset(self, name, size):
        path = self.run_path / "assets" / name
        img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
        img.save(path)
        with open(path, "r+b") as f:
            f.truncate(size)
        return path

    def _create_run_json(self, asset_names):
        run_data = {
            "run_id": self.run_id,
            "model_id": "test-model",
            "asset_file_paths": {
                name: f"data/runs/{self.run_id}/assets/{name}"
                for name in asset_names
            }
        }
        with open(self.run_path / "run.json", "w") as f:
            json.dump(run_data, f)

    def test_complete_run_passes(self):
        from validate_run_completeness import validate_run_completeness
        self._create_run_json(["background.png", "hero-3x3-sheet.png"])
        self._create_asset("background.png", 2048)
        self._create_asset("hero-3x3-sheet.png", 1444)
        result = validate_run_completeness(self.run_id, self.temp_dir)
        self.assertTrue(result["passed"])
        self.assertEqual(result["expected_asset_count"], 2)
        self.assertEqual(result["actual_asset_count"], 2)
        self.assertEqual(len(result["missing_assets"]), 0)
        self.assertEqual(len(result["small_assets"]), 0)

    def test_missing_asset_fails(self):
        from validate_run_completeness import validate_run_completeness
        self._create_run_json(["background.png", "hero-3x3-sheet.png"])
        self._create_asset("background.png", 2048)
        result = validate_run_completeness(self.run_id, self.temp_dir)
        self.assertFalse(result["passed"])
        self.assertIn("hero-3x3-sheet.png", result["missing_assets"])

    def test_small_asset_fails(self):
        from validate_run_completeness import validate_run_completeness
        self._create_run_json(["background.png", "hero-3x3-sheet.png"])
        self._create_asset("background.png", 2048)
        self._create_asset("hero-3x3-sheet.png", 223)
        result = validate_run_completeness(self.run_id, self.temp_dir)
        self.assertFalse(result["passed"])
        self.assertIn("hero-3x3-sheet.png", result["small_assets"])

    def test_missing_run_json_fails(self):
        from validate_run_completeness import validate_run_completeness
        self._create_asset("background.png", 2048)
        result = validate_run_completeness(self.run_id, self.temp_dir)
        self.assertFalse(result["passed"])
        self.assertFalse(result["run_json"]["exists"])

    def test_invalid_run_json_fails(self):
        from validate_run_completeness import validate_run_completeness
        run_json = self.run_path / "run.json"
        with open(run_json, "w") as f:
            f.write("{ invalid }")
        result = validate_run_completeness(self.run_id, self.temp_dir)
        self.assertFalse(result["passed"])
        self.assertFalse(result["run_json"]["valid"])

    def test_model_id_extracted(self):
        from validate_run_completeness import validate_run_completeness
        self._create_run_json(["background.png"])
        self._create_asset("background.png", 2048)
        result = validate_run_completeness(self.run_id, self.temp_dir)
        self.assertEqual(result["model_id"], "test-model")


class TestValidateAllRuns(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.runs_dir = Path(self.temp_dir) / "runs"
        self.runs_dir.mkdir()

    def tearDown(self):
        import shutil
        shutil.rmtree(self.temp_dir)

    def _create_run(self, run_id, model_id, assets):
        run_path = self.runs_dir / run_id
        run_path.mkdir()
        assets_dir = run_path / "assets"
        assets_dir.mkdir()
        run_data = {
            "run_id": run_id,
            "model_id": model_id,
            "asset_file_paths": {
                f"{name}.png": f"data/runs/{run_id}/assets/{name}.png"
                for name in assets.keys()
            }
        }
        with open(run_path / "run.json", "w") as f:
            json.dump(run_data, f)
        for name, size in assets.items():
            img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
            img.save(assets_dir / f"{name}.png")
            with open(assets_dir / f"{name}.png", "r+b") as f:
                f.truncate(size)

    def test_multiple_runs_summarized(self):
        from validate_run_completeness import validate_all_runs
        self._create_run("model-a__2026-04-04__r1", "model-a", {"bg": 2048, "hero": 1444})
        self._create_run("model-b__2026-04-04__r1", "model-b", {"bg": 2048, "hero": 223})
        result = validate_all_runs(str(self.runs_dir))
        self.assertEqual(result["runs_validated"], 2)
        self.assertEqual(result["runs_passed"], 1)
        self.assertEqual(result["runs_failed"], 1)
        self.assertIn("model-a", result["model_summary"])
        self.assertIn("model-b", result["model_summary"])

    def test_empty_data_dir(self):
        from validate_run_completeness import validate_all_runs
        empty_dir = Path(self.temp_dir) / "empty"
        empty_dir.mkdir()
        result = validate_all_runs(str(empty_dir))
        self.assertEqual(result["runs_validated"], 0)


class TestReportGeneration(unittest.TestCase):
    def test_summary_report_format(self):
        from validate_run_completeness import generate_summary_report
        result = {
            "data_dir": "data/runs",
            "validation_timestamp": "2026-05-07T00:00:00Z",
            "runs_validated": 2,
            "runs_passed": 1,
            "runs_failed": 1,
            "model_summary": {
                "model-a": {"total": 1, "passed": 1, "failed": 0},
                "model-b": {"total": 1, "passed": 0, "failed": 1}
            },
            "runs": [
                {
                    "run_id": "model-a__2026-04-04__r1",
                    "model_id": "model-a",
                    "passed": True,
                    "issues": [],
                    "missing_assets": [],
                    "small_assets": []
                },
                {
                    "run_id": "model-b__2026-04-04__r1",
                    "model_id": "model-b",
                    "passed": False,
                    "issues": ["Small/broken assets"],
                    "missing_assets": [],
                    "small_assets": ["hero-3x3-sheet.png"]
                }
            ]
        }
        report = generate_summary_report(result)
        self.assertIn("RUN COMPLETENESS VALIDATION REPORT", report)
        self.assertIn("Total Runs: 2", report)
        self.assertIn("Passed: 1", report)
        self.assertIn("Failed: 1", report)
        self.assertIn("FAILED RUNS", report)
        self.assertIn("model-b__2026-04-04__r1", report)


if __name__ == "__main__":
    unittest.main()