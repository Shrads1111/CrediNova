/**
 * api.ts
 *
 * CrediNova backend HTTP client.
 *
 * Base URL defaults to the local FastAPI server (port 8000) and can be
 * overridden via the VITE_API_URL environment variable.
 *
 * Field names on every response type intentionally match the raw database /
 * CSV column names (e.g. `sk_id_curr`, `amt_income_total`).  Use the
 * `FIELD_LABELS` map from `@/constants/fieldLabels` to display them.
 */

import { FIELD_LABELS, fieldLabel } from "../constants/fieldLabels";

export { FIELD_LABELS, fieldLabel };

// ─── Base URL ─────────────────────────────────────────────────────────────────

// import.meta.env is provided at runtime by Vite; the cast is intentional
// because this project's tsconfig does not include "vite/client" types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _env = (import.meta as any).env as Record<string, string | undefined>;

export const API_BASE: string =
  (_env.VITE_API_URL ?? "").replace(/\/$/, "") || "http://127.0.0.1:8000";

// ─── Response types ───────────────────────────────────────────────────────────

/**
 * Subset of applicant columns returned by GET /api/applicants.
 * Keys are lowercase versions of the CSV column names.
 */
export interface ApplicantSummary {
  sk_id_curr: number;
  amt_income_total?: number | null;
  amt_credit?: number | null;
  amt_annuity?: number | null;
  amt_goods_price?: number | null;
  days_birth?: number | null;
  ext_source_1?: number | null;
  ext_source_2?: number | null;
  ext_source_3?: number | null;
  credit_to_income_ratio?: number | null;
  annuity_to_income_ratio?: number | null;
}

export interface ApplicantListResponse {
  items: ApplicantSummary[];
  limit: number;
  offset: number;
  count: number;
}

export interface ApplicantDetailResponse {
  sk_id_curr: number;
  /** Full row from `demo_applicants`, all column names lowercase. */
  data: Record<string, unknown>;
}

export interface BackendPrediction {
  id?: string | null;
  assessment_id?: string | null;
  applicant_id: number;
  default_probability: number;
  default_probability_percent: number;
  credit_score: number;
  score_scale: string;
  risk_band: string;
  model_version: string;
  shap_summary?: Array<{
    feature: string;
    impact?: number | null;
    direction?: string | null;
    error?: string | null;
  }> | null;
  created_at?: string | null;
  source: string;
}

export interface AssessmentPayload {
  customer_id?: string;
  applicant_id?: number | null;
  personal_data: Record<string, unknown>;
  financial_data: Record<string, unknown>;
  transaction_data: Record<string, unknown>;
  payment_data: Record<string, unknown>;
  dti?: number | null;
  status?: string;
}

export interface AssessmentRecord {
  id: string;
  customer_id?: string | null;
  applicant_id?: number | null;
  personal_data: Record<string, unknown>;
  financial_data: Record<string, unknown>;
  transaction_data: Record<string, unknown>;
  payment_data: Record<string, unknown>;
  dti?: number | null;
  status: string;
  created_at?: string | null;
  prediction?: BackendPrediction | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  ml_loaded: boolean;
  models_count: number;
  db_mode?: string;
  db_detail?: string;
  model_version?: string | null;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (body?.detail) detail = JSON.stringify(body.detail);
    } catch {
      /* ignore parse errors */
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** GET /health — backend + ML liveness check. */
export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

/**
 * GET /api/applicants — paginated list of demo applicants.
 *
 * Field names in `ApplicantSummary` are raw DB column names (lowercase).
 * Use `fieldLabel("AMT_INCOME_TOTAL")` to display them.
 */
export async function listApplicants(
  limit = 20,
  offset = 0,
): Promise<ApplicantListResponse> {
  return request<ApplicantListResponse>(
    `/api/applicants?limit=${limit}&offset=${offset}`,
  );
}

/**
 * GET /api/applicants/:id — full applicant row from `demo_applicants`.
 *
 * `data` contains all 82+ columns keyed by their lowercase DB column names.
 * Always use `fieldLabel(key.toUpperCase())` before rendering any key to
 * the user.
 */
export async function getApplicant(
  applicantId: number,
): Promise<ApplicantDetailResponse> {
  return request<ApplicantDetailResponse>(`/api/applicants/${applicantId}`);
}

/** POST /api/assessments — store an assessment submission. */
export async function createAssessment(
  payload: AssessmentPayload,
): Promise<AssessmentRecord> {
  return request<AssessmentRecord>("/api/assessments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /api/assessments/:id — retrieve an assessment with its linked prediction. */
export async function getAssessment(
  assessmentId: string,
): Promise<AssessmentRecord> {
  return request<AssessmentRecord>(`/api/assessments/${assessmentId}`);
}

/**
 * POST /api/predict — run the LightGBM ensemble for a demo applicant.
 *
 * @param applicant_id  - SK_ID_CURR of the applicant in `demo_applicants`.
 * @param assessment_id - Optional: link this prediction to an assessment row.
 * @param explain       - When true, SHAP feature attributions are included.
 */
export async function predictApplicant(params: {
  applicant_id: number;
  assessment_id?: string | null;
  explain?: boolean;
}): Promise<BackendPrediction> {
  return request<BackendPrediction>("/api/predict", {
    method: "POST",
    body: JSON.stringify({
      applicant_id: params.applicant_id,
      assessment_id: params.assessment_id ?? undefined,
      explain: params.explain ?? false,
    }),
  });
}
