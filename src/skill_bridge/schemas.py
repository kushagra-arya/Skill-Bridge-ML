from typing import Literal

from pydantic import BaseModel, Field


class StudentFeatures(BaseModel):
    gender: Literal["Male", "Female"]
    branch: Literal["CSE", "ECE", "IT", "ME", "CE"]
    cgpa: float = Field(ge=0, le=10)
    tenth_percentage: float = Field(ge=0, le=100)
    twelfth_percentage: float = Field(ge=0, le=100)
    backlogs: int = Field(ge=0, le=10)
    study_hours_per_day: float = Field(ge=0, le=24)
    attendance_percentage: float = Field(ge=0, le=100)
    projects_completed: int = Field(ge=0, le=20)
    internships_completed: int = Field(ge=0, le=10)
    coding_skill_rating: int = Field(ge=1, le=5)
    communication_skill_rating: int = Field(ge=1, le=5)
    aptitude_skill_rating: int = Field(ge=1, le=5)
    hackathons_participated: int = Field(ge=0, le=20)
    certifications_count: int = Field(ge=0, le=20)
    sleep_hours: float = Field(ge=0, le=24)
    stress_level: int = Field(ge=1, le=10)
    part_time_job: Literal["Yes", "No"]
    family_income_level: Literal["Low", "Medium", "High"]
    city_tier: Literal["Tier 1", "Tier 2", "Tier 3"]
    internet_access: Literal["Yes", "No"]
    extracurricular_involvement: Literal["Low", "Medium", "High"]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "gender": "Female",
                    "branch": "CSE",
                    "cgpa": 8.4,
                    "tenth_percentage": 86,
                    "twelfth_percentage": 83,
                    "backlogs": 0,
                    "study_hours_per_day": 5,
                    "attendance_percentage": 82,
                    "projects_completed": 5,
                    "internships_completed": 2,
                    "coding_skill_rating": 4,
                    "communication_skill_rating": 4,
                    "aptitude_skill_rating": 4,
                    "hackathons_participated": 3,
                    "certifications_count": 3,
                    "sleep_hours": 7,
                    "stress_level": 5,
                    "part_time_job": "No",
                    "family_income_level": "Medium",
                    "city_tier": "Tier 1",
                    "internet_access": "Yes",
                    "extracurricular_involvement": "High",
                }
            ]
        }
    }


class PlacementResult(BaseModel):
    probability: float
    prediction: int
    label: str
    confidence: Literal["low", "medium", "high"]


class SalaryResult(BaseModel):
    predicted_salary_lpa: float
    salary_range_low: float
    salary_range_high: float


class PredictionResponse(BaseModel):
    success: bool
    placement: PlacementResult
    salary: SalaryResult | None


class BatchRequest(BaseModel):
    students: list[StudentFeatures] = Field(min_length=1, max_length=100)


class BatchResponse(BaseModel):
    success: bool
    count: int
    predictions: list[PredictionResponse]
