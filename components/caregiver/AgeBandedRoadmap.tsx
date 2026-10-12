"use client";

import { Sparkles, Compass, MessageCircleHeart, PackageCheck, Clock, Check } from "lucide-react";

interface AgeBandedRoadmapProps {
  activeStage: string;
  onSelectStage: (stage: string) => void;
}

const STAGES_DATA: Record<string, {
  label: string;
  card1: { title: string; desc: string; tag: string };
  card2: { title: string; desc: string; tag: string };
  card3: { title: string; desc: string; tag: string };
}> = {
  "9-11": {
    label: "Ages 9–11 (Preparing Early)",
    card1: {
      title: "What to Expect",
      desc: "Pre-menarche hormonal fluctuations, initial breast budding (thelarche), subtle growth spurts, and heightened questions about physical changes among peers.",
      tag: "Recommended Talk Time: Before age 10"
    },
    card2: {
      title: "Core Conversation Goal",
      desc: "Demystify biology before rumors surface at school. Frame the arrival of menstruation as an incredible sign of body strength, never an injury or illness.",
      tag: "Core Word: Health, Not Hurt"
    },
    card3: {
      title: "Proactive Readiness",
      desc: "Introduce sanitary pads playfully: let her touch the dry weave, pour a spoonful of colored water to see absorbency, and place one discreetly in her backpack.",
      tag: "Practical Demo Exercise"
    }
  },
  "12-14": {
    label: "Ages 12–14 (First Period)",
    card1: {
      title: "What to Expect",
      desc: "Menarche onset. Initial cycles are often anovulatory and irregular (ranging from 21 to 45 days). Mild to moderate cramping, fatigue, and sensitivity to staining.",
      tag: "Benchmark: First 12–24 months are irregular"
    },
    card2: {
      title: "Core Conversation Goal",
      desc: "Normalize flow tracking and bathroom autonomy. Debunk shame around requesting pads from teachers, friends, or fathers. Celebrate bodily autonomy.",
      tag: "Core Word: Ownership & Pride"
    },
    card3: {
      title: "Proactive Readiness",
      desc: "Set up the First Period School Pouch. Explore breathable cotton pads and period underwear. Teach simple disposal hygiene (wrap in paper, bin never toilet).",
      tag: "Action: School Kit Setup"
    }
  },
  "15-18": {
    label: "Ages 15–18 (Cycle Literacy)",
    card1: {
      title: "What to Expect",
      desc: "Maturing ovulatory cycles (24–35 days). Distinct hormonal phases: follicular energy spikes, luteal phase emotional vulnerability, and PMS symptoms.",
      tag: "Benchmark: Watch for severe dysmenorrhea or PCOS"
    },
    card2: {
      title: "Core Conversation Goal",
      desc: "Connect mood, skin, and energy changes to cycle phases. Encourage self-advocacy with healthcare providers for severe pain or unusual heavy bleeding.",
      tag: "Core Word: Hormonal Rhythm"
    },
    card3: {
      title: "Proactive Readiness",
      desc: "Introduce cycle tracking apps (Sakhi Cycle Tracker), iron-rich nutrition habits, heat therapy for cramps, and diverse sustainable products (cups, discs).",
      tag: "Action: Long-term Wellness Toolkit"
    }
  }
};

export function AgeBandedRoadmap({ activeStage, onSelectStage }: AgeBandedRoadmapProps) {
  const currentData = STAGES_DATA[activeStage] || STAGES_DATA["9-11"];

  const STAGE_KEYS = [
    { id: "9-11", label: "Ages 9–11 (Preparing Early)" },
    { id: "12-14", label: "Ages 12–14 (First Period)" },
    { id: "15-18", label: "Ages 15–18 (Cycle Literacy)" },
  ];

  return (
    <div id="roadmap" className="mb-10">
      {/* Header & Stage Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
            <Compass size={13} />
            <span>MILESTONE ROADMAP</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
            Age-Banded Guidance Trackers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Switch stages to reveal pediatric benchmarks and emotional readiness indicators.
          </p>
        </div>

        {/* Stage Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/60 shrink-0">
          {STAGE_KEYS.map((s) => {
            const isActive = activeStage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectStage(s.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#3F1F36] text-white shadow-sm"
                    : "text-slate-600 hover:text-ink hover:bg-white/60"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Guidance Cards matching Stitch Screenshot 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: What to Expect */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-berry/10 text-berry">
              <Sparkles size={16} />
            </div>
            <h3 className="font-display text-base font-bold text-ink">
              {currentData.card1.title}
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {currentData.card1.desc}
            </p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3 flex items-center gap-1.5 text-[11px] font-semibold text-berry">
            <Clock size={12} className="shrink-0" />
            <span className="truncate">{currentData.card1.tag}</span>
          </div>
        </div>

        {/* Card 2: Core Conversation Goal */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-peach/40 text-rose-800">
              <MessageCircleHeart size={16} />
            </div>
            <h3 className="font-display text-base font-bold text-ink">
              {currentData.card2.title}
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {currentData.card2.desc}
            </p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3 flex items-center gap-1.5 text-[11px] font-semibold text-rose-800">
            <Check size={12} className="shrink-0" />
            <span className="truncate">{currentData.card2.tag}</span>
          </div>
        </div>

        {/* Card 3: Proactive Readiness */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs transition-all hover:border-berry/30 hover:shadow-md">
          <div>
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <PackageCheck size={16} />
            </div>
            <h3 className="font-display text-base font-bold text-ink">
              {currentData.card3.title}
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {currentData.card3.desc}
            </p>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <Sparkles size={12} className="shrink-0" />
            <span className="truncate">{currentData.card3.tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
