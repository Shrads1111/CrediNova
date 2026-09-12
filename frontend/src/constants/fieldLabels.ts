/**
 * fieldLabels.ts
 *
 * Single source of truth for human-readable labels that correspond to raw
 * CSV / database column names used by the ML model and Supabase backend.
 *
 * RULES:
 *  - The KEY is always the original CSV / database column name (uppercase).
 *  - The VALUE is the label shown to the user.
 *  - Never use a label as a key.  The backend / ML pipeline always receives
 *    the original column name, never the human-readable label.
 *
 * Usage:
 *   import { FIELD_LABELS, fieldLabel } from "@/constants/fieldLabels";
 *
 *   // Direct lookup:
 *   FIELD_LABELS.AMT_INCOME_TOTAL  // → "Total Annual Income"
 *
 *   // Safe lookup with optional fallback:
 *   fieldLabel("AMT_INCOME_TOTAL")             // → "Total Annual Income"
 *   fieldLabel("UNKNOWN_COL")                  // → "UNKNOWN_COL"
 *   fieldLabel("UNKNOWN_COL", "Unknown field") // → "Unknown field"
 */

// ─── Canonical label map ──────────────────────────────────────────────────────

export const FIELD_LABELS = {
  // ── Identity ──────────────────────────────────────────────────────────────
  SK_ID_CURR: "Applicant ID",

  // ── Loan / Contract ───────────────────────────────────────────────────────
  NAME_CONTRACT_TYPE: "Loan Contract Type",
  AMT_CREDIT: "Loan Credit Amount",
  AMT_ANNUITY: "Loan Annuity Amount",
  AMT_GOODS_PRICE: "Loaned Goods Price",

  // ── Income ────────────────────────────────────────────────────────────────
  AMT_INCOME_TOTAL: "Total Annual Income",

  // ── Demographics ──────────────────────────────────────────────────────────
  CODE_GENDER: "Gender",
  FLAG_OWN_CAR: "Car Ownership",
  NAME_INCOME_TYPE: "Income Type",
  NAME_EDUCATION_TYPE: "Education Level",
  NAME_FAMILY_STATUS: "Family Status",
  NAME_HOUSING_TYPE: "Housing Type",

  // ── Time / age fields (values are negative days relative to application) ──
  DAYS_BIRTH: "Age",
  DAYS_EMPLOYED: "Employment Duration",

  // ── Vehicle ───────────────────────────────────────────────────────────────
  OWN_CAR_AGE: "Car Age",

  // ── Contact ───────────────────────────────────────────────────────────────
  FLAG_WORK_PHONE: "Work Phone Available",

  // ── Employment ────────────────────────────────────────────────────────────
  OCCUPATION_TYPE: "Occupation",
  ORGANIZATION_TYPE: "Organization Type",

  // ── External risk scores ──────────────────────────────────────────────────
  EXT_SOURCE_1: "External Risk Indicator 1",
  EXT_SOURCE_2: "External Risk Indicator 2",
  EXT_SOURCE_3: "External Risk Indicator 3",

  // ── Social circle defaults ────────────────────────────────────────────────
  DEF_30_CNT_SOCIAL_CIRCLE: "30-Day Social Circle Defaults",
  DEF_60_CNT_SOCIAL_CIRCLE: "60-Day Social Circle Defaults",

  // ── Credit bureau activity ────────────────────────────────────────────────
  AMT_REQ_CREDIT_BUREAU_QRT: "Credit Bureau Requests (Quarter)",

  // ── Regional indicators ───────────────────────────────────────────────────
  REGION_RATING_CLIENT: "Regional Credit Rating",
  REGION_RATING_CLIENT_W_CITY: "Regional Credit Rating (City)",
  REGION_POPULATION_RELATIVE: "Regional Population Density",
} as const;

// Derive the union of all valid column-name keys for type safety.
export type FieldKey = keyof typeof FIELD_LABELS;

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Returns the human-readable label for a database column name.
 *
 * @param key      - Raw database / CSV column name (e.g. "AMT_INCOME_TOTAL").
 * @param fallback - Returned when `key` has no entry in the map.
 *                   Defaults to the key itself so raw names are never silently
 *                   swallowed — a missing entry becomes visible during review.
 */
export function fieldLabel(key: string, fallback?: string): string {
  return (FIELD_LABELS as Record<string, string>)[key] ?? fallback ?? key;
}
