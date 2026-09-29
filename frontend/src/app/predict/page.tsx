"use client";

import { AlertCircle, ArrowLeft, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PredictionForm } from "@/components/predict/PredictionForm";
import { PredictionResults } from "@/components/predict/PredictionResults";
import { api, ApiError } from "@/lib/api";
import type { PredictionResponse, StudentFeatures } from "@/lib/types";

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(profile: StudentFeatures) {
    setLoading(true);
    setError(null);
    try {
      setResult(await api.predict(profile));
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not reach the API. Confirm that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy-50">
      <section className="bg-navy-900 text-white">
        <div className="container-main py-12">
          <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm text-navy-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to overview
          </Link>
          <h1 className="text-4xl font-bold text-white">Placement prediction</h1>
          <p className="mt-3 max-w-2xl text-navy-300">
            Complete the profile below to estimate placement probability and, when placement is likely,
            an expected salary range. Results are model estimates and should not be treated as guarantees.
          </p>
        </div>
      </section>

      <div className="container-main grid gap-8 py-8 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-brand-blue/10 p-2"><FileText className="h-5 w-5 text-brand-blue" /></div>
            <div><h2>Student profile</h2><p className="text-sm text-navy-500">All fields are required.</p></div>
          </div>
          <PredictionForm onSubmit={submit} isLoading={loading} />
        </section>

        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            {error && (
              <div className="card mb-5 border-l-4 border-l-red-500 bg-red-50 p-5">
                <div className="flex gap-3"><AlertCircle className="h-5 w-5 text-red-600" /><p className="text-sm text-red-700">{error}</p></div>
              </div>
            )}
            {result ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2>Your result</h2>
                  <button className="text-sm text-brand-blue hover:underline" onClick={() => setResult(null)}>Reset</button>
                </div>
                <PredictionResults result={result} />
              </>
            ) : (
              <div className="card p-8 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-brand-blue" />
                <h2 className="mt-4">Result preview</h2>
                <p className="mt-2 text-sm leading-6 text-navy-500">
                  Your placement probability, confidence, and conditional salary estimate will appear here.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
