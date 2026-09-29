from __future__ import annotations

import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

NUMERIC_FEATURES = [
    "cgpa",
    "backlogs",
    "coding_skill_rating",
    "communication_skill_rating",
    "aptitude_skill_rating",
    "internships_completed",
    "hackathons_participated",
    "certifications_count",
    "study_hours_per_day",
    "attendance_percentage",
    "sleep_hours",
    "stress_level",
]
BINARY_FEATURES = ["gender", "part_time_job", "internet_access"]
NOMINAL_FEATURES = ["branch"]
ORDINAL_FEATURES = [
    "family_income_level",
    "city_tier",
    "extracurricular_involvement",
]
ORDINAL_CATEGORIES = [
    ["Low", "Medium", "High"],
    ["Tier 3", "Tier 2", "Tier 1"],
    ["Low", "Medium", "High"],
]
MODEL_FEATURES = (
    NUMERIC_FEATURES + BINARY_FEATURES + NOMINAL_FEATURES + ORDINAL_FEATURES
)
DROPPED_CORRELATED_FEATURES = [
    "tenth_percentage",
    "twelfth_percentage",
    "projects_completed",
]


class OutlierClipper(BaseEstimator, TransformerMixin):
    """Clip each numeric column to bounds learned from the training split."""

    def __init__(self, factor: float = 1.5):
        self.factor = factor

    def fit(self, X, y=None):
        values = np.asarray(X, dtype=float)
        q1 = np.nanquantile(values, 0.25, axis=0)
        q3 = np.nanquantile(values, 0.75, axis=0)
        spread = q3 - q1
        self.lower_bounds_ = q1 - self.factor * spread
        self.upper_bounds_ = q3 + self.factor * spread
        return self

    def transform(self, X):
        return np.clip(
            np.asarray(X, dtype=float), self.lower_bounds_, self.upper_bounds_
        )

    def get_feature_names_out(self, input_features=None):
        return np.asarray(input_features, dtype=object)


def build_preprocessor() -> ColumnTransformer:
    numeric = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="median")),
            ("outlier_clipper", OutlierClipper()),
            ("scaler", StandardScaler()),
        ]
    )
    binary = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1),
            ),
        ]
    )
    nominal = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OneHotEncoder(
                    drop="first", handle_unknown="ignore", sparse_output=False
                ),
            ),
        ]
    )
    ordinal = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            (
                "encoder",
                OrdinalEncoder(
                    categories=ORDINAL_CATEGORIES,
                    handle_unknown="use_encoded_value",
                    unknown_value=-1,
                ),
            ),
        ]
    )

    return ColumnTransformer(
        [
            ("numeric", numeric, NUMERIC_FEATURES),
            ("binary", binary, BINARY_FEATURES),
            ("nominal", nominal, NOMINAL_FEATURES),
            ("ordinal", ordinal, ORDINAL_FEATURES),
        ],
        remainder="drop",
    )
