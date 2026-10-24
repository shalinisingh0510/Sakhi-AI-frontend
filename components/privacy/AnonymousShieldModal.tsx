"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useAnonymousModalStore } from "@/lib/anonymous-modal-store";
import { authApi } from "@/lib/api";
import { normalizeUser } from "@/lib/api-config";
import {
  ShieldCheck,
  Lock,
  Key,
  Copy,
  Check,
  Download,
  EyeOff,
  ArrowRight,
  RefreshCw,
  UserPlus,
  AlertTriangle,
  X,
  Sparkles,
} from "lucide-react";

export function AnonymousShieldModal() {
  const { isOpen, activeTab, closeModal, setActiveTab } = useAnonymousModalStore();
  const { user, token, login, togglePanicBlur } = useAuthStore();

  const [copied, setCopied] = useState(false);
  const [restoreKeyInput, setRestoreKeyInput] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const [convertName, setConvertName] = useState("");
  const [convertEmail, setConvertEmail] = useState("");
  const [convertPassword, setConvertPassword] = useState("");
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [convertSuccess, setConvertSuccess] = useState(false);

  const isAnonymous = user?.isAnonymous ?? false;
  const recoveryKey = user?.recoveryKey ?? "SAKHI-ANON-PROTECTED";

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const text = `SAKHI AI ANONYMOUS RECOVERY KEY
-------------------------------------------
Key: ${recoveryKey}
Generated: ${new Date().toISOString()}

KEEP THIS KEY CONFIDENTIAL.
Because Sakhi AI Anonymous Mode does not store your name or email,
this recovery key is the ONLY way to restore your private cycle and health logs
on another device or browser without identifying yourself.
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sakhi-anonymous-recovery-key.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreKeyInput.trim()) return;

    setRestoreLoading(true);
    setRestoreError(null);

    try {
      const res = await authApi.restoreAnonymous(restoreKeyInput.trim());
      const normalized = normalizeUser(res.user);
      login(normalized, res.access_token);
      closeModal();
    } catch (err: unknown) {
      setRestoreError(
        err instanceof Error ? err.message : "Failed to restore session. Please check key."
      );
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setConvertLoading(true);
    setConvertError(null);

    try {
      const res = await authApi.convertAnonymous(
        {
          name: convertName.trim(),
          email: convertEmail.trim(),
          password: convertPassword,
        },
        token
      );
      const normalized = normalizeUser(res.user);
      login(normalized, res.access_token);
      setConvertSuccess(true);
      setTimeout(() => {
        closeModal();
        setConvertSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      setConvertError(
        err instanceof Error ? err.message : "Failed to convert account. Please try again."
      );
    } finally {
      setConvertLoading(false);
    }
  };

  const handleStartAnonymousFresh = async () => {
    try {
      const res = await authApi.createAnonymous();
      const normalized = normalizeUser(res.user);
      login(normalized, res.access_token);
      setActiveTab("shield");
    } catch (err) {
      console.error("Failed to initialize anonymous mode:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shield-title"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-peach/50 bg-white p-6 sm:p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Soft background accents */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-peach/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-lavender/30 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full p-2 text-ink/40 hover:bg-peach/30 hover:text-ink transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-peach/40 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-berry/15 to-rose/20 text-berry shadow-2xs">
            <ShieldCheck className="h-6 w-6 text-berry" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-berry/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-berry uppercase">
              <Lock className="h-3 w-3" />
              <span>Sakhi AI Privacy Sanctuary</span>
            </div>
            <h2 id="shield-title" className="font-display text-xl font-bold text-ink mt-0.5">
              Anonymous Mode Center
            </h2>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-peach/30 my-4 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("shield")}
            className={[
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "shield"
                ? "bg-berry text-white shadow-2xs"
                : "text-ink/60 hover:bg-peach/30 hover:text-ink",
            ].join(" ")}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Privacy Shield</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("restore")}
            className={[
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeTab === "restore"
                ? "bg-berry text-white shadow-2xs"
                : "text-ink/60 hover:bg-peach/30 hover:text-ink",
            ].join(" ")}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Restore with Key</span>
          </button>

          {isAnonymous && (
            <button
              type="button"
              onClick={() => setActiveTab("convert")}
              className={[
                "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeTab === "convert"
                  ? "bg-berry text-white shadow-2xs"
                  : "text-ink/60 hover:bg-peach/30 hover:text-ink",
              ].join(" ")}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Link Email (Convert)</span>
            </button>
          )}
        </div>

        {/* TAB 1: PRIVACY SHIELD & RECOVERY KEY */}
        {activeTab === "shield" && (
          <div className="space-y-4">
            {isAnonymous ? (
              <>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                      Anonymous Mode is Active
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                      Your menstrual, symptom, and health logs are mathematically decoupled from your personal identity. No email, name, or device IP address can be tied to your records.
                    </p>
                  </div>
                </div>

                {/* Secret Recovery Key Card */}
                <div className="rounded-2xl border border-peach/80 bg-gradient-to-br from-cream to-peach/20 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/70 flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-berry" />
                      Your Private Anonymous Recovery Key
                    </span>
                    <span className="text-[10px] text-berry font-semibold bg-peach/40 px-2 py-0.5 rounded-full">
                      Secret Key
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-xl border border-peach/80 bg-white px-3 py-2.5 font-mono text-sm font-semibold text-ink shadow-inner overflow-x-auto">
                    <span>{recoveryKey}</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 rounded-lg bg-peach/40 px-2.5 py-1 text-xs font-sans font-medium text-berry hover:bg-peach/70 transition-all shrink-0"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-ink/65 leading-relaxed">
                    Save this key securely. Because Sakhi AI blinded itself to who you are, this key is the only credential to restore your tracking data if you change phones or clear cookies.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 rounded-xl border border-peach/80 bg-white px-3 py-1.5 text-xs font-semibold text-ink/80 hover:bg-peach/30 transition-all shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5 text-berry" />
                      <span>Download Key (.txt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeModal();
                        togglePanicBlur();
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-peach/80 bg-white px-3 py-1.5 text-xs font-semibold text-ink/80 hover:bg-peach/30 transition-all shadow-2xs"
                    >
                      <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                      <span>Test Panic Blur (Alt+H)</span>
                    </button>
                  </div>
                </div>

                {/* Decoupling Proof Points */}
                <div className="grid grid-cols-2 gap-2 text-xs text-ink/75 pt-1">
                  <div className="flex items-center gap-2 rounded-xl bg-peach/20 p-2.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Zero names or emails stored</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-peach/20 p-2.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Oblivious HTTP routing architecture</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-peach/40 text-berry">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-ink">
                    Switch to Anonymous Mode
                  </h3>
                  <p className="text-xs text-ink/70 max-w-md mx-auto leading-relaxed">
                    Want complete peace of mind? You can start tracking your cycles, symptoms, and health metrics under full mathematical anonymity without personal accounts.
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleStartAnonymousFresh}
                    className="flex items-center gap-2 rounded-2xl bg-berry px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-berry/90 transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Enable Anonymous Mode Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESTORE WITH RECOVERY KEY */}
        {activeTab === "restore" && (
          <form onSubmit={handleRestore} className="space-y-4">
            <div className="rounded-2xl border border-peach/60 bg-peach/15 p-3.5 text-xs text-ink/80 leading-relaxed">
              Enter your 16-character recovery key (e.g., <code className="font-mono font-semibold text-berry">SAKHI-ANON-XXXX-YYYY-ZZZZ</code>) to restore your previous anonymous health logs onto this device.
            </div>

            {restoreError && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{restoreError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Anonymous Recovery Key
              </label>
              <input
                type="text"
                value={restoreKeyInput}
                onChange={(e) => setRestoreKeyInput(e.target.value.toUpperCase())}
                placeholder="SAKHI-ANON-ABCD-EFGH-..."
                className="w-full rounded-2xl border border-peach/80 bg-white px-4 py-3 font-mono text-sm tracking-wide text-ink placeholder:text-ink/30 focus:border-berry focus:outline-none focus:ring-2 focus:ring-berry/20"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("shield")}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-peach/30 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={restoreLoading || !restoreKeyInput.trim()}
                className="flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-berry/90 transition-all disabled:opacity-50"
              >
                {restoreLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                <span>Restore My Health Logs</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CONVERT ANONYMOUS ACCOUNT */}
        {activeTab === "convert" && (
          <form onSubmit={handleConvert} className="space-y-3.5">
            <div className="rounded-2xl border border-peach/60 bg-peach/15 p-3.5 text-xs text-ink/80 leading-relaxed">
              Ready to claim your account? Link your email to enable cloud sync across all your phones and browsers. All your existing cycle and symptom history will be seamlessly preserved!
            </div>

            {convertError && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{convertError}</span>
              </div>
            )}

            {convertSuccess && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Account converted successfully!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Your Name</label>
              <input
                type="text"
                value={convertName}
                onChange={(e) => setConvertName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full rounded-xl border border-peach/80 bg-white px-3.5 py-2 text-xs text-ink placeholder:text-ink/30 focus:border-berry focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Email Address</label>
              <input
                type="email"
                value={convertEmail}
                onChange={(e) => setConvertEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full rounded-xl border border-peach/80 bg-white px-3.5 py-2 text-xs text-ink placeholder:text-ink/30 focus:border-berry focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Create Password</label>
              <input
                type="password"
                value={convertPassword}
                onChange={(e) => setConvertPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-peach/80 bg-white px-3.5 py-2 text-xs text-ink placeholder:text-ink/30 focus:border-berry focus:outline-none"
                required
                minLength={8}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("shield")}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-peach/30 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={convertLoading || !convertEmail || !convertPassword || !convertName}
                className="flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-berry/90 transition-all disabled:opacity-50"
              >
                {convertLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                <span>Convert to Full Account</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
