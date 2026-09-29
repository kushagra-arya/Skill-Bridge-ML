import { ArrowRight, BarChart3, Brain, Braces, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const features = [
  "Structured validation for 22 profile attributes",
  "Placement probability with a readable confidence label",
  "Conditional salary estimate and RMSE-based range",
  "Batch and task-specific endpoints in the REST API"
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-navy-900 text-white">
        <div className="container-main grid gap-12 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:py-28">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
              Engineering placement analytics
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Explore how an engineering profile maps to placement outcomes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-navy-300">
              Skill Bridge combines a calibrated profile form with two scikit-learn pipelines:
              Logistic Regression for placement likelihood and Ridge Regression for salary estimation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/predict" className="btn-primary btn-lg">
                Run a prediction <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="http://localhost:8000/docs" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
                Open API docs
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-end">
            <Metric value="0.906" label="ROC-AUC" />
            <Metric value="0.774" label="R² score" />
            <Metric value="5,000" label="profiles" />
            <Metric value="19" label="model features" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-main grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">What it includes</p>
            <h2 className="mt-3 text-3xl font-bold">One coherent path from data to interface</h2>
            <p className="mt-4 leading-7 text-navy-600">
              Missing categorical values are imputed, numeric outliers are clipped from training-set
              statistics, features are encoded and scaled, and both estimators are served by FastAPI.
            </p>
            <ul className="mt-7 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3 text-navy-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FeatureCard icon={<Brain />} title="Classification" text="Binary placement probability from academic, skills, lifestyle, and background inputs." />
            <FeatureCard icon={<BarChart3 />} title="Regression" text="Salary estimate in LPA for profiles classified as likely to be placed." />
            <FeatureCard icon={<Braces />} title="API" text="Typed single and batch endpoints with interactive OpenAPI documentation." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-navy-300">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="card p-5">
      <div className="mb-4 text-brand-blue">{icon}</div>
      <h3>{title}</h3>
      <p className="mt-2 text-sm leading-6 text-navy-600">{text}</p>
    </article>
  );
}
