"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { getHighContrast, setHighContrast } from "@/components/accessibility/AccessibilityInit";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Key, EyeOff, UserPlus } from "lucide-react";

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
  const { user, updateUser, logout, togglePanicBlur } = useAuthStore();
  const { openModal } = useAnonymousModalStore();
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
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

      {/* Sakhi AI Anonymous Mode & Privacy Sanctuary */}
      <Card className="mb-6 border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-ink">Sakhi AI Anonymous Mode</h2>
              <p className="text-xs text-ink/60">Decoupled identity & zero-knowledge tracking</p>
            </div>
          </div>
          <span
            className={[
              "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
              user?.isAnonymous
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-stone-100 text-stone-600 border border-stone-200",
            ].join(" ")}
          >
            {user?.isAnonymous ? "Active 🔒" : "Inactive"}
          </span>
        </div>

        <p className="text-xs text-ink/75 leading-relaxed mt-2 mb-4">
          {user?.isAnonymous
            ? "Your account is running in Anonymous Mode. No name, email, or IP address is tied to your reproductive and mental health logs. Your data is protected by mathematical oblivious decoupling."
            : "Protect sensitive cycle and health entries. In Anonymous Mode, all records are stored under an abstract token without any personal identifiers."}
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-peach/40">
          <Button
            size="sm"
            onClick={() => openModal("shield")}
            className="flex items-center gap-1.5 bg-emerald-800 text-white hover:bg-emerald-900 border-none"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{user?.isAnonymous ? "View Shield & Key" : "Enable Anonymous Mode"}</span>
          </Button>

          {user?.isAnonymous && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openModal("restore")}
                className="flex items-center gap-1.5 border-emerald-300 text-emerald-900 hover:bg-emerald-50"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Restore Key</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => openModal("convert")}
                className="flex items-center gap-1.5 border-emerald-300 text-emerald-900 hover:bg-emerald-50"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Link Email</span>
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={togglePanicBlur}
            className="flex items-center gap-1.5 border-peach/80 text-ink/80 hover:bg-peach/30 ml-auto"
            title="Instant Privacy Hide (Alt+H)"
          >
            <EyeOff className="h-3.5 w-3.5 text-amber-600" />
            <span>Panic Hide (Alt+H)</span>
          </Button>
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



