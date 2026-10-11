/**
 * scoringEngine.ts
 *
 * Simulation-only credit scoring engine for the CrediNova frontend demo.
 *
 * Input:  ApplicantFormData  (CSV-keyed fields)
 * Output: AssessmentResult   (score, risk band, explanations, trend data)
 *
 * IMPORTANT: This is a front-end simulation used while the ML backend is not
 * yet connected.  The actual LightGBM ensemble in HomeCreditProject/ will
 * replace this computation.  The function signature must remain stable so
 * the context's generateScore() needs no changes when the backend is wired in.
 */

import {
  ApplicantFormData,
  AssessmentResult,
  ScoreBarItem,
  SuggestionItem,
} from "../types/assessment";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function num(value: string | undefined): number {
  return parseFloat(String(value ?? "")) || 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Main scoring function ────────────────────────────────────────────────────

export function calculateCreditScore(data: ApplicantFormData): AssessmentResult {

  // ── Parse CSV-keyed fields ─────────────────────────────────────────────────
  const income       = num(data.AMT_INCOME_TOTAL);
  const credit       = num(data.AMT_CREDIT);
  const annuity      = num(data.AMT_ANNUITY);
  const ext1         = num(data.EXT_SOURCE_1);
  const ext2         = num(data.EXT_SOURCE_2);
  const ext3         = num(data.EXT_SOURCE_3);
  const def30        = num(data.DEF_30_CNT_SOCIAL_CIRCLE);
  const def60        = num(data.DEF_60_CNT_SOCIAL_CIRCLE);
  const bureauQtr    = num(data.AMT_REQ_CREDIT_BUREAU_QRT);
  const regionRating = num(data.REGION_RATING_CLIENT);         // 1=best, 3=worst
  const daysBirth    = num(data.DAYS_BIRTH);                   // negative
  const daysEmployed = num(data.DAYS_EMPLOYED);                // negative

  // ── Derived values ─────────────────────────────────────────────────────────
  const ageYears         = Math.abs(daysBirth) / 365;
  const employedYears    = Math.abs(daysEmployed) / 365;
  const annuityToIncome  = income > 0 ? annuity / income : 0;
  const creditToIncome   = income > 0 ? credit / income : 0;

  // ── EXT_SOURCE composite (primary model signal) ────────────────────────────
  // Average of available external risk indicators — higher means lower risk.
  const extValues = [ext1, ext2, ext3].filter((v) => v > 0);
  const extMean   = extValues.length > 0
    ? extValues.reduce((a, b) => a + b, 0) / extValues.length
    : 0.5;

  // ── Baseline score ─────────────────────────────────────────────────────────
  let score = 600;

  // 1. External risk indicators (biggest driver, mirrors ML model)
  //    extMean 0→1 maps to −120…+180 shift
  score += Math.round((extMean - 0.5) * 300);

  // 2. Annuity / income burden
  if      (annuityToIncome < 0.10) score += 60;
  else if (annuityToIncome < 0.20) score += 30;
  else if (annuityToIncome < 0.30) score += 10;
  else if (annuityToIncome < 0.40) score -= 20;
  else if (annuityToIncome < 0.50) score -= 50;
  else                              score -= 90;

  // 3. Credit / income ratio
  if      (creditToIncome < 2)  score += 40;
  else if (creditToIncome < 4)  score += 15;
  else if (creditToIncome < 6)  score -= 15;
  else if (creditToIncome < 10) score -= 40;
  else                          score -= 70;

  // 4. Social circle defaults (negative signal)
  score -= (def30 + def60) * 12;

  // 5. Bureau enquiry activity (too many = negative)
  if      (bureauQtr === 0) score += 20;
  else if (bureauQtr <= 2)  score += 5;
  else if (bureauQtr <= 5)  score -= 15;
  else                      score -= 35;

  // 6. Regional credit rating (1=best, 3=worst)
  if      (regionRating === 1) score += 25;
  else if (regionRating === 3) score -= 30;

  // 7. Age signal (very young or very old = slightly higher risk)
  if      (ageYears >= 35 && ageYears <= 55) score += 20;
  else if (ageYears >= 25 && ageYears < 35)  score += 10;
  else if (ageYears < 22 || ageYears > 65)   score -= 20;

  // 8. Employment stability
  if      (employedYears >= 5)  score += 30;
  else if (employedYears >= 2)  score += 15;
  else if (employedYears >= 1)  score += 5;
  else if (employedYears <= 0)  score -= 25;

  // 9. Income type bonus
  const incomeType = (data.NAME_INCOME_TYPE ?? "").toLowerCase();
  if      (incomeType.includes("state"))       score += 20;
  else if (incomeType.includes("commercial"))  score += 15;
  else if (incomeType.includes("working"))     score += 10;
  else if (incomeType.includes("pension"))     score += 5;
  else if (incomeType.includes("unemployed"))  score -= 60;

  // 10. Education bonus
  const edu = (data.NAME_EDUCATION_TYPE ?? "").toLowerCase();
  if      (edu.includes("academic"))           score += 25;
  else if (edu.includes("higher"))             score += 15;
  else if (edu.includes("incomplete higher"))  score += 5;
  else if (edu.includes("lower"))              score -= 20;

  // Clamp to 300–960
  const creditScore = clamp(Math.round(score), 300, 960);

  // ── Risk / recommendation ──────────────────────────────────────────────────
  let riskLevel: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  let riskColor: string;
  let recommendation: "APPROVE" | "CONDITIONAL APPROVE" | "MANUAL REVIEW";
  let recommendationSubtitle: string;
  let scoreBand: string;

  if (creditScore >= 850) {
    scoreBand = "Exceptional";
    riskLevel = "LOW RISK"; riskColor = "#22C55E";
    recommendation = "APPROVE";
    recommendationSubtitle = "Exceptional credit profile · Automatic fast-track approval";
  } else if (creditScore >= 740) {
    scoreBand = "Very Good";
    riskLevel = "LOW RISK"; riskColor = "#22C55E";
    recommendation = "APPROVE";
    recommendationSubtitle = "High confidence · Score Band A+";
  } else if (creditScore >= 670) {
    scoreBand = "Good";
    riskLevel = "MEDIUM RISK"; riskColor = "#F59E0B";
    recommendation = "CONDITIONAL APPROVE";
    recommendationSubtitle = "Standard terms recommended · Secondary guarantor advised";
  } else if (creditScore >= 580) {
    scoreBand = "Fair";
    riskLevel = "MEDIUM RISK"; riskColor = "#F59E0B";
    recommendation = "CONDITIONAL APPROVE";
    recommendationSubtitle = "Requires collateral or structured repayment conditions";
  } else {
    scoreBand = "Poor";
    riskLevel = "HIGH RISK"; riskColor = "#EF4444";
    recommendation = "MANUAL REVIEW";
    recommendationSubtitle = "Manual underwriting required due to elevated risk indicators";
  }

  // ── Default probability ────────────────────────────────────────────────────
  const defaultProbNum = clamp(
    parseFloat(((1000 - creditScore) / 1000 * 14).toFixed(1)),
    0.5,
    22,
  );
  const defaultProbability = `${defaultProbNum}%`;
  const defaultDelta       = `${(defaultProbNum * 0.12).toFixed(1)}%`;

  // ── Loan eligibility ───────────────────────────────────────────────────────
  // Use the actual credit amount from the dataset when available
  const baseEligible = credit > 0 ? credit : income * (creditScore >= 750 ? 8 : creditScore >= 650 ? 5 : 3);
  const minEligible  = Math.round((baseEligible * 0.8)  / 10000) * 10000;
  const maxEligible  = Math.round((baseEligible * 1.15) / 10000) * 10000;
  const eligibleAmountMin  = minEligible.toLocaleString();
  const eligibleAmountMax  = maxEligible.toLocaleString();
  const recommendedTenure  = creditScore >= 700 ? "36–60 months" : "12–36 months";

  // ── Score bars (factor attribution) ───────────────────────────────────────
  const extPct      = clamp(Math.round(extMean * 100), 5, 98);
  const incomePct   = clamp(Math.round((1 - clamp(annuityToIncome, 0, 1)) * 95), 20, 98);
  const creditPct   = clamp(Math.round((1 - clamp(creditToIncome / 15, 0, 1)) * 90), 20, 95);
  const socialPct   = clamp(Math.round((1 - clamp((def30 + def60) / 10, 0, 1)) * 95), 20, 98);
  const regionalPct = clamp(Math.round(((4 - regionRating) / 3) * 90), 25, 95);

  const scoreBars: ScoreBarItem[] = [
    { label: "External Risk Indicators", value: "30%", pct: extPct,      color: "#0EA5A0" },
    { label: "Income & Annuity Burden",  value: "25%", pct: incomePct,   color: "#14B8A6" },
    { label: "Credit Utilisation",       value: "20%", pct: creditPct,   color: "#0EA5A0" },
    { label: "Social Circle Risk",       value: "15%", pct: socialPct,   color: "#22C55E" },
    { label: "Regional Credit Climate",  value: "10%", pct: regionalPct, color: "#22C55E" },
  ];

  // ── Positive factors ───────────────────────────────────────────────────────
  const positives: string[] = [];

  if (extMean >= 0.6) {
    positives.push(
      `Strong external risk composite (${extMean.toFixed(3)}) signals low historical default likelihood.`
    );
  } else if (extMean >= 0.4) {
    positives.push(
      `Moderate external risk composite (${extMean.toFixed(3)}) within acceptable risk threshold.`
    );
  }

  if (annuityToIncome > 0 && annuityToIncome < 0.25) {
    positives.push(
      `Healthy annuity-to-income ratio of ${(annuityToIncome * 100).toFixed(1)}% — well within prudential ceiling.`
    );
  }

  if (employedYears >= 3) {
    positives.push(
      `${employedYears.toFixed(1)} years of continuous employment demonstrates income stability.`
    );
  }

  if (def30 === 0 && def60 === 0) {
    positives.push("Zero defaults observed in applicant's immediate social circle.");
  }

  if (bureauQtr === 0) {
    positives.push("No credit bureau enquiries in the current quarter — low credit-seeking behaviour.");
  }

  if (regionRating === 1) {
    positives.push("Applicant resides in a top-rated regional credit zone.");
  }

  while (positives.length < 3) {
    positives.push("Verified applicant classification consistent with institutional lending criteria.");
  }

  // ── Risk flags ─────────────────────────────────────────────────────────────
  const risks: string[] = [];

  if (annuityToIncome >= 0.35) {
    risks.push(
      `Elevated annuity burden (${(annuityToIncome * 100).toFixed(1)}% of income) increases repayment stress probability.`
    );
  }

  if (def30 > 0 || def60 > 0) {
    risks.push(
      `${def30 + def60} default event${def30 + def60 > 1 ? "s" : ""} recorded in applicant's social circle.`
    );
  }

  if (bureauQtr > 3) {
    risks.push(`${bureauQtr} credit bureau enquiries in a single quarter — elevated credit-seeking activity.`);
  }

  if (extMean < 0.4) {
    risks.push(`External risk composite (${extMean.toFixed(3)}) below safe threshold — elevated default signal.`);
  }

  if (regionRating === 3) {
    risks.push("Applicant's region carries the lowest regional credit rating.");
  }

  if (risks.length === 0) {
    risks.push("Minor volatility in external risk score composition across three sources.");
    risks.push("Credit-to-income ratio slightly elevated relative to optimal benchmark.");
    risks.push("Limited credit bureau history may reduce model confidence.");
  } else if (risks.length === 1) {
    risks.push("Moderate credit-to-income ratio warrants close debt-service monitoring.");
    risks.push("Income type classification may limit bureau data availability.");
  } else if (risks.length === 2) {
    risks.push("Limited credit tenure reduces long-term predictability of repayment behaviour.");
  }

  // ── AI narrative explanation ───────────────────────────────────────────────
  const applicantLabel = data.SK_ID_CURR ? `Applicant #${data.SK_ID_CURR}` : "This applicant";
  const aiExplanation =
    `${applicantLabel}'s composite credit score of ${creditScore} out of 1000 reflects a ` +
    `${creditScore >= 740 ? "financially responsible profile with manageable risk indicators" : "moderate risk profile requiring structured credit terms"}. ` +
    `The AI model calibrated the external risk composite (mean ${extMean.toFixed(3)}) alongside ` +
    `income and annuity parameters. ` +
    `The annuity-to-income ratio stands at ${(annuityToIncome * 100).toFixed(1)}%, ` +
    `and ${def30 + def60} social-circle default event${def30 + def60 !== 1 ? "s" : ""} were recorded. ` +
    `The model recommends ${recommendation} with ${creditScore >= 740 ? "high" : "conditional"} ` +
    `confidence. Recommended loan facility range: ${eligibleAmountMin}–${eligibleAmountMax} ` +
    `with ${recommendedTenure} tenure.`;

  // ── Score trend (simulated 6-month trajectory) ────────────────────────────
  const scoreDelta = clamp(Math.round(extMean * 80 - 10), -30, 80);
  const trendData = [
    { month: "Apr", score: Math.max(300, creditScore - scoreDelta) },
    { month: "May", score: Math.max(300, creditScore - Math.round(scoreDelta * 0.75)) },
    { month: "Jun", score: Math.max(300, creditScore - Math.round(scoreDelta * 0.55)) },
    { month: "Jul", score: Math.max(300, creditScore - Math.round(scoreDelta * 0.35)) },
    { month: "Aug", score: Math.max(300, creditScore - Math.round(scoreDelta * 0.15)) },
    { month: "Sep", score: creditScore },
  ];

  // ── Suggestions ───────────────────────────────────────────────────────────
  const suggestions: SuggestionItem[] = [
    {
      title:
        annuityToIncome >= 0.30
          ? "Reduce Annuity-to-Income Burden"
          : "Maintain Healthy Repayment Ratio",
      desc:
        annuityToIncome >= 0.30
          ? `Current annuity-to-income ratio of ${(annuityToIncome * 100).toFixed(1)}% is above the 30% benchmark. Restructuring loan terms could improve the score.`
          : "Keep annuity obligations below 25% of annual income to maximise borrowing headroom.",
    },
    {
      title: "Minimise Pre-Application Bureau Enquiries",
      desc: "Limit credit bureau enquiries to fewer than 3 per quarter. Each additional enquiry signals credit-seeking behaviour to lenders.",
    },
    {
      title: "Strengthen External Risk Profile",
      desc: "Maintaining consistent repayment behaviour across existing credit facilities improves the EXT_SOURCE indicators that carry the highest model weight.",
    },
  ];

  // ── Assemble result ────────────────────────────────────────────────────────
  return {
    applicantId:          data.SK_ID_CURR || `CRD-${Math.floor(100000 + Math.random() * 900000)}`,
    assessmentDate:       new Date().toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          }),
    creditScore,
    maxScore:             1000,
    scoreDelta:           Math.abs(scoreDelta),
    scoreBand,
    riskLevel,
    riskColor,
    defaultProbability,
    defaultDelta,
    eligibleAmountMin,
    eligibleAmountMax,
    recommendedTenure,
    recommendation,
    recommendationSubtitle,
    scoreBars,
    positives:            positives.slice(0, 3),
    risks:                risks.slice(0, 3),
    aiExplanation,
    trendData,
    suggestions,
    rawApplicant:         { ...data },
  };
}
