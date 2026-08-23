"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DobPicker } from "./DobPicker";
import { healthApi, type HealthProfileCreate } from "@/lib/api";
import { isDemoMode, demoDelay } from "@/lib/api-config";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACTIVITY_LEVELS = [
  { value: "SEDENTARY", label: "Sedentary (little or no exercise)" },
  { value: "LIGHT", label: "Light (1–3 days/week)" },
  { value: "MODERATE", label: "Moderate (3–5 days/week)" },
  { value: "ACTIVE", label: "Active (6–7 days/week)" },
  { value: "VERY_ACTIVE", label: "Very Active (twice a day)" },
];

const DIET_TYPES = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "NON_VEGETARIAN", label: "Non-Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "EGGETARIAN", label: "Eggetarian" },
  { value: "OTHER", label: "Other / Not sure" },
];

const CONDITION_OPTIONS = [
  { code: "PCOS_PCOD", label: "PCOS / PCOD" },
  { code: "ENDOMETRIOSIS", label: "Endometriosis" },
  { code: "HYPOTHYROID", label: "Thyroid condition" },
  { code: "DIABETES", label: "Diabetes" },
  { code: "ANEMIA", label: "Anemia" },
  { code: "MIGRAINE", label: "Migraine" },
  { code: "OTHER", label: "Other" },
];

type FormErrors = Partial<{
  dob: string;
  activity_level: string;
  diet_type: string;
  general: string;
}>;

interface Props {
  token: string;
  locale: string;
}

// ---------------------------------------------------------------------------
// Multi-step onboarding form
// ---------------------------------------------------------------------------

