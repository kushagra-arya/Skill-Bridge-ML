import type { PredictionResponse, StudentFeatures } from "./types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail;
    const message = typeof detail === "string" ? detail : "The prediction request failed.";
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

export const api = {
  async predict(data: StudentFeatures): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return parseResponse<PredictionResponse>(response);
  }
};
