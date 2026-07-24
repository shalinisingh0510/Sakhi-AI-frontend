"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const LANG_LABELS: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  mr: "मराठी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ",
  or: "ଓଡ଼ିଆ",
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const t = useTranslations("Profile");

  const [form, setForm] = useState({ name: user?.name ?? "" });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name: form.name });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const ageGroup = user?.ageGroup ?? "";
  const ageLabel = ageGroup ? t(`ageGroups.${ageGroup}`) : "—";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mb-8 text-sm text-ink/60">{t("subtitle")}</p>

      <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry text-3xl font-bold text-white shadow-soft">
          {user?.name?.[0]?.toUpperCase() ?? "S"}
        </div>
        <div>
          <p className="text-lg font-semibold text-ink">{user?.name ?? "—"}</p>
          <p className="text-sm text-ink/60">{user?.email ?? "—"}</p>
          <span className="mt-1 inline-block rounded-full bg-blush px-3 py-0.5 text-xs font-medium text-berry">
            {ageLabel}
          </span>
        </div>
      </div>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold text-ink">{t("editTitle")}</h2>
        {saved && (
          <div className="mb-4 rounded-2xl border border-moss/30 bg-mint px-4 py-3 text-sm font-medium text-moss" role="status">
            {t("saved")}
          </div>
        )}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label={t("displayName")}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={t("namePlaceholder")}
          />
          <Input
            label={t("emailLabel")}
            value={user?.email ?? ""}
            disabled
            hint={t("emailHint")}
          />
          <Button type="submit" isLoading={isSaving} size="md" className="self-start">
            {t("saveChanges")}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card padding="sm">
          <p className="mb-1 text-xs text-ink/50">{t("ageGroup")}</p>
          <p className="font-semibold text-ink">{ageLabel}</p>
        </Card>
        <Card padding="sm">
          <p className="mb-1 text-xs text-ink/50">{t("language")}</p>
          <p className="font-semibold text-ink">{LANG_LABELS[user?.language ?? ""] ?? "—"}</p>
        </Card>
      </div>
    </div>
  );
}



