"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type SupportedLanguage } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(user?.language ?? "en");
  const [saved, setSaved] = useState(false);

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
      <h1 className="font-display text-3xl font-bold text-ink mb-2">Settings ⚙️</h1>
      <p className="text-sm text-ink/60 mb-8">Customise your Sakhi AI experience.</p>

      {saved && (
        <div className="mb-6 rounded-2xl bg-mint border border-moss/30 px-4 py-3 text-sm text-moss font-medium" role="status">
          ✓ Settings saved!
        </div>
      )}

      {/* Language */}
      <Card className="mb-6">
        <h2 className="font-semibold text-ink mb-1">Language</h2>
        <p className="text-xs text-ink/50 mb-4">Choose the language Sakhi talks to you in.</p>
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
          Save language
        </Button>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <h2 className="font-semibold text-ink mb-1">Notifications</h2>
        <p className="text-xs text-ink/50 mb-4">Get gentle reminders to continue learning.</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Daily learning reminder</p>
            <p className="text-xs text-ink/50">A soft nudge to keep your streak going.</p>
          </div>
          <button
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications((n) => !n)}
            className={[
              "relative h-7 w-12 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-berry/40",
              notifications ? "bg-gradient-to-r from-rose to-berry" : "bg-peach/60",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300",
                notifications ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      </Card>

      {/* Account */}
      <Card>
        <h2 className="font-semibold text-ink mb-4">Account</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">{user?.email}</p>
              <p className="text-xs text-ink/50">Account email</p>
            </div>
          </div>
          <hr className="border-peach/50" />
          <Button
            variant="danger"
            size="sm"
            className="self-start"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
}