export function HealthOnboarding({ token, locale }: Props) {
  const t = useTranslations("HealthProfile");
  const router = useRouter();

  // Step: 1=About You, 2=Diet, 3=Conditions, 4=Privacy
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  // --- About You ---
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState("SEDENTARY");

  // --- Diet ---
  const [dietType, setDietType] = useState("OTHER");
  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);

  // --- Conditions ---
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);

  // --- Privacy ---
  const [aiConsent, setAiConsent] = useState(false);

  // --- State ---
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  function validateStep1(): FormErrors {
    const e: FormErrors = {};
    if (!dobDay || !dobMonth || !dobYear) {
      e.dob = t("errors.dobRequired");
    } else {
      const dob = new Date(`${dobYear}-${dobMonth}-${dobDay}`);
      if (isNaN(dob.getTime())) {
        e.dob = t("errors.dobInvalid");
      } else {
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear() -
          ((today.getMonth() + 1 < dob.getMonth() + 1 ||
            (today.getMonth() + 1 === dob.getMonth() + 1 && today.getDate() < dob.getDate()))
            ? 1 : 0);
        if (age < 14) e.dob = t("errors.ageMinimum");
        if (dob > today) e.dob = t("errors.dobFuture");
      }
    }
    if (!activityLevel) e.activity_level = t("errors.activityRequired");
    return e;
  }

  function validateStep2(): FormErrors {
    const e: FormErrors = {};
    if (!dietType) e.diet_type = t("errors.dietRequired");
    return e;
  }

  function handleNext() {
    let errs: FormErrors = {};
    if (step === 1) errs = validateStep1();
    if (step === 2) errs = validateStep2();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep((s) => s + 1);
  }

  // ---------------------------------------------------------------------------
  // Allergy management
  // ---------------------------------------------------------------------------

  function addAllergy() {
    const trimmed = allergyInput.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
      setAllergyInput("");
    }
  }

  function removeAllergy(a: string) {
    setAllergies(allergies.filter((x) => x !== a));
  }

  // ---------------------------------------------------------------------------
  // Condition toggle
  // ---------------------------------------------------------------------------

  function toggleCondition(code: string) {
    setNoneSelected(false);
    setSelectedConditions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function selectNone() {
    setSelectedConditions([]);
    setNoneSelected(true);
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const dobIso = `${dobYear}-${dobMonth}-${dobDay}`;

    const profileData: HealthProfileCreate = {
      date_of_birth: dobIso,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      activity_level: activityLevel,
      diet_type: dietType,
      food_allergies: allergies,
      ai_health_personalization_enabled: aiConsent,
    };

    try {
      if (isDemoMode()) {
        await demoDelay(1200);
      } else {
        await healthApi.createProfile(profileData, token);

        // Add self-reported conditions
        for (const code of selectedConditions) {
          const opt = CONDITION_OPTIONS.find((c) => c.code === code);
          if (opt) {
            await healthApi.addCondition(
              { condition_code: code, display_name: opt.label },
              token
            );
          }
        }
      }
      router.push(`/${locale}/health`);
    } catch (err) {
      const error = err as Error;
      const msg = error.message || t("errors.general");
      
      if (msg.includes("14")) {
        setErrors({ dob: t("errors.ageMinimum") });
        setStep(1);
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Step progress bar
  // ---------------------------------------------------------------------------

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 text-4xl" aria-hidden="true">🌸</div>
        <h1 className="font-display text-2xl font-bold text-berry">
          {t("onboarding.title")}
        </h1>
        <p className="mt-2 text-sm text-ink/60">{t("onboarding.subtitle")}</p>

        {/* Step progress */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-peach/40"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-berry transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-ink/50 tabular-nums">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ---------------------------------------------------------------- */}
        {/* STEP 1 — About You                                               */}
        {/* ---------------------------------------------------------------- */}
        {step === 1 && (
          <Card padding="lg" className="flex flex-col gap-6">
            <div>
              <h2 className="font-semibold text-ink">{t("aboutYou.title")}</h2>
              <p className="mt-1 text-xs text-ink/50">{t("aboutYou.hint")}</p>
            </div>

            <DobPicker
              day={dobDay} month={dobMonth} year={dobYear}
              onDayChange={setDobDay}
              onMonthChange={setDobMonth}
              onYearChange={setDobYear}
              error={errors.dob}
            />

            <Input
              label={t("aboutYou.heightLabel")}
              hint={t("aboutYou.heightHint")}
              type="number"
              min={50} max={300}
              placeholder="e.g. 160"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />

            <Input
              label={t("aboutYou.weightLabel")}
              hint={t("aboutYou.weightHint")}
              type="number"
              min={10} max={500}
              placeholder="e.g. 60"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />

            <Select
              label={t("aboutYou.activityLabel")}
              hint={t("aboutYou.activityHint")}
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              options={ACTIVITY_LEVELS}
              error={errors.activity_level}
            />

            <Button type="button" onClick={handleNext} className="w-full">
              {t("onboarding.next")}
            </Button>
          </Card>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* STEP 2 — Dietary Preferences                                     */}
        {/* ---------------------------------------------------------------- */}
        {step === 2 && (
          <Card padding="lg" className="flex flex-col gap-6">
            <div>
              <h2 className="font-semibold text-ink">{t("diet.title")}</h2>
              <p className="mt-1 text-xs text-ink/50">{t("diet.hint")}</p>
            </div>

            <Select
              label={t("diet.typeLabel")}
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              options={DIET_TYPES}
              error={errors.diet_type}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">{t("diet.allergiesLabel")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-2xl border border-peach/70 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-berry/40 focus:outline-none focus:ring-2 focus:ring-berry/30"
                  placeholder={t("diet.allergiesPlaceholder")}
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAllergy(); } }}
                />
                <Button type="button" onClick={addAllergy} variant="secondary">
                  {t("diet.add")}
                </Button>
              </div>
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {allergies.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1 rounded-full bg-peach/30 px-3 py-1 text-xs text-ink"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => removeAllergy(a)}
                        className="ml-1 text-ink/40 hover:text-red-400"
                        aria-label={`Remove ${a}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                {t("onboarding.back")}
              </Button>
              <Button type="button" onClick={handleNext} className="flex-1">
                {t("onboarding.next")}
              </Button>
            </div>
          </Card>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* STEP 3 — Health Conditions                                       */}
        {/* ---------------------------------------------------------------- */}
        {step === 3 && (
          <Card padding="lg" className="flex flex-col gap-6">
            <div>
              <h2 className="font-semibold text-ink">{t("conditions.title")}</h2>
              <p className="mt-1 text-xs text-ink/50">{t("conditions.hint")}</p>
              <p className="mt-2 text-xs text-berry/70 font-medium">{t("conditions.disclaimer")}</p>
            </div>

            <div className="flex flex-col gap-3">
              {CONDITION_OPTIONS.map((opt) => (
                <label key={opt.code} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-peach/70 accent-berry"
                    checked={selectedConditions.includes(opt.code)}
                    onChange={() => toggleCondition(opt.code)}
                  />
                  <span className="text-sm text-ink group-hover:text-berry transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}

              <label className="flex items-center gap-3 cursor-pointer group mt-2 border-t border-peach/30 pt-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-peach/70 accent-berry"
                  checked={noneSelected}
                  onChange={selectNone}
                />
                <span className="text-sm text-ink group-hover:text-berry transition-colors">
                  {t("conditions.none")}
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">
                {t("onboarding.back")}
              </Button>
              <Button type="button" onClick={handleNext} className="flex-1">
                {t("onboarding.next")}
              </Button>
            </div>
          </Card>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* STEP 4 — Privacy                                                 */}
        {/* ---------------------------------------------------------------- */}
        {step === 4 && (
          <Card padding="lg" className="flex flex-col gap-6">
            <div>
              <h2 className="font-semibold text-ink">{t("privacy.title")}</h2>
              <p className="mt-1 text-sm text-ink/60">{t("privacy.description")}</p>
            </div>

            <div className="rounded-2xl bg-peach/10 p-4 text-sm text-ink/70 space-y-2">
              <p>✓ {t("privacy.what1")}</p>
              <p>✓ {t("privacy.what2")}</p>
              <p>✓ {t("privacy.what3")}</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="ai-consent"
                className="mt-0.5 h-4 w-4 rounded border-peach/70 accent-berry"
                checked={aiConsent}
                onChange={(e) => setAiConsent(e.target.checked)}
              />
              <span className="text-sm text-ink leading-relaxed">
                {t("privacy.aiConsentLabel")}
              </span>
            </label>
            <p className="text-xs text-ink/40 -mt-3">{t("privacy.aiConsentHint")}</p>

            {errors.general && (
              <p className="text-sm text-red-500 text-center" role="alert">
                {errors.general}
              </p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(3)} className="flex-1">
                {t("onboarding.back")}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? t("onboarding.saving") : t("onboarding.complete")}
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}
