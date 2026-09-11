-- ====================================================================
-- CrediNova Supabase Schema Migration
-- 01_init_supabase.sql
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. Table: demo_applicants
-- Stores pre-computed Home Credit demo applicant records for demonstration.
-- Exact schema matching HomeCreditProject/artifacts/demo_applicants.csv
-- ====================================================================
CREATE TABLE IF NOT EXISTS demo_applicants (
    sk_id_curr BIGINT PRIMARY KEY,
    name_contract_type INTEGER,
    code_gender INTEGER,
    flag_own_car INTEGER,
    amt_income_total DOUBLE PRECISION,
    amt_credit DOUBLE PRECISION,
    amt_annuity DOUBLE PRECISION,
    amt_goods_price DOUBLE PRECISION,
    name_type_suite INTEGER,
    name_income_type INTEGER,
    name_education_type INTEGER,
    name_family_status INTEGER,
    name_housing_type INTEGER,
    region_population_relative DOUBLE PRECISION,
    days_birth INTEGER,
    days_employed DOUBLE PRECISION,
    days_registration DOUBLE PRECISION,
    days_id_publish INTEGER,
    own_car_age DOUBLE PRECISION,
    flag_work_phone INTEGER,
    occupation_type INTEGER,
    region_rating_client INTEGER,
    region_rating_client_w_city INTEGER,
    weekday_appr_process_start INTEGER,
    live_region_not_work_region INTEGER,
    reg_city_not_live_city INTEGER,
    live_city_not_work_city INTEGER,
    organization_type INTEGER,
    ext_source_1 DOUBLE PRECISION,
    ext_source_2 DOUBLE PRECISION,
    ext_source_3 DOUBLE PRECISION,
    apartments_avg DOUBLE PRECISION,
    entrances_avg DOUBLE PRECISION,
    floorsmax_avg DOUBLE PRECISION,
    livingarea_avg DOUBLE PRECISION,
    apartments_mode DOUBLE PRECISION,
    floorsmax_mode DOUBLE PRECISION,
    apartments_medi DOUBLE PRECISION,
    years_beginexploatation_medi DOUBLE PRECISION,
    entrances_medi DOUBLE PRECISION,
    floorsmax_medi DOUBLE PRECISION,
    totalarea_mode DOUBLE PRECISION,
    wallsmaterial_mode INTEGER,
    def_30_cnt_social_circle DOUBLE PRECISION,
    def_60_cnt_social_circle DOUBLE PRECISION,
    days_last_phone_change DOUBLE PRECISION,
    flag_document_3 INTEGER,
    flag_document_8 INTEGER,
    flag_document_18 INTEGER,
    amt_req_credit_bureau_hour DOUBLE PRECISION,
    amt_req_credit_bureau_week DOUBLE PRECISION,
    amt_req_credit_bureau_qrt DOUBLE PRECISION,
    document_count INTEGER,
    new_doc_kurt DOUBLE PRECISION,
    age_range INTEGER,
    ext_sources_prod DOUBLE PRECISION,
    ext_sources_weighted DOUBLE PRECISION,
    ext_sources_min DOUBLE PRECISION,
    ext_sources_max DOUBLE PRECISION,
    ext_sources_mean DOUBLE PRECISION,
    ext_sources_nanmedian DOUBLE PRECISION,
    ext_sources_var DOUBLE PRECISION,
    credit_to_annuity_ratio DOUBLE PRECISION,
    credit_to_goods_ratio DOUBLE PRECISION,
    annuity_to_income_ratio DOUBLE PRECISION,
    credit_to_income_ratio DOUBLE PRECISION,
    income_to_employed_ratio DOUBLE PRECISION,
    income_to_birth_ratio DOUBLE PRECISION,
    employed_to_birth_ratio DOUBLE PRECISION,
    id_to_birth_ratio DOUBLE PRECISION,
    car_to_birth_ratio DOUBLE PRECISION,
    car_to_employed_ratio DOUBLE PRECISION,
    phone_to_birth_ratio DOUBLE PRECISION,
    group_ext_sources_median DOUBLE PRECISION,
    group_ext_sources_std DOUBLE PRECISION,
    group_income_mean DOUBLE PRECISION,
    group_income_std DOUBLE PRECISION,
    group_credit_to_annuity_mean DOUBLE PRECISION,
    group_credit_to_annuity_std DOUBLE PRECISION,
    group_credit_mean DOUBLE PRECISION,
    group_annuity_mean DOUBLE PRECISION,
    group_annuity_std DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_applicants_income ON demo_applicants(amt_income_total);
CREATE INDEX IF NOT EXISTS idx_demo_applicants_credit ON demo_applicants(amt_credit);

-- ====================================================================
-- 2. Table: assessments
-- Ingests applicant submissions collected through the CrediNova frontend form.
-- Preserves JSON structures for Personal, Financial, Transactions, and Alternative signals.
-- ====================================================================
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id TEXT,
    applicant_id BIGINT REFERENCES demo_applicants(sk_id_curr) ON DELETE SET NULL,
    personal_data JSONB NOT NULL,
    financial_data JSONB NOT NULL,
    transaction_data JSONB NOT NULL,
    payment_data JSONB NOT NULL,
    dti NUMERIC,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_customer ON assessments(customer_id);
CREATE INDEX IF NOT EXISTS idx_assessments_applicant ON assessments(applicant_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created ON assessments(created_at DESC);

-- ====================================================================
-- 3. Table: predictions
-- Stores audit records of all ML inferences executed by the LightGBM ensemble.
-- ====================================================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    applicant_id BIGINT NOT NULL,
    default_probability DOUBLE PRECISION NOT NULL,
    default_probability_percent DOUBLE PRECISION NOT NULL,
    credit_score INTEGER NOT NULL,
    score_scale TEXT DEFAULT '300-900',
    risk_band TEXT NOT NULL,
    model_version TEXT NOT NULL,
    shap_summary JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_applicant ON predictions(applicant_id);
CREATE INDEX IF NOT EXISTS idx_predictions_assessment ON predictions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_predictions_score ON predictions(credit_score);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON predictions(created_at DESC);
