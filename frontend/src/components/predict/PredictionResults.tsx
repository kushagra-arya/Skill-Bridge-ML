"use client";

import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  IndianRupee,
  Target,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { PredictionResponse } from "@/lib/types";

interface PredictionResultsProps {
  result: PredictionResponse;
}

export function PredictionResults({ result }: PredictionResultsProps) {
  const { placement, salary } = result;
  const isPlaced = placement.prediction === 1;
  const probability = placement.probability * 100;

  return (
    <div className="space-y-6">
      <div
        className={`card p-6 border-l-4 ${
          isPlaced ? "border-l-emerald-500" : "border-l-red-500"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${
              isPlaced ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {isPlaced ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-navy-500 mb-1">Placement Prediction</p>
            <h3
              className={`text-2xl font-bold ${
                isPlaced ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {placement.label}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <ConfidenceBadge confidence={placement.confidence} />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-blue" />
            <h4 className="font-semibold text-navy-900">Placement Probability</h4>
          </div>
          <span className="text-2xl font-bold text-navy-900">
            {probability.toFixed(1)}%
          </span>
        </div>

        <div className="relative h-4 bg-navy-100 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${getProgressColor(
              probability
            )}`}
            style={{ width: `${probability}%` }}
          />
          <div className="absolute inset-y-0 left-[40%] w-px bg-navy-300" />
          <div className="absolute inset-y-0 left-[70%] w-px bg-navy-300" />
        </div>

        <div className="flex justify-between mt-2 text-xs text-navy-500">
          <span>0%</span>
          <span>40%</span>
          <span>70%</span>
          <span>100%</span>
        </div>

        <div className="flex justify-between mt-1 text-xs">
          <span className="text-red-500">Low</span>
          <span className="text-yellow-600">Medium</span>
          <span className="text-emerald-500">High</span>
        </div>
      </div>

      {salary && (
        <div className="card p-6 bg-gradient-to-br from-brand-blue/5 to-purple-500/5">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-5 w-5 text-brand-blue" />
            <h4 className="font-semibold text-navy-900">Expected Salary</h4>
          </div>

          <div className="text-center py-4">
            <div className="inline-flex items-center gap-1 text-4xl font-bold text-navy-900">
              <span className="text-2xl">₹</span>
              {salary.predicted_salary_lpa.toFixed(1)}
              <span className="text-lg font-normal text-navy-500">LPA</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-xl">
            <p className="text-sm text-navy-600 mb-3 text-center">
              Expected Range
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-xs text-navy-400">Min</p>
                <p className="text-lg font-semibold text-navy-700">
                  ₹{salary.salary_range_low.toFixed(1)} L
                </p>
              </div>
              <div className="flex-1 h-2 bg-navy-100 rounded-full max-w-[100px] relative">
                <div
                  className="absolute h-full bg-brand-blue rounded-full"
                  style={{
                    left: "0%",
                    right: "0%",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-blue rounded-full border-2 border-white shadow"
                  style={{
                    left: `${
                      ((salary.predicted_salary_lpa - salary.salary_range_low) /
                        (salary.salary_range_high - salary.salary_range_low)) *
                      100
                    }%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-navy-400">Max</p>
                <p className="text-lg font-semibold text-navy-700">
                  ₹{salary.salary_range_high.toFixed(1)} L
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!salary && (
        <div className="card p-6 bg-navy-50 border-navy-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-navy-500 mt-0.5" />
            <div>
              <p className="font-medium text-navy-700">
                Salary prediction not available
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Salary predictions are only provided when placement is likely.
                Focus on improving your profile to increase placement chances.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-brand-orange" />
          <h4 className="font-semibold text-navy-900">What This Means</h4>
        </div>
        <ul className="space-y-3">
          {getInsights(probability, isPlaced).map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <TrendingUp className="h-4 w-4 text-brand-blue mt-1 flex-shrink-0" />
              <span className="text-sm text-navy-600">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const colors = {
    low: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[confidence as keyof typeof colors]
      }`}
    >
      {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
    </span>
  );
}

function getProgressColor(probability: number): string {
  if (probability >= 70) return "bg-emerald-500";
  if (probability >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function getInsights(probability: number, isPlaced: boolean): string[] {
  if (isPlaced && probability >= 70) {
    return [
      "Your profile is well-aligned with placement requirements.",
      "Continue building on your strengths in academics and skills.",
      "Consider targeting higher-tier companies with your strong profile.",
      "Mock interviews and communication practice can further boost success.",
    ];
  }

  if (isPlaced && probability >= 40) {
    return [
      "You have a moderate chance of placement with room for improvement.",
      "Focus on gaining more practical experience through projects.",
      "Consider additional certifications in your domain.",
      "Improving soft skills could significantly boost your chances.",
    ];
  }

  return [
    "Your current profile needs improvement for competitive placements.",
    "Prioritize increasing your CGPA and clearing any backlogs.",
    "Gain hands-on experience through internships and projects.",
    "Use the lower-scoring profile areas to prioritize practical improvements.",
  ];
}
