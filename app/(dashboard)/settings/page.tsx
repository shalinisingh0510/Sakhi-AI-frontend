"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";
import { getHighContrast, setHighContrast } from "@/components/accessibility/AccessibilityInit";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { profileApi } from "@/lib/api";
import { demoDelay, isDemoMode, normalizeUser } from "@/lib/api-config";

const LANGUAGES: { value: SupportedLanguage; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
  { value: "bn", label: "Bengali", native: "বাংলা" },
  { value: "mr", label: "Marathi", native: "मराठी" },
  { value: "ta", label: "Tamil", native: "தமிழ்" },
  { value: "te", label: "Telugu", native: "తెలుగు" },
  { value: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { value: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { value: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { value: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const t = useTranslations("Settings");
  const tNav = useTranslations("Navigation");

  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrastState] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(user?.language ?? "en");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setHighContrastState(getHighContrast());
  }, []);

  function handleSaveLang() {
    updateUser({ language: selectedLang });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mb-8 text-sm text-ink/60">{t("subtitle")}</p>

      {saved && (
        <div className="mb-6 rounded-2xl border border-moss/30 bg-mint px-4 py-3 text-sm font-medium text-moss" role="status">
          {t("saved")}
        </div>
      )}

      <Card className="mb-6">
        <h2 className="mb-1 font-semibold text-ink">{t("languageTitle")}</h2>
        <p className="mb-4 text-xs text-ink/50">{t("languageDesc")}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => setSelectedLang(l.value)}
              className={[
                "flex flex-col items-center rounded-2xl border p-3 text-center transition-all",
                selectedLang === l.value
                  ? "border-berry/50 bg-lavender/60 shadow-sm"
                  : "border-peach/60 bg-white hover:border-berry/20 hover:bg-blush/30",
              ].join(" ")}
            >
              <span className="text-sm font-semibold text-ink">{l.native}</span>
              <span className="text-xs text-ink/50">{l.label}</span>
            </button>
          ))}
        </div>
        <Button size="sm" className="mt-4" onClick={handleSaveLang}>
          {t("saveLanguage")}
        </Button>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-1 font-semibold text-ink">{t("highContrastTitle")}</h2>
        <p className="mb-4 text-xs text-ink/50">{t("highContrastDesc")}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{t("highContrastLabel")}</p>
          <button
            type="button"
            role="switch"
            aria-checked={highContrast}
            aria-label={t("highContrastLabel")}
            onClick={() => {
              const next = !highContrast;
              setHighContrastState(next);
              setHighContrast(next);
            }}
            className={[
              "relative h-7 w-12 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-berry/40",
              highContrast ? "bg-gradient-to-r from-rose to-berry" : "bg-peach/60",
            ].join(" ")}
          >
            <span
              className={[
                "absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300",
                highContrast ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-1 font-semibold text-ink">{t("notificationsTitle")}</h2>
        <p className="mb-4 text-xs text-ink/50">{t("notificationsDesc")}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{t("dailyReminder")}</p>
            <p className="text-xs text-ink/50">{t("dailyReminderDesc")}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            aria-label={t("notificationsSwitchLabel")}
            onClick={() => setNotifications((n) => !n)}
            className={[
              "relative h-7 w-12 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-berry/40",
              notifications ? "bg-gradient-to-r from-rose to-berry" : "bg-peach/60",
            ].join(" ")}
          >
            <span
              className={[
                "absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300",
                notifications ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink">{t("accountTitle")}</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">{user?.email}</p>
              <p className="text-xs text-ink/50">{t("accountEmail")}</p>
            </div>
          </div>
          <hr className="border-peach/50" />
          <Button variant="danger" size="sm" className="self-start" onClick={handleLogout}>
            {tNav("signOut")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
