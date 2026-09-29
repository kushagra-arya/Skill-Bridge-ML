from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from skill_bridge import __version__
from skill_bridge.predictor import PlacementPredictor
from skill_bridge.schemas import (
    BatchRequest,
    BatchResponse,
    PlacementResult,
    PredictionResponse,
    SalaryResult,
    StudentFeatures,
)

ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = Path(os.getenv("MODEL_DIR", ROOT / "models"))
predictor: PlacementPredictor | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global predictor
    predictor = PlacementPredictor(MODEL_DIR)
    yield
    predictor = None


app = FastAPI(
    title="Skill Bridge Placement API",
    description="Placement probability and salary inference for engineering student profiles.",
    version=__version__,
    lifespan=lifespan,
)

origins = [
    value.strip()
    for value in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if value.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def get_predictor() -> PlacementPredictor:
    if predictor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Models are not loaded",
        )
    return predictor


@app.get("/")
def root():
    return {
        "name": "Skill Bridge Placement API",
        "version": __version__,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health(model: PlacementPredictor = Depends(get_predictor)):
    return model.health()


@app.get("/model/info")
def model_info(model: PlacementPredictor = Depends(get_predictor)):
    return model.metadata


@app.post("/predict", response_model=PredictionResponse)
def predict(
    student: StudentFeatures,
    model: PlacementPredictor = Depends(get_predictor),
):
    return model.predict(student.model_dump()).as_dict()


@app.post("/predict/placement", response_model=PlacementResult)
def predict_placement(
    student: StudentFeatures,
    model: PlacementPredictor = Depends(get_predictor),
):
    return model.predict_placement(student.model_dump())


@app.post("/predict/salary", response_model=SalaryResult)
def predict_salary(
    student: StudentFeatures,
    model: PlacementPredictor = Depends(get_predictor),
):
    return model.predict_salary(student.model_dump())


@app.post("/predict/batch", response_model=BatchResponse)
def predict_batch(
    request: BatchRequest,
    model: PlacementPredictor = Depends(get_predictor),
):
    predictions = [
        model.predict(student.model_dump()).as_dict() for student in request.students
    ]
    return {
        "success": True,
        "count": len(predictions),
        "predictions": predictions,
    }


def run():
    uvicorn.run("skill_bridge.api:app", host="0.0.0.0", port=8000)
