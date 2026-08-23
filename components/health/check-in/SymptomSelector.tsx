"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Symptom {
  symptom_code: string;
  category: string;
  severity: string;
  notes?: string;
}

interface Props {
  selectedSymptoms: Symptom[];
  onChange: (symptoms: Symptom[]) => void;
  disabled?: boolean;
}

// Grouped by Category
const CATEGORIES = [
  {
    id: "PAIN",
    symptoms: ["headache", "back_pain", "pelvic_pain", "body_pain"],
  },
  {
    id: "MENSTRUAL",
    symptoms: ["cramps", "period_pain", "spotting"],
  },
  {
    id: "DIGESTIVE",
    symptoms: ["bloating", "nausea", "constipation", "diarrhea"],
  },
  {
    id: "GENERAL",
    symptoms: ["fatigue", "dizziness", "weakness", "fever"],
  },
  {
    id: "SKIN",
    symptoms: ["acne", "skin_changes"],
  },
];

const SEVERITIES = ["MILD", "MODERATE", "SEVERE"];

export function SymptomSelector({ selectedSymptoms, onChange, disabled }: Props) {
  const t = useTranslations("Wellness.symptoms");
  const ts = useTranslations("Wellness.severity");

  const [expandedCategory, setExpandedCategory] = useState<string>("PAIN");

  const isSelected = (code: string) => 
    selectedSymptoms.some((s) => s.symptom_code === code);

  const toggleSymptom = (category: string, code: string) => {
    if (isSelected(code)) {
      onChange(selectedSymptoms.filter((s) => s.symptom_code !== code));
    } else {
      onChange([
        ...selectedSymptoms,
        { symptom_code: code, category, severity: "MILD" },
      ]);
    }
  };

  const updateSeverity = (code: string, severity: string) => {
    onChange(
      selectedSymptoms.map((s) =>
        s.symptom_code === code ? { ...s, severity } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-ink">{t("question")}</h3>
      
      <div className="border border-peach/50 rounded-xl overflow-hidden bg-white">
        {CATEGORIES.map((cat, idx) => {
          const isOpen = expandedCategory === cat.id;
          const activeCount = cat.symptoms.filter(isSelected).length;

          return (
            <div key={cat.id} className={idx > 0 ? "border-t border-peach/20" : ""}>
              <button
                type="button"
                className="w-full px-4 py-3 flex items-center justify-between bg-peach/5 hover:bg-peach/10 transition-colors"
                onClick={() => setExpandedCategory(isOpen ? "" : cat.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-ink">
                    {t(`categories.${cat.id}`)}
                  </span>
                  {activeCount > 0 && (
                    <span className="bg-berry text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      {activeCount}
                    </span>
                  )}
                </div>
                <span className="text-ink/50 text-xs">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 bg-white space-y-4">
                  {cat.symptoms.map((code) => {
                    const active = isSelected(code);
                    const symptomData = selectedSymptoms.find((s) => s.symptom_code === code);

                    return (
                      <div key={code} className="space-y-2">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleSymptom(cat.id, code)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors text-left ${
                            active 
                              ? "bg-berry/5 border-berry/30" 
                              : "border-gray-100 hover:border-peach/50"
                          } ${disabled ? "opacity-50" : ""}`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            active ? "bg-berry border-berry text-white" : "border-gray-300"
                          }`}>
                            {active && <span className="text-xs">✓</span>}
                          </div>
                          <span className={`text-sm ${active ? "font-medium text-berry" : "text-ink/80"}`}>
                            {t(`options.${code}`)}
                          </span>
                        </button>

                        {/* Severity Selector (only shows if active) */}
                        {active && (
                          <div className="pl-8 pr-3 flex gap-2">
                            {SEVERITIES.map((sev) => (
                              <button
                                key={sev}
                                type="button"
                                disabled={disabled}
                                onClick={() => updateSeverity(code, sev)}
                                className={`flex-1 py-1 text-xs rounded-full border transition-colors ${
                                  symptomData?.severity === sev
                                    ? "bg-berry text-white border-berry font-medium"
                                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                {ts(`options.${sev}`)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
