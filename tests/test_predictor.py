from pathlib import Path

from skill_bridge.predictor import PlacementPredictor


def test_prediction_contract(student):
    model_dir = Path(__file__).resolve().parents[1] / "models"
    result = PlacementPredictor(model_dir).predict(student)

    assert 0 <= result.placement.probability <= 1
    assert result.placement.prediction in (0, 1)
    assert result.placement.label in ("Placed", "Not Placed")
    if result.salary:
        assert result.salary.salary_range_low <= result.salary.predicted_salary_lpa
        assert result.salary.predicted_salary_lpa <= result.salary.salary_range_high
