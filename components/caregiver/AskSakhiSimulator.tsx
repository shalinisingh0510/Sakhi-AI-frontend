"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Sparkles, Shield, Send, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

interface ScenarioResponse {
  question: string;
  script: string;
  why: string;
}

const PRESET_SCENARIOS: Record<string, ScenarioResponse> = {
  cup: {
    question: "She found my menstrual cup in the bathroom drawer and asked what this little cup is for...",
    script: "“You found my menstrual cup! When grown women have their monthly cycle, we use different comfortable tools to catch the healthy fluid. Some people use soft cotton pads, and some use this flexible silicone cup that bends like a soft flower petal. When your body grows up, you get to pick whatever feels most comfortable for you.”",
    why: "Demystifies the object immediately without snatching it away. Normalizes that menstruation involves healthy choices, not secrets."
  },
  bleed: {
    question: "She is terrified she will bleed out or empty all the blood in her body during her period...",
    script: "“I completely understand why that looks scary. But did you know that during a whole week of a period, the total amount that leaves the body is only about 2 to 3 tablespoons? Your body has millions of spoonfuls of blood and makes fresh new blood cells every single second. You cannot bleed out from a period—your body is in total control.”",
    why: "Uses concrete, measurable imagery (2-3 tablespoons) to replace vague terrifying visual assumptions."
  },
  brother: {
    question: "Teaching her brother respect and making sure he doesn't tease her about pads or cramps...",
    script: "“Let’s talk together: Every human on earth was born because a woman’s body has this incredible cycle. When your sister has cramps or carries a pouch, our family supports her with hot water, quiet rest, and respect. In our home, we protect each other, we never tease about bodies doing their job.”",
    why: "Frames menstrual empathy as a family honor code and masculine responsibility rather than a 'girls-only taboo'."
  },
  boys: {
    question: "She asked why boys don't bleed and if it's unfair that only girls have to deal with periods...",
    script: "“It can definitely feel unfair on crampy days! Boys’ bodies go through different puberty changes like voice drops and rapid muscle shifts. Girls’ bodies were given this special rhythm to build and renew new life. But you don't have to carry it alone—everyone in our family is here to support you.”",
    why: "Validates her frustration ('it can feel unfair') instead of dismissing it, while affirming her support system."
  }
};

export function AskSakhiSimulator() {
  const [activeScenario, setActiveScenario] = useState<string>("cup");
  const [customText, setCustomText] = useState<string>(PRESET_SCENARIOS.cup.question);
  const [response, setResponse] = useState<ScenarioResponse | null>(PRESET_SCENARIOS.cup);
  const [loading, setLoading] = useState(false);

  const handleSelectScenario = (key: string) => {
    setActiveScenario(key);
    setCustomText(PRESET_SCENARIOS[key].question);
    setResponse(PRESET_SCENARIOS[key]);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setLoading(true);
    setTimeout(() => {
      // Find matching preset or generate contextual empathetic script
      const matchKey = Object.keys(PRESET_SCENARIOS).find(k => 
        customText.toLowerCase().includes(k) || customText === PRESET_SCENARIOS[k].question
      );

      if (matchKey) {
        setResponse(PRESET_SCENARIOS[matchKey]);
      } else {
        setResponse({
          question: customText,
          script: `“I’m so glad you asked me that. When our bodies grow and change, it’s completely natural to have questions. Menstruation is just your body’s brilliant way of showing it is strong and healthy. Whatever you’re feeling or wondering about, we can always figure it out together without any shame.”`,
          why: "Validates her curiosity, eliminates fear, and reinforces the caregiver as a safe lifelong harbor."
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div id="simulator" className="mb-10 overflow-hidden rounded-3xl border border-[#EDE2E7] bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-berry/20 bg-berry/10 px-3 py-1 text-[11px] font-bold text-berry">
          <Bot size={13} />
          <span>Interactive Simulator</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-2">
          Practice Real Responses with Ask Sakhi (Caregiver Mode)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Unsure how to respond to an unexpected question your child just asked? Ask Sakhi AI for tailored, age-calibrated dialogue suggestions before answering.
        </p>

        {/* Click to test instant scenarios */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Click to test instant scenarios:</span>
          {[
            { id: "cup", label: "“She found my menstrual cup...”" },
            { id: "bleed", label: "“She is scared she will bleed out...”" },
            { id: "brother", label: "“Teaching her brother respect...”" },
            { id: "boys", label: "“Why don’t boys bleed?...”" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectScenario(s.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all shadow-2xs ${
                activeScenario === s.id
                  ? "bg-[#3F1F36] text-white font-semibold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Interface matching Stitch Screenshot 5 */}
      <div className="rounded-2xl border border-berry/20 bg-[#FCF8FA] p-5 sm:p-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-berry">
              <Sparkles size={13} /> Ask Sakhi AI (Caregiver Mode)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700">
              <Shield size={11} /> 100% Private Session
            </span>
          </div>

          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            placeholder="Type your situation or your child's exact question here..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-ink outline-none transition-all placeholder:text-slate-400 focus:border-berry focus:ring-1 focus:ring-berry/20 resize-none shadow-2xs"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">
              Calibrated for age-neutral stigma reduction
            </span>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3F1F36] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#522947] active:scale-98 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RotateCcw size={13} className="animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Get Empathetic Script ✨</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Script Result */}
        {response && (
          <div className="mt-6 border-t border-berry/15 pt-5 animate-fade-in">
            <div className="rounded-xl border border-emerald-200/80 bg-white p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/60">
                  <CheckCircle2 size={11} />
                  <span>Pediatrician-Approved Dialogue</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Ready to speak</span>
              </div>

              <blockquote className="text-xs sm:text-sm text-ink font-serif italic leading-relaxed pt-1">
                {response.script}
              </blockquote>

              <div className="mt-3.5 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                <strong className="text-slate-800">Why this works:</strong> {response.why}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Need deeper custom advice?</span>
                <Link
                  href={`/chat?prompt=${encodeURIComponent("As a caregiver, " + customText)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-berry hover:underline"
                >
                  <span>Continue in Sakhi AI Chat</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
