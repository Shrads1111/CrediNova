/**
 * CrediNova backend HTTP client.
 * Base URL defaults to local FastAPI (port 8000).
 */

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

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
  shap_summary?: Array<Record<string, unknown>> | null;
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
  model_version?: string | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
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

export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export async function listApplicants(
  limit = 20,
  offset = 0
): Promise<ApplicantListResponse> {
  return request<ApplicantListResponse>(
    `/api/applicants?limit=${limit}&offset=${offset}`
  );
}

export async function getApplicant(applicantId: number) {
  return request<{ sk_id_curr: number; data: Record<string, unknown> }>(
    `/api/applicants/${applicantId}`
  );
}

export async function createAssessment(
  payload: AssessmentPayload
): Promise<AssessmentRecord> {
  return request<AssessmentRecord>("/api/assessments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAssessment(assessmentId: string): Promise<AssessmentRecord> {
  return request<AssessmentRecord>(`/api/assessments/${assessmentId}`);
}

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

export { API_BASE };
