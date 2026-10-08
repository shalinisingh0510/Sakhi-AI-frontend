"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore, type AgeGroup, type SupportedLanguage } from "@/lib/auth-store";
import { profileApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const AGE_GROUPS: { value: AgeGroup; emoji: string; label: string; desc: string }[] = [
  { value: "10-13",    emoji: "🌱", label: "10–13 years",         desc: "Preteen" },
  { value: "14-18",   emoji: "🌸", label: "14–18 years",         desc: "Teen" },
  { value: "18+",     emoji: "🌺", label: "18+ years",           desc: "Adult" },
  { value: "caregiver", emoji: "💛", label: "Caregiver / Mother", desc: "Support role" },
];

const LANGUAGES: { value: SupportedLanguage; label: string; native: string }[] = [
  { value: "en", label: "English",  native: "English" },
  { value: "hi", label: "Hindi",    native: "हिन्दी" },
  { value: "bn", label: "Bengali",  native: "বাংলা" },
  { value: "mr", label: "Marathi",  native: "मराठी" },
  { value: "ta", label: "Tamil",    native: "தமிழ்" },
  { value: "te", label: "Telugu",   native: "తెలుగు" },
  { value: "kn", label: "Kannada",  native: "ಕನ್ನಡ" },
  { value: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { value: "pa", label: "Punjabi",  native: "ਪੰਜਾਬੀ" },
  { value: "or", label: "Odia",     native: "ଓଡ଼ିଆ" },
];

export default function ProfilePage() {
  const { user, token, updateUser } = useAuthStore();
  const t = useTranslations("Profile");

  const [name, setName]         = useState(user?.name ?? "");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(user?.ageGroup ?? "18+");
  const [language, setLanguage] = useState<SupportedLanguage>(user?.language ?? "en");
  const [saved, setSaved]       = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!isDemoMode() && token) {
        const { user: updated } = await profileApi.updateProfile(
          { name, ageGroup, language },
          token
        );
        const normalized = normalizeUser(updated, user?.email);
        updateUser({
          name: normalized.name,
          ageGroup: normalized.ageGroup,
          language: normalized.language,
        });
      } else {
        await demoDelay(800);
        updateUser({ name, ageGroup, language });
      }
    } catch {
      // Fallback: update locally even if API call fails
      updateUser({ name, ageGroup, language });
    } finally {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const displayAgeGroup = AGE_GROUPS.find((g) => g.value === (user?.ageGroup ?? ageGroup));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mb-8 text-sm text-ink/60">{t("subtitle")}</p>

      {/* Avatar & quick info */}
      <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry text-3xl font-bold text-white shadow-soft">
          {user?.name?.[0]?.toUpperCase() ?? "S"}
        </div>
        <div>
          <p className="text-lg font-semibold text-ink">{user?.name ?? "—"}</p>
          <p className="text-sm text-ink/60">{user?.email ?? "—"}</p>
          {displayAgeGroup && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blush px-3 py-0.5 text-xs font-medium text-berry">
              {displayAgeGroup.emoji} {displayAgeGroup.label}
            </span>
          )}
        </div>
      </div>

      {/* Save success banner */}
      {saved && (
        <div
          className="mb-6 rounded-2xl border border-moss/30 bg-mint px-4 py-3 text-sm font-medium text-moss"
          role="status"
        >
          {t("saved")}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Basic Info */}
        <Card>
          <h2 className="mb-4 font-semibold text-ink">{t("editTitle")}</h2>
          <div className="flex flex-col gap-4">
            <Input
              label={t("displayName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
            />
            <Input
              label={t("emailLabel")}
              value={user?.email ?? ""}
              disabled
              hint={t("emailHint")}
            />
          </div>
        </Card>

        {/* Age Group Selector */}
        <Card>
          <h2 className="mb-1 font-semibold text-ink">{t("ageGroup")}</h2>
          <p className="mb-4 text-xs text-ink/50">{t("ageGroupHint")}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AGE_GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setAgeGroup(g.value)}
                className={[
                  "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                  ageGroup === g.value
                    ? "border-berry/50 bg-lavender/60 shadow-sm"
                    : "border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/30",
                ].join(" ")}
              >
                <span className="text-2xl">{g.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{g.label}</p>
                  <p className="text-xs text-ink/50">{g.desc}</p>
                </div>
                {ageGroup === g.value && (
                  <span className="text-sm font-bold text-berry">✓</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Language Selector */}
        <Card>
          <h2 className="mb-1 font-semibold text-ink">{t("language")}</h2>
          <p className="mb-4 text-xs text-ink/50">{t("languageHint")}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLanguage(l.value)}
                className={[
                  "relative flex flex-col items-center rounded-2xl border p-3 transition-all duration-200",
                  language === l.value
                    ? "border-berry/50 bg-lavender/60 shadow-sm"
                    : "border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/30",
                ].join(" ")}
              >
                <span className="text-base font-semibold text-ink">{l.native}</span>
                <span className="text-xs text-ink/50">{l.label}</span>
                {language === l.value && (
                  <span className="absolute top-1.5 right-2 text-xs font-bold text-berry">✓</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Save button */}
        <Button type="submit" isLoading={isSaving} size="md" className="self-start">
          {t("saveChanges")}
        </Button>
      </form>
    </div>
  );
}
