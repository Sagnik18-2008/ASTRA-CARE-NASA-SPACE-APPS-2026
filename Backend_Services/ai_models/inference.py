import json
import math
from dataclasses import dataclass
from functools import lru_cache
from numbers import Real
from pathlib import Path
from typing import Any, Mapping, Optional, Tuple


MODEL_DIRECTORY = Path(__file__).resolve().parent
EXPECTED_FEATURE_COUNT = 28
EXPECTED_JOBLIB_VERSION = "1.6.0"
EXPECTED_SCIKIT_LEARN_VERSION = "1.6.1"


class FeatureInputError(ValueError):
    pass


class ModelUnavailableError(RuntimeError):
    pass


@dataclass(frozen=True)
class ModelBundle:
    feature_columns: Tuple[str, ...]
    imputer: Any
    scaler: Any
    kmeans: Any
    numpy: Any
    pandas: Any


def _read_feature_columns() -> Tuple[str, ...]:
    path = MODEL_DIRECTORY / "feature_columns.json"

    try:
        with path.open(encoding="utf-8-sig") as feature_file:
            columns = json.load(feature_file)
    except (OSError, json.JSONDecodeError) as exc:
        raise ModelUnavailableError(
            "The model feature list could not be loaded."
        ) from exc

    if (
        not isinstance(columns, list)
        or len(columns) != EXPECTED_FEATURE_COUNT
        or any(not isinstance(column, str) or not column for column in columns)
        or len(set(columns)) != EXPECTED_FEATURE_COUNT
    ):
        raise ModelUnavailableError(
            "The model feature list must contain 28 unique feature names."
        )

    return tuple(columns)


def validate_feature_payload(
    features: Mapping[str, Optional[Real]],
) -> Tuple[Tuple[Optional[float], ...], Tuple[str, ...]]:
    if not isinstance(features, Mapping):
        raise FeatureInputError("features must be an object keyed by biomarker name.")

    columns = _read_feature_columns()
    provided = set(features)
    expected = set(columns)
    missing = [column for column in columns if column not in provided]
    extra = sorted(provided - expected)

    if missing or extra:
        details = []
        if missing:
            details.append("missing feature keys: " + ", ".join(missing))
        if extra:
            details.append("unknown feature keys: " + ", ".join(extra))
        raise FeatureInputError("; ".join(details))

    ordered_values = []
    imputed_features = []

    for column in columns:
        value = features[column]

        if value is None:
            ordered_values.append(None)
            imputed_features.append(column)
            continue

        if isinstance(value, bool) or not isinstance(value, Real):
            raise FeatureInputError(
                f"{column} must be a non-negative number or null."
            )

        numeric_value = float(value)
        if not math.isfinite(numeric_value):
            raise FeatureInputError(f"{column} must be finite.")
        if numeric_value < 0:
            raise FeatureInputError(f"{column} must not be negative.")

        ordered_values.append(numeric_value)

    if len(imputed_features) == EXPECTED_FEATURE_COUNT:
        raise FeatureInputError(
            "At least one measured biomarker feature is required."
        )

    return tuple(ordered_values), tuple(imputed_features)


@lru_cache(maxsize=1)
def _load_model_bundle() -> ModelBundle:
    feature_columns = _read_feature_columns()

    try:
        import joblib
        import numpy
        import pandas
        import sklearn
    except ImportError as exc:
        raise ModelUnavailableError(
            "AI/ML dependencies are not installed in the backend environment."
        ) from exc

    if joblib.__version__ != EXPECTED_JOBLIB_VERSION:
        raise ModelUnavailableError(
            f"Saved artifacts require joblib {EXPECTED_JOBLIB_VERSION}; "
            f"found {joblib.__version__}."
        )
    if sklearn.__version__ != EXPECTED_SCIKIT_LEARN_VERSION:
        raise ModelUnavailableError(
            "Saved artifacts require scikit-learn "
            f"{EXPECTED_SCIKIT_LEARN_VERSION}; found {sklearn.__version__}."
        )

    artifact_paths = {
        "imputer": MODEL_DIRECTORY / "median_imputer.joblib",
        "scaler": MODEL_DIRECTORY / "standard_scaler.joblib",
        "kmeans": MODEL_DIRECTORY / "kmeans_model.joblib",
    }

    try:
        models = {
            name: joblib.load(path)
            for name, path in artifact_paths.items()
        }
    except FileNotFoundError as exc:
        raise ModelUnavailableError(
            "A required AI/ML model artifact is missing."
        ) from exc
    except (AttributeError, EOFError, ImportError, ValueError) as exc:
        raise ModelUnavailableError(
            "A saved model artifact could not be loaded with this runtime."
        ) from exc

    for name, model in models.items():
        feature_count = getattr(model, "n_features_in_", None)
        if feature_count != len(feature_columns):
            raise ModelUnavailableError(
                f"The saved {name} artifact does not accept "
                f"{len(feature_columns)} features."
            )

    for name, model in models.items():
        model_columns = getattr(model, "feature_names_in_", None)
        if model_columns is not None and tuple(model_columns) != feature_columns:
            raise ModelUnavailableError(
                f"The {name} feature order does not match "
                "feature_columns.json."
            )

    if not getattr(models["kmeans"], "n_clusters", None):
        raise ModelUnavailableError(
            "The saved KMeans artifact does not expose its cluster count."
        )

    return ModelBundle(
        feature_columns=feature_columns,
        imputer=models["imputer"],
        scaler=models["scaler"],
        kmeans=models["kmeans"],
        numpy=numpy,
        pandas=pandas,
    )


def predict_cluster(
    features: Mapping[str, Optional[Real]],
) -> dict:
    ordered_values, imputed_features = validate_feature_payload(features)
    bundle = _load_model_bundle()

    raw_features = bundle.pandas.DataFrame(
        [ordered_values],
        columns=bundle.feature_columns,
        dtype=float,
    )
    imputed = bundle.imputer.transform(raw_features)
    imputed_frame = bundle.pandas.DataFrame(
        imputed,
        columns=bundle.feature_columns,
    )
    log_transformed = bundle.numpy.log1p(imputed_frame)

    if not bundle.numpy.isfinite(log_transformed.to_numpy()).all():
        raise ModelUnavailableError(
            "Preprocessing produced non-finite model input."
        )

    standardized = bundle.scaler.transform(log_transformed)
    standardized_frame = bundle.pandas.DataFrame(
        standardized,
        columns=bundle.feature_columns,
    )
    prediction = bundle.kmeans.predict(standardized_frame)

    if len(prediction) != 1:
        raise ModelUnavailableError(
            "KMeans returned an unexpected number of cluster labels."
        )

    return {
        "cluster_label": int(prediction[0]),
        "imputed_features": list(imputed_features),
        "model_name": f"KMeans (k={bundle.kmeans.n_clusters})",
    }
