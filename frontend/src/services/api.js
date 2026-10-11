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
const _env = import.meta.env;
export const API_BASE = (_env.VITE_API_URL ?? "").replace(/\/$/, "") || "http://127.0.0.1:8000";
// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(path, init) {
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
            if (typeof body?.detail === "string")
                detail = body.detail;
            else if (body?.detail)
                detail = JSON.stringify(body.detail);
        }
        catch {
            /* ignore parse errors */
        }
        throw new Error(detail);
    }
    return response.json();
}
// ─── Endpoints ────────────────────────────────────────────────────────────────
/** GET /health — backend + ML liveness check. */
export async function checkHealth() {
    return request("/health");
}
/**
 * GET /api/applicants — paginated list of demo applicants.
 *
 * Field names in `ApplicantSummary` are raw DB column names (lowercase).
 * Use `fieldLabel("AMT_INCOME_TOTAL")` to display them.
 */
export async function listApplicants(limit = 20, offset = 0) {
    return request(`/api/applicants?limit=${limit}&offset=${offset}`);
}
/**
 * GET /api/applicants/:id — full applicant row from `demo_applicants`.
 *
 * `data` contains all 82+ columns keyed by their lowercase DB column names.
 * Always use `fieldLabel(key.toUpperCase())` before rendering any key to
 * the user.
 */
export async function getApplicant(applicantId) {
    return request(`/api/applicants/${applicantId}`);
}
/** POST /api/assessments — store an assessment submission. */
export async function createAssessment(payload) {
    return request("/api/assessments", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
/** GET /api/assessments/:id — retrieve an assessment with its linked prediction. */
export async function getAssessment(assessmentId) {
    return request(`/api/assessments/${assessmentId}`);
}
/**
 * POST /api/predict — run the LightGBM ensemble for a demo applicant.
 *
 * @param applicant_id  - SK_ID_CURR of the applicant in `demo_applicants`.
 * @param assessment_id - Optional: link this prediction to an assessment row.
 * @param explain       - When true, SHAP feature attributions are included.
 */
export async function predictApplicant(params) {
    return request("/api/predict", {
        method: "POST",
        body: JSON.stringify({
            applicant_id: params.applicant_id,
            assessment_id: params.assessment_id ?? undefined,
            explain: params.explain ?? false,
        }),
    });
}
