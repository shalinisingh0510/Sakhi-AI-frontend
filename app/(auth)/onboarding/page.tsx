"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore, type AgeGroup, type SupportedLanguage } from "@/lib/auth-store";

const AGE_GROUPS: { value: AgeGroup; label: string; emoji: string; desc: string }[] = [
  { value: "10-13", label: "10–13 years", emoji: "🌱", desc: "Just starting to learn" },
  { value: "14-18", label: "14–18 years", emoji: "🌸", desc: "Growing and curious" },
  { value: "18+",   label: "18+ years",   emoji: "🌺", desc: "Adult learner" },
  { value: "caregiver", label: "Caregiver / Mother", emoji: "💛", desc: "Learning for someone I care for" },
];

const LANGUAGES: { value: SupportedLanguage; label: string; native: string }[] = [
  { value: "en", label: "English",   native: "English" },
  { value: "hi", label: "Hindi",     native: "हिन्दी" },
  { value: "bn", label: "Bengali",   native: "বাংলা" },
  { value: "mr", label: "Marathi",   native: "मराठी" },
  { value: "ta", label: "Tamil",     native: "தமிழ்" },
  { value: "te", label: "Telugu",    native: "తెలుగు" },
  { value: "kn", label: "Kannada",   native: "ಕನ್ನಡ" },
  { value: "gu", label: "Gujarati",  native: "ગુજરાતી" },
  { value: "pa", label: "Punjabi",   native: "ਪੰਜਾਬੀ" },
  { value: "or", label: "Odia",      native: "ଓଡ଼ିଆ" },
];

const STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();

  const [step, setStep] = useState(1);
  const [selectedAge, setSelectedAge] = useState<AgeGroup | "">("");
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("en");
  const [name, setName] = useState(user?.name ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleFinish() {
    if (!selectedAge) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    completeOnboarding(selectedAge as AgeGroup, selectedLang, name);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blush/60 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-ink/50 mb-2">
            <span>Step {step} of {STEPS}</span>
            <span>{Math.round((step / STEPS) * 100)}% done</span>
          </div>
          <div className="h-2 w-full rounded-full bg-peach/60">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-rose to-berry transition-all duration-500"
              style={{ width: `${(step / STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <Card>
            <div className="text-center mb-6">
              <span className="text-5xl">👋</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink">What should we call you?</h2>
              <p className="mt-1 text-sm text-ink/60">Sakhi wants to greet you by name.</p>
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-peach/70 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry/40"
              autoFocus
            />
            <Button
              fullWidth
              size="lg"
              className="mt-6"
              disabled={!name.trim()}
              onClick={() => setStep(2)}
            >
              Continue →
            </Button>
          </Card>
        )}

        {/* Step 2 — Age group */}
        {step === 2 && (
          <Card>
            <div className="text-center mb-6">
              <span className="text-5xl">🌸</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink">Which age group are you in?</h2>
              <p className="mt-1 text-sm text-ink/60">This helps Sakhi personalise your experience.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {AGE_GROUPS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setSelectedAge(g.value)}
                  className={[
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                    selectedAge === g.value
                      ? "border-berry/50 bg-lavender/60 shadow-sm"
                      : "border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/30",
                  ].join(" ")}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{g.label}</p>
                    <p className="text-xs text-ink/50">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">← Back</Button>
              <Button
                className="flex-1"
                disabled={!selectedAge}
                onClick={() => setStep(3)}
              >
                Continue →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3 — Language */}
        {step === 3 && (
          <Card>
            <div className="text-center mb-6">
              <span className="text-5xl">🌍</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink">Choose your language</h2>
              <p className="mt-1 text-sm text-ink/60">Sakhi speaks your language, literally.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setSelectedLang(l.value)}
                  className={[
                    "flex flex-col items-center rounded-2xl border p-3 transition-all duration-200",
                    selectedLang === l.value
                      ? "border-berry/50 bg-lavender/60 shadow-sm"
                      : "border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/30",
                  ].join(" ")}
                >
                  <span className="text-base font-semibold text-ink">{l.native}</span>
                  <span className="text-xs text-ink/50">{l.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">← Back</Button>
              <Button
                className="flex-1"
                isLoading={isLoading}
                onClick={handleFinish}
              >
                Get started 🌸
              </Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
