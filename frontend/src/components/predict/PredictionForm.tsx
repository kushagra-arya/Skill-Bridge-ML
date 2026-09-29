"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { StudentFeatures } from "@/lib/types";
import { defaultStudentFeatures } from "@/lib/types";

interface PredictionFormProps {
  onSubmit: (data: StudentFeatures) => void;
  isLoading: boolean;
}

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const branchOptions = [
  { value: "CSE", label: "Computer Science (CSE)" },
  { value: "ECE", label: "Electronics & Comm (ECE)" },
  { value: "IT", label: "Information Technology (IT)" },
  { value: "ME", label: "Mechanical Engineering (ME)" },
  { value: "CE", label: "Civil Engineering (CE)" },
];

const yesNoOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const levelOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const cityTierOptions = [
  { value: "Tier 1", label: "Tier 1 (Metro)" },
  { value: "Tier 2", label: "Tier 2 (Urban)" },
  { value: "Tier 3", label: "Tier 3 (Semi-Urban)" },
];

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<StudentFeatures>(defaultStudentFeatures);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Personal Information" icon="👤">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
          />
          <SelectField
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            options={branchOptions}
          />
        </div>
      </FormSection>

      <FormSection title="Academic Performance" icon="📚">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberField
            label="CGPA"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            min={0}
            max={10}
            step={0.1}
            placeholder="e.g. 7.5"
            helper="/10"
          />
          <NumberField
            label="10th Percentage"
            name="tenth_percentage"
            value={formData.tenth_percentage}
            onChange={handleChange}
            min={0}
            max={100}
            step={0.5}
            placeholder="e.g. 85"
            helper="%"
          />
          <NumberField
            label="12th Percentage"
            name="twelfth_percentage"
            value={formData.twelfth_percentage}
            onChange={handleChange}
            min={0}
            max={100}
            step={0.5}
            placeholder="e.g. 80"
            helper="%"
          />
          <NumberField
            label="Backlogs"
            name="backlogs"
            value={formData.backlogs}
            onChange={handleChange}
            min={0}
            max={10}
            step={1}
            placeholder="e.g. 0"
          />
          <NumberField
            label="Study Hours/Day"
            name="study_hours_per_day"
            value={formData.study_hours_per_day}
            onChange={handleChange}
            min={0}
            max={16}
            step={0.5}
            placeholder="e.g. 4"
            helper="hrs"
          />
          <NumberField
            label="Attendance"
            name="attendance_percentage"
            value={formData.attendance_percentage}
            onChange={handleChange}
            min={0}
            max={100}
            step={1}
            placeholder="e.g. 75"
            helper="%"
          />
        </div>
      </FormSection>

      <FormSection title="Skills & Experience" icon="💼">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberField
            label="Projects Completed"
            name="projects_completed"
            value={formData.projects_completed}
            onChange={handleChange}
            min={0}
            max={20}
            step={1}
            placeholder="e.g. 3"
          />
          <NumberField
            label="Internships"
            name="internships_completed"
            value={formData.internships_completed}
            onChange={handleChange}
            min={0}
            max={10}
            step={1}
            placeholder="e.g. 1"
          />
          <NumberField
            label="Hackathons"
            name="hackathons_participated"
            value={formData.hackathons_participated}
            onChange={handleChange}
            min={0}
            max={20}
            step={1}
            placeholder="e.g. 2"
          />
          <NumberField
            label="Certifications"
            name="certifications_count"
            value={formData.certifications_count}
            onChange={handleChange}
            min={0}
            max={20}
            step={1}
            placeholder="e.g. 2"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-navy-700 mb-4">
            Skill Ratings (1 = Poor, 5 = Excellent)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <RatingField
              label="Coding Skills"
              name="coding_skill_rating"
              value={formData.coding_skill_rating}
              onChange={handleChange}
            />
            <RatingField
              label="Communication"
              name="communication_skill_rating"
              value={formData.communication_skill_rating}
              onChange={handleChange}
            />
            <RatingField
              label="Aptitude"
              name="aptitude_skill_rating"
              value={formData.aptitude_skill_rating}
              onChange={handleChange}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Lifestyle" icon="🌙">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberField
            label="Sleep Hours"
            name="sleep_hours"
            value={formData.sleep_hours}
            onChange={handleChange}
            min={3}
            max={12}
            step={0.5}
            placeholder="e.g. 7"
            helper="hrs"
          />
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              Stress Level
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                min={1}
                max={10}
                step={1}
                className="flex-1 h-2 bg-navy-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
              <span className="text-sm font-medium text-navy-900 w-8 text-center">
                {formData.stress_level}
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-1">1 = Low, 10 = High</p>
          </div>
          <SelectField
            label="Part-time Job"
            name="part_time_job"
            value={formData.part_time_job}
            onChange={handleChange}
            options={yesNoOptions}
          />
        </div>
      </FormSection>

      <FormSection title="Background" icon="🏠">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Family Income Level"
            name="family_income_level"
            value={formData.family_income_level}
            onChange={handleChange}
            options={levelOptions}
          />
          <SelectField
            label="City Tier"
            name="city_tier"
            value={formData.city_tier}
            onChange={handleChange}
            options={cityTierOptions}
          />
          <SelectField
            label="Internet Access"
            name="internet_access"
            value={formData.internet_access}
            onChange={handleChange}
            options={yesNoOptions}
          />
          <SelectField
            label="Extracurricular Involvement"
            name="extracurricular_involvement"
            value={formData.extracurricular_involvement}
            onChange={handleChange}
            options={levelOptions}
          />
        </div>
      </FormSection>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary btn-lg w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Get Prediction"
          )}
        </button>
      </div>
    </form>
  );
}

interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function FormSection({ title, icon, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function SelectField({ label, name, value, onChange, options, placeholder = "Select..." }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`w-full px-4 py-2.5 rounded-lg border border-navy-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-shadow ${value ? 'text-navy-900' : 'text-navy-900'}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  name: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  helper?: string;
  placeholder?: string;
}

function NumberField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  helper,
  placeholder,
}: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder || "Enter value"}
          required
          className={`w-full px-4 py-2.5 rounded-lg border border-navy-300 bg-white text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            helper ? "pr-12" : ""
          }`}
        />
        {helper && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy-400 pointer-events-none">
            {helper}
          </span>
        )}
      </div>
    </div>
  );
}

interface RatingFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function RatingField({ label, name, value, onChange }: RatingFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() =>
              onChange({
                target: { name, value: rating.toString(), type: "number" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              value >= rating
                ? "bg-brand-blue text-white"
                : "bg-navy-100 text-navy-600 hover:bg-navy-200"
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
