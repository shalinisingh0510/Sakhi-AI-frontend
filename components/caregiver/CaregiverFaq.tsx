"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What if my daughter starts her period before age 10?",
    a: "While menarche before age 10 is less common, secular trends show puberty onset is occurring slightly earlier worldwide. Keep calm and reassure her that her body is healthy. Schedule a gentle, non-urgent consultation with a pediatrician or pediatric endocrinologist to assess growth velocity and bone age."
  },
  {
    q: "How do I handle mood swings and emotional sensitivity with empathy?",
    a: "Acknowledge that hormonal surges directly affect the brain's emotional center (amygdala) before the reasoning prefrontal cortex is fully mature. Avoid saying 'You're just being hormonal'. Instead say: 'I see you're feeling overwhelmed right now. Let's take a pause together and talk whenever you feel ready.'"
  },
  {
    q: "Which menstrual products are best for a 12-year-old beginner?",
    a: "Start with medium-absorbency organic cotton pads with wings or washable period underwear. They require zero insertion, are simple to check in school restrooms, and prevent skin rashes. Once she feels confident with her flow rhythm, she can explore tampons or menstrual cups if she wishes."
  },
  {
    q: "How can fathers and male guardians support without awkwardness?",
    a: "Fathers set the emotional tone for how girls expect boys and men to treat women's bodies. Buy pads without hesitation, keep hot water bottles handy, learn how to read a cycle calendar, and never make jokes about mood swings or periods."
  },
  {
    q: "How do I explain menstruation to her younger brother?",
    a: "Use plain biology: 'Just like girls' bodies grow up to make humans possible, their body prepares every month by building a soft nest and then washing it clean. It's not dirty, it doesn't hurt, and it is a normal part of growing up.' This prevents schoolyard bullying."
  }
];

export function CaregiverFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div id="faqs" className="mb-10">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-berry">
          <HelpCircle size={13} />
          <span>REAL MENTOR DILEMMAS</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">
          Frequently Asked Caregiver Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          It is completely normal to feel unprepared or anxious yourself. Here are clear answers to the most common questions our pediatric panel receives from parents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Doctor Card */}
        <div className="lg:col-span-4 rounded-2xl border border-[#EDE2E7] bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-3.5 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
              alt="Dr. Sunita Ramanathan, MD"
              className="h-14 w-14 rounded-full object-cover border-2 border-berry/20"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-display text-sm font-bold text-ink">
                  Dr. Sunita Ramanathan, MD
                </h4>
                <CheckCircle2 size={13} className="text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">Pediatrician &amp; Youth Educator</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#FCF8FA] p-3 text-xs italic text-slate-700 leading-relaxed font-serif border border-berry/10">
            &ldquo;Kindness over perfection every single time. Your daughter doesn&apos;t need an anatomical textbook lecture—she needs to know she is safe with you.&rdquo;
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Specialty: Adolescent Medicine</span>
            <span className="font-semibold text-berry">18+ Yrs Experience</span>
          </div>
        </div>

        {/* Right: Expandable Accordion */}
        <div className="lg:col-span-8 space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#EDE2E7] bg-white transition-all shadow-2xs hover:border-berry/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-ink transition-colors hover:text-berry gap-4"
                >
                  <span className="leading-snug">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-berry" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FFFDFE]">
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
