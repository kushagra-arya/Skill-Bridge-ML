export interface StudentFeatures {
  gender: "Male" | "Female";
  branch: "CSE" | "ECE" | "IT" | "ME" | "CE";
  cgpa: number;
  tenth_percentage: number;
  twelfth_percentage: number;
  backlogs: number;
  study_hours_per_day: number;
  attendance_percentage: number;
  projects_completed: number;
  internships_completed: number;
  coding_skill_rating: number;
  communication_skill_rating: number;
  aptitude_skill_rating: number;
  hackathons_participated: number;
  certifications_count: number;
  sleep_hours: number;
  stress_level: number;
  part_time_job: "Yes" | "No";
  family_income_level: "Low" | "Medium" | "High";
  city_tier: "Tier 1" | "Tier 2" | "Tier 3";
  internet_access: "Yes" | "No";
  extracurricular_involvement: "Low" | "Medium" | "High";
}

export interface PlacementResult {
  probability: number;
  prediction: number;
  label: string;
  confidence: "low" | "medium" | "high";
}

export interface SalaryResult {
  predicted_salary_lpa: number;
  salary_range_low: number;
  salary_range_high: number;
}

export interface PredictionResponse {
  success: boolean;
  placement: PlacementResult;
  salary: SalaryResult | null;
}

export const defaultStudentFeatures: StudentFeatures = {
  gender: "" as StudentFeatures["gender"],
  branch: "" as StudentFeatures["branch"],
  cgpa: "" as unknown as number,
  tenth_percentage: "" as unknown as number,
  twelfth_percentage: "" as unknown as number,
  backlogs: "" as unknown as number,
  study_hours_per_day: "" as unknown as number,
  attendance_percentage: "" as unknown as number,
  projects_completed: "" as unknown as number,
  internships_completed: "" as unknown as number,
  coding_skill_rating: 3,
  communication_skill_rating: 3,
  aptitude_skill_rating: 3,
  hackathons_participated: "" as unknown as number,
  certifications_count: "" as unknown as number,
  sleep_hours: "" as unknown as number,
  stress_level: 5,
  part_time_job: "" as StudentFeatures["part_time_job"],
  family_income_level: "" as StudentFeatures["family_income_level"],
  city_tier: "" as StudentFeatures["city_tier"],
  internet_access: "" as StudentFeatures["internet_access"],
  extracurricular_involvement: "" as StudentFeatures["extracurricular_involvement"]
};
