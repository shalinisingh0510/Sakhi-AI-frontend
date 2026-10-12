"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquareQuote, Copy, Check, CheckSquare, Square, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

export function ConversationScripts() {
  const [copiedPhrase, setCopiedPhrase] = useState(false);

  // Persistent School Kit state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    pads: true,
    underwear: true,
    ziploc: false,
    wipes: false,
    note: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sakhi_caregiver_checklist");
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleItem = (key: string) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    try {
      localStorage.setItem("sakhi_caregiver_checklist", JSON.stringify(updated));
    } catch {}
  };

  const handleCopyPhrase = () => {
    const phrase = "Whenever you see blood from a scraped knee, it means you got hurt. But the blood that comes during a period is completely different. It's a healthy sign that your body is making a warm little nest, and when it isn't needed, it gently washes away.";
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(true);
    setTimeout(() => setCopiedPhrase(false), 2500);
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div id="scripts" className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
            <MessageSquareQuote size={13} />
            <span>VERBATIM SCRIPTS &amp; PRACTICE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
            How to Start the Conversation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Use these battle-tested, pediatrician-backed scripts and checklists when you are not sure what words to choose.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400 hidden sm:inline-flex items-center gap-1">
          <Sparkles size={12} className="text-berry" />
          <span>Tap dialogues to copy or practice aloud</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Dialogue Script #1 */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md bg-berry/10 px-2.5 py-0.5 text-[11px] font-bold text-berry">
                Dialogue Script #1
              </span>
              <span className="text-xs text-slate-400">2 min read</span>
            </div>

            <h3 className="font-display text-base font-bold text-ink mt-1">
              Explaining Blood Without Fear
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              When she sees a red stain or asks why girls bleed every month:
            </p>

            {/* Script Speech Bubble */}
            <div className="mt-3.5 rounded-xl border border-berry/15 bg-[#FCF8FA] p-3.5 text-xs text-ink/90 leading-relaxed font-serif italic">
              &ldquo;Whenever you see blood from a scraped knee, it means you got hurt. But the blood that comes during a period is completely different. It&apos;s a healthy sign that your body is making a warm little nest. When it isn&apos;t needed, it gently cleans itself out.&rdquo;
            </div>

            {/* Why this works */}
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 leading-snug border border-slate-100">
              <strong className="text-slate-800">Why this works:</strong> It breaks the cognitive link between blood and trauma, reassuring her nervous system.
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
            <button
              onClick={handleCopyPhrase}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-all px-3 py-1.5 rounded-xl ${
                copiedPhrase
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {copiedPhrase ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedPhrase ? "Copied Phrase!" : "Copy Core Phrase"}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-medium">Spoken script</span>
          </div>
        </div>

        {/* Card 2: Tactile Checklist (First Period School Kit) */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200/60">
                Tactile Checklist
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {checkedCount} / 5 Packed
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-ink mt-1">
              First Period School Kit
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pack a discreet pouch together so she feels in control everywhere:
            </p>

            {/* Interactive Checkbox Items */}
            <div className="mt-3 space-y-2">
              {[
                { key: "pads", label: "2 Regular Cotton Sanitary Pads" },
                { key: "underwear", label: "1 Spare pair of cotton underwear" },
                { key: "ziploc", label: "Biodegradable disposal zip-pouch" },
                { key: "wipes", label: "Unscented intimate soothing wipes" },
                { key: "note", label: "Small note with words of love & your phone #" },
              ].map(({ key, label }) => {
                const checked = !!checklist[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleItem(key)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors ${
                      checked
                        ? "bg-emerald-50/70 text-slate-800 line-through opacity-85"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {checked ? (
                      <CheckSquare size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Square size={15} className="text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Keep inside school backpack</span>
            <span className="font-semibold text-berry">5 items total</span>
          </div>
        </div>

        {/* Card 3: Family Harmony: Navigating Cultural Taboos */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-800 border border-purple-200/60">
                Family Harmony
              </span>
              <span className="text-xs text-slate-400">Cultural Care</span>
            </div>

            <h3 className="font-display text-base font-bold text-ink mt-1">
              Navigating Cultural Taboos
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Handling domestic rules (kitchen exclusions, temple entry myths) with elder family members:
            </p>

            <div className="mt-3.5 rounded-xl border border-purple-100 bg-[#FAF7FC] p-3.5 text-xs text-ink/90 leading-relaxed">
              <strong className="text-purple-900 block not-italic mb-1">Bridge the generation gap:</strong>
              &ldquo;In grandmother&apos;s time, resting during periods was the only way women got a break from harsh labor. You are never dirty. Your body is doing sacred, natural work.&rdquo;
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-purple-900">
              <ShieldAlert size={12} className="text-purple-700 shrink-0" />
              <span>Protects self-worth while respecting traditions</span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              href="/learn/topics/caregivers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F1F36] hover:text-berry transition-colors"
            >
              <span>Read complete cultural guide</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
