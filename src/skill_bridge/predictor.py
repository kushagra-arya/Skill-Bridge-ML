from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Mapping

import joblib
import pandas as pd


@dataclass(frozen=True)
class PlacementPrediction:
    probability: float
    prediction: int
    label: str
    confidence: str


@dataclass(frozen=True)
class SalaryPrediction:
    predicted_salary_lpa: float
    salary_range_low: float
    salary_range_high: float


@dataclass(frozen=True)
class Prediction:
    placement: PlacementPrediction
    salary: SalaryPrediction | None

    def as_dict(self) -> dict[str, Any]:
        return {
            "success": True,
            "placement": asdict(self.placement),
            "salary": asdict(self.salary) if self.salary else None,
        }


class PlacementPredictor:
    def __init__(self, model_dir: str | Path):
        self.model_dir = Path(model_dir)
        self.metadata = json.loads(
            (self.model_dir / "metadata.json").read_text(encoding="utf-8")
        )
        self.classifier = joblib.load(self.model_dir / "placement_classifier.joblib")
        self.regressor = joblib.load(self.model_dir / "salary_regressor.joblib")

    @property
    def version(self) -> str:
        return self.metadata["version"]

    def predict_placement(self, student: Mapping[str, Any]) -> PlacementPrediction:
        frame = pd.DataFrame([dict(student)])
        probability = float(self.classifier.predict_proba(frame)[0, 1])
        prediction = int(probability >= 0.5)
        distance = abs(probability - 0.5)
        confidence = "high" if distance >= 0.3 else "medium" if distance >= 0.1 else "low"
        return PlacementPrediction(
            probability=round(probability, 4),
            prediction=prediction,
            label="Placed" if prediction else "Not Placed",
            confidence=confidence,
        )

    def predict_salary(self, student: Mapping[str, Any]) -> SalaryPrediction:
        frame = pd.DataFrame([dict(student)])
        prediction = float(self.regressor.predict(frame)[0])
        lower_bound, upper_bound = self.metadata["salary_bounds_lpa"]
        prediction = min(max(prediction, lower_bound), upper_bound)
        margin = self.metadata["regression_metrics"]["rmse"]
        return SalaryPrediction(
            predicted_salary_lpa=round(prediction, 2),
            salary_range_low=round(max(lower_bound, prediction - margin), 2),
            salary_range_high=round(min(upper_bound, prediction + margin), 2),
        )

    def predict(self, student: Mapping[str, Any]) -> Prediction:
        placement = self.predict_placement(student)
        salary = self.predict_salary(student) if placement.prediction else None
        return Prediction(placement=placement, salary=salary)

    def health(self) -> dict[str, Any]:
        return {
            "status": "healthy",
            "version": self.version,
            "models_loaded": {"classification": True, "regression": True},
        }
