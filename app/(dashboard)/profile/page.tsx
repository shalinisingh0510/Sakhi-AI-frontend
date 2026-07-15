"use client";

import { useState, FormEvent } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
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

  const AGE_LABELS: Record<string, string> = {
    "10-13": "10–13 years",
    "14-18": "14–18 years",
    "18+": "18+ years",
    caregiver: "Caregiver / Mother",
  };

  const LANG_LABELS: Record<string, string> = {
    en: "English", hi: "हिन्दी", bn: "বাংলা", mr: "मराठी",
    ta: "தமிழ்", te: "తెలుగు", kn: "ಕನ್ನಡ", gu: "ગુજરાતી",
    pa: "ਪੰਜਾਬੀ", or: "ଓଡ଼ିଆ",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl font-bold text-ink mb-2">My Profile 👤</h1>
      <p className="text-sm text-ink/60 mb-8">Manage your personal information and preferences.</p>

      {/* Avatar */}
      <div className="mb-8 flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry text-3xl font-bold text-white shadow-soft">
          {user?.name?.[0]?.toUpperCase() ?? "S"}
        </div>
        <div>
          <p className="font-semibold text-ink text-lg">{user?.name ?? "—"}</p>
          <p className="text-sm text-ink/60">{user?.email ?? "—"}</p>
          <span className="mt-1 inline-block rounded-full bg-blush px-3 py-0.5 text-xs font-medium text-berry">
            {AGE_LABELS[user?.ageGroup ?? ""] ?? user?.ageGroup ?? "—"}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <Card className="mb-6">
        <h2 className="font-semibold text-ink mb-4">Edit Profile</h2>
        {saved && (
          <div className="mb-4 rounded-2xl bg-mint border border-moss/30 px-4 py-3 text-sm text-moss font-medium" role="status">
            ✓ Profile updated successfully!
          </div>
        )}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Display name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
          />
          <Input
            label="Email address"
            value={user?.email ?? ""}
            disabled
            hint="Email cannot be changed."
          />
          <Button type="submit" isLoading={isSaving} size="md" className="self-start">
            Save changes
          </Button>
        </form>
      </Card>

      {/* Info tiles */}
      <div className="grid grid-cols-2 gap-4">
        <Card padding="sm">
          <p className="text-xs text-ink/50 mb-1">Age group</p>
          <p className="font-semibold text-ink">{AGE_LABELS[user?.ageGroup ?? ""] ?? "—"}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-ink/50 mb-1">Language</p>
          <p className="font-semibold text-ink">{LANG_LABELS[user?.language ?? ""] ?? "—"}</p>
        </Card>
      </div>
    </div>
  );
}
