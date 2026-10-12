"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, healthApi } from "@/lib/api";
import { normalizeUser, isDemoMode } from "@/lib/api-config";
import { useAuthStore, type User } from "@/lib/auth-store";
import { Loader2, X, User as UserIcon } from "lucide-react";

interface GoogleAuthButtonProps {
  mode?: "signin" | "signup";
  onSuccess?: () => void;
  onError?: (errMessage: string) => void;
  className?: string;
}

export function GoogleAuthButton({
  mode = "signin",
  onSuccess,
  onError,
  className = "",
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [loading, setLocalLoading] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const buttonText = mode === "signup" ? "Sign up with Google" : "Continue with Google";

  async function handleGoogleSuccess(email: string, name: string) {
    setLocalLoading(true);
    setLoading(true);
    setShowChooser(false);

    try {
      if (isDemoMode()) {
        const demoUser: User = {
          id: "google-demo-1",
          name: name || "Priya Sharma",
          email,
          ageGroup: "18+",
          language: "en",
          role: "user",
          onboardingComplete: true,
        };
        login(demoUser, "demo-token-google-123");
        if (onSuccess) onSuccess();
        else router.push("/dashboard");
        return;
      }

      const res = await authApi.loginWithGoogle({ email, name });
      const normalized = normalizeUser(res.user, email);

      try {
        await healthApi.getProfile(res.access_token);
        normalized.onboardingComplete = true;
      } catch {
        normalized.onboardingComplete = false;
      }

      login(normalized, res.access_token);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(normalized.onboardingComplete ? "/dashboard" : "/onboarding");
      }
    } catch (err: unknown) {
      console.error("Google Auth failed", err);
      const msg = err instanceof Error ? err.message : "Google authentication failed. Please try again.";
      if (onError) onError(msg);
      else alert(msg);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  }

  function handleClick() {
    // Check if Google Client ID is configured in the environment
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // If client ID exists and Google GIS is loaded
    if (googleClientId && typeof window !== "undefined" && (window as unknown as { google?: { accounts?: { id?: unknown } } }).google?.accounts?.id) {
      try {
        const google = (window as unknown as { 
          google: { 
            accounts: { 
              id: { 
                initialize: (options: { client_id: string; callback: (res: { credential?: string }) => void }) => void; 
                prompt: () => void; 
              }; 
            }; 
          }; 
        }).google;
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: { credential?: string }) => {
            if (response.credential) {
              setLocalLoading(true);
              try {
                const res = await authApi.loginWithGoogle({ credential: response.credential });
                const normalized = normalizeUser(res.user, res.user.email);
                login(normalized, res.access_token);
                if (onSuccess) onSuccess();
                else router.push(normalized.onboardingComplete ? "/dashboard" : "/onboarding");
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Google sign-in failed.";
                if (onError) onError(msg);
              } finally {
                setLocalLoading(false);
              }
            }
          },
        });
        google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn("GIS prompt fallback to chooser", e);
      }
    }

    // Default: Open the clean, realistic Google account chooser
    setShowChooser(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-xs active:scale-[0.99] disabled:opacity-60 ${className}`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-berry" />
        ) : (
          <GoogleSvgIcon className="h-5 w-5 shrink-0" />
        )}
        <span>{loading ? "Connecting to Google..." : buttonText}</span>
      </button>

      {/* Google Account Chooser Modal (for instant developer & user testing without external OAuth credentials) */}
      {showChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowChooser(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
              <GoogleSvgIcon className="h-7 w-7 mb-2" />
              <h3 className="font-display text-base font-bold text-slate-800">
                Choose an account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                to continue to <strong className="text-berry">Sakhi AI</strong>
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {/* Account 1 */}
              <button
                type="button"
                onClick={() => handleGoogleSuccess("priya.sharma@gmail.com", "Priya Sharma")}
                className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose to-berry text-sm font-bold text-white shadow-2xs">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">Priya Sharma</p>
                  <p className="text-[11px] text-slate-500 truncate">priya.sharma@gmail.com</p>
                </div>
              </button>

              {/* Account 2 */}
              <button
                type="button"
                onClick={() => handleGoogleSuccess("ananya.verma@gmail.com", "Ananya Verma")}
                className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white shadow-2xs">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">Ananya Verma</p>
                  <p className="text-[11px] text-slate-500 truncate">ananya.verma@gmail.com</p>
                </div>
              </button>

              {/* Custom Google Account Option */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left text-xs font-semibold text-berry transition-all hover:bg-blush/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-peach/60 text-berry">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              ) : (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-berry focus:ring-1 focus:ring-berry/20"
                  />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-berry focus:ring-1 focus:ring-berry/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customEmail.includes("@")) {
                        alert("Please enter a valid email address");
                        return;
                      }
                      handleGoogleSuccess(customEmail, customName || customEmail.split("@")[0]);
                    }}
                    className="w-full rounded-xl bg-berry py-2 text-xs font-semibold text-white shadow-2xs hover:bg-berry/90 transition-all"
                  >
                    Continue with this Google Account
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-400">
              To continue, Google will share your name and email address with Sakhi AI.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function GoogleSvgIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}
