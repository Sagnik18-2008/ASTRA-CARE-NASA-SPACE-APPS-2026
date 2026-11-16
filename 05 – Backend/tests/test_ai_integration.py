import json
import math
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

from ai_models.inference import (
    FeatureInputError,
    ModelUnavailableError,
    predict_cluster,
    validate_feature_payload,
)
import main


FEATURE_COLUMNS_PATH = (
    Path(__file__).resolve().parents[1]
    / "ai_models"
    / "feature_columns.json"
)


def feature_payload(value=1.0):
    with FEATURE_COLUMNS_PATH.open(encoding="utf-8-sig") as feature_file:
        columns = json.load(feature_file)
    return {column: value for column in columns}


class FeatureValidationTests(unittest.TestCase):
    def test_orders_all_features_and_tracks_null_measurements(self):
        features = feature_payload()
        features["AGP"] = None
        ordered, imputed = validate_feature_payload(features)

        self.assertEqual(len(ordered), 28)
        self.assertIsNone(ordered[0])
        self.assertEqual(imputed, ("AGP",))

    def test_rejects_missing_or_unknown_feature_keys(self):
        features = feature_payload()
        del features["AGP"]
        features["unknown"] = 1.0

        with self.assertRaises(FeatureInputError):
            validate_feature_payload(features)

    def test_rejects_negative_non_numeric_and_non_finite_values(self):
        for value in (-0.1, "1.0", True, math.inf, math.nan):
            with self.subTest(value=value):
                features = feature_payload()
                features["AGP"] = value
                with self.assertRaises(FeatureInputError):
                    validate_feature_payload(features)

    def test_rejects_an_entirely_missing_input_row(self):
        with self.assertRaises(FeatureInputError):
            validate_feature_payload(feature_payload(value=None))


class TrainedArtifactTests(unittest.TestCase):
    def test_saved_pipeline_matches_training_assignment(self):
        import pandas

        repository_root = Path(__file__).resolve().parents[2]
        with FEATURE_COLUMNS_PATH.open(encoding="utf-8-sig") as feature_file:
            columns = json.load(feature_file)
        input_path = (
            repository_root
            / "ai-ml models"
            / "data"
            / "processed"
            / "integrated_wide.csv"
        )
        assignments_path = (
            repository_root
            / "ai-ml models"
            / "data"
            / "processed"
            / "cluster_assignments.csv"
        )
        input_row = pandas.read_csv(input_path).iloc[0]
        expected_cluster = int(
            pandas.read_csv(assignments_path).iloc[0]["Cluster"]
        )

        result = predict_cluster({
            column: float(input_row[column])
            for column in columns
        })

        self.assertEqual(result["cluster_label"], expected_cluster)
        self.assertEqual(result["imputed_features"], [])

    def test_saved_imputer_handles_and_reports_null_measurement(self):
        import pandas

        repository_root = Path(__file__).resolve().parents[2]
        with FEATURE_COLUMNS_PATH.open(encoding="utf-8-sig") as feature_file:
            columns = json.load(feature_file)
        input_path = (
            repository_root
            / "ai-ml models"
            / "data"
            / "processed"
            / "integrated_wide.csv"
        )
        input_row = pandas.read_csv(input_path).iloc[0]
        features = {
            column: float(input_row[column])
            for column in columns
        }
        features[columns[0]] = None

        result = predict_cluster(features)

        self.assertEqual(result["imputed_features"], [columns[0]])


class AnalysisInferenceRouteTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)

    def test_health_endpoints_remain_available(self):
        self.assertEqual(self.client.get("/").status_code, 200)
        self.assertEqual(self.client.get("/health").status_code, 200)

    def test_negative_feature_is_rejected_before_inference(self):
        features = feature_payload()
        features["AGP"] = -1

        with patch("main.ensure_astronaut_exists") as ensure:
            response = self.client.post(
                "/api/analysis/predict",
                json={"astronaut_id": 1, "features": features},
            )

        self.assertEqual(response.status_code, 422)
        ensure.assert_not_called()

    def test_incomplete_feature_set_is_rejected_before_database_access(self):
        features = feature_payload()
        del features["AGP"]

        with patch("main.ensure_astronaut_exists") as ensure:
            response = self.client.post(
                "/api/analysis/predict",
                json={"astronaut_id": 1, "features": features},
            )

        self.assertEqual(response.status_code, 422)
        ensure.assert_not_called()

    def test_missing_measurement_is_rejected_before_inference(self):
        features = feature_payload()
        features["AGP"] = None

        with (
            patch("main.ensure_astronaut_exists") as ensure,
            patch("ai_models.inference.predict_cluster") as predict,
        ):
            response = self.client.post(
                "/api/analysis/predict",
                json={"astronaut_id": 1, "features": features},
            )

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["detail"]["code"], "insufficient_features")
        self.assertEqual(response.json()["detail"]["missing_features"], ["AGP"])
        ensure.assert_not_called()
        predict.assert_not_called()

    def test_complete_feature_values_require_sample_provenance(self):
        with patch("main.ensure_astronaut_exists") as ensure:
            response = self.client.post(
                "/api/analysis/predict",
                json={"astronaut_id": 1, "features": feature_payload()},
            )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(
            response.json()["detail"]["code"],
            "sample_provenance_unavailable",
        )
        ensure.assert_not_called()

    def test_existing_analysis_save_endpoint_keeps_its_behavior(self):
        inserted = {}

        class FakeQuery:
            def insert(self, payload):
                inserted.update(payload)
                return self

            def execute(self):
                return SimpleNamespace(data=[{"id": 9, **inserted}])

        class FakeSupabase:
            def table(self, table_name):
                self.table_name = table_name
                return FakeQuery()

        with (
            patch("main.ensure_astronaut_exists"),
            patch.object(main, "supabase", FakeSupabase()),
        ):
            response = self.client.post(
                "/api/analysis",
                json={
                    "astronaut_id": 1,
                    "model_name": "manual",
                    "result_type": "test",
                    "score": 0.5,
                    "prediction": "example",
                },
            )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["id"], 9)
        self.assertEqual(inserted["model_name"], "manual")
        self.assertEqual(inserted["prediction"], "example")

    def test_existing_analysis_get_endpoint_keeps_its_behavior(self):
        row = {
            "id": 9,
            "astronaut_id": 1,
            "model_name": "manual",
            "result_type": "test",
            "prediction": "example",
        }

        class FakeQuery:
            def select(self, fields):
                return self

            def eq(self, column, value):
                return self

            def order(self, column, desc=False):
                return self

            def limit(self, count):
                return self

            def execute(self):
                return SimpleNamespace(data=[row])

        class FakeSupabase:
            def table(self, table_name):
                self.table_name = table_name
                return FakeQuery()

        with patch.object(main, "supabase", FakeSupabase()):
            response = self.client.get("/api/analysis/1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [row])
