import pytest


@pytest.fixture
def student():
    return {
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
