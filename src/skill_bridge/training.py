from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    confusion_matrix,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from skill_bridge.preprocessing import (
    DROPPED_CORRELATED_FEATURES,
    MODEL_FEATURES,
    build_preprocessor,
)

ROOT = Path(__file__).resolve().parents[2]
RANDOM_STATE = 42


def load_dataset(data_dir: Path) -> pd.DataFrame:
    features = pd.read_csv(data_dir / "student_features.csv")
    targets = pd.read_csv(data_dir / "placement_targets.csv")
    merged = features.merge(targets, on="Student_ID", validate="one_to_one")
    if len(merged) != len(features) or len(merged) != len(targets):
        raise ValueError("Feature and target files do not contain matching students")
    return merged


def split_three_way(X, y, *, stratify: bool):
    stratify_target = y if stratify else None
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X,
        y,
        test_size=0.15,
        random_state=RANDOM_STATE,
        stratify=stratify_target,
    )
    train_val_stratify = y_train_val if stratify else None
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val,
        y_train_val,
        test_size=0.15 / 0.85,
        random_state=RANDOM_STATE,
        stratify=train_val_stratify,
    )
    return X_train, X_val, X_test, y_train, y_val, y_test


def classification_metrics(y_true, probability) -> dict[str, float | int]:
    prediction = (probability >= 0.5).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, prediction).ravel()
    return {
        "accuracy": accuracy_score(y_true, prediction),
        "precision": precision_score(y_true, prediction, zero_division=0),
        "recall": recall_score(y_true, prediction, zero_division=0),
        "f1": f1_score(y_true, prediction, zero_division=0),
        "roc_auc": roc_auc_score(y_true, probability),
        "average_precision": average_precision_score(y_true, probability),
        "true_negatives": int(tn),
        "false_positives": int(fp),
        "false_negatives": int(fn),
        "true_positives": int(tp),
    }


def regression_metrics(y_true, prediction) -> dict[str, float]:
    errors = np.asarray(y_true) - np.asarray(prediction)
    return {
        "rmse": float(np.sqrt(mean_squared_error(y_true, prediction))),
        "mae": mean_absolute_error(y_true, prediction),
        "r2": r2_score(y_true, prediction),
        "within_1_lpa": float((np.abs(errors) <= 1).mean() * 100),
        "within_2_lpa": float((np.abs(errors) <= 2).mean() * 100),
    }


def _json_ready(metrics: dict) -> dict:
    return {
        key: value.item() if isinstance(value, np.generic) else value
        for key, value in metrics.items()
    }


def train(data_dir: Path = ROOT / "data", output_dir: Path = ROOT / "models"):
    data = load_dataset(data_dir)
    X = data.drop(columns=["Student_ID", "placement_status", "salary_lpa"])

    placement_target = (data["placement_status"] == "Placed").astype(int)
    cls_split = split_three_way(X, placement_target, stratify=True)
    X_train, _, X_test, y_train, _, y_test = cls_split
    classifier = Pipeline(
        [
            ("preprocessor", build_preprocessor()),
            (
                "model",
                LogisticRegression(
                    C=1.0,
                    class_weight="balanced",
                    max_iter=1000,
                    l1_ratio=0,
                    random_state=RANDOM_STATE,
                    solver="saga",
                ),
            ),
        ]
    )
    classifier.fit(X_train, y_train)
    cls_metrics = classification_metrics(
        y_test, classifier.predict_proba(X_test)[:, 1]
    )

    placed = data[data["placement_status"] == "Placed"].reset_index(drop=True)
    salary_features = placed.drop(
        columns=["Student_ID", "placement_status", "salary_lpa"]
    )
    salary_target = placed["salary_lpa"]
    reg_split = split_three_way(salary_features, salary_target, stratify=False)
    X_train, _, X_test, y_train, _, y_test = reg_split
    regressor = Pipeline(
        [
            ("preprocessor", build_preprocessor()),
            ("model", Ridge(alpha=1.0)),
        ]
    )
    regressor.fit(X_train, y_train)
    reg_metrics = regression_metrics(y_test, regressor.predict(X_test))

    output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(classifier, output_dir / "placement_classifier.joblib")
    joblib.dump(regressor, output_dir / "salary_regressor.joblib")

    metadata = {
        "version": "1.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "random_state": RANDOM_STATE,
        "scikit_learn_version": sklearn.__version__,
        "records": {
            "classification": len(data),
            "regression": len(placed),
        },
        "algorithms": {
            "classification": "LogisticRegression",
            "regression": "Ridge",
        },
        "model_features": MODEL_FEATURES,
        "dropped_correlated_features": DROPPED_CORRELATED_FEATURES,
        "salary_bounds_lpa": [float(salary_target.min()), float(salary_target.max())],
        "classification_metrics": _json_ready(cls_metrics),
        "regression_metrics": _json_ready(reg_metrics),
    }
    (output_dir / "metadata.json").write_text(
        json.dumps(metadata, indent=2) + "\n", encoding="utf-8"
    )
    return metadata


def main():
    metadata = train()
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
