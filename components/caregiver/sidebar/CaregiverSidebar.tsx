"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { 
  HeartHandshake, 
  Map, 
  MessageSquareQuote, 
  HelpCircle, 
  DownloadCloud, 
  Bot, 
  BookOpen, 
  Sparkles,
  Users2
} from "lucide-react";

interface CaregiverSidebarProps {
  className?: string;
  activeRole?: string;
  onSelectRole?: (role: string) => void;
  activeStage?: string;
  onSelectStage?: (stage: string) => void;
}

export function CaregiverSidebar({ 
  className = "",
  activeRole = "all",
  onSelectRole,
  activeStage = "9-11",
  onSelectStage
}: CaregiverSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const isHi = locale === "hi";
  const prefix = locale === "en" ? "" : `/${locale}`;
  const getHref = (path: string) => `${prefix}${path}`;

  const navItems = [
    { href: getHref("/caregivers"), label: isHi ? "अभिभावक केंद्र" : "Caregiver Hub", icon: HeartHandshake },
    { href: getHref("/caregivers#roadmap"), label: isHi ? "पड़ाव रोडमैप" : "Milestone Roadmap", icon: Map },
    { href: getHref("/caregivers#scripts"), label: isHi ? "संवाद पटकथाएं" : "Dialogue Scripts", icon: MessageSquareQuote },
    { href: getHref("/caregivers#faqs"), label: isHi ? "बाल चिकित्सा प्रश्नोत्तर" : "Pediatric Q&A", icon: HelpCircle },
    { href: getHref("/caregivers#toolkits"), label: isHi ? "टूलकिट और ऑडियो" : "Toolkits & Audio", icon: DownloadCloud },
    { href: getHref("/caregivers#simulator"), label: isHi ? "AI अभ्यास सिमुलेटर" : "AI Practice Simulator", icon: Bot },
    { href: getHref("/caregivers#modules"), label: isHi ? "चयनित मॉड्यूल" : "Curated Modules", icon: BookOpen },
  ];

  const ROLES = [
    { id: "all", label: isHi ? "सभी अभिभावक" : "All Caregivers" },
    { id: "mothers", label: isHi ? "माताएं व मौसी/बुआ" : "Mothers & Aunts" },
    { id: "fathers", label: isHi ? "पिता व संरक्षक" : "Fathers & Male Mentors" },
    { id: "teachers", label: isHi ? "शिक्षक व काउंसलर" : "Teachers & Counselors" },
    { id: "siblings", label: isHi ? "बड़े भाई-बहन" : "Elder Siblings" },
  ];

  const STAGES = [
    { id: "9-11", label: isHi ? "उम्र 9–11 (प्रारंभिक तैयारी)" : "Ages 9–11 (Early Prep)" },
    { id: "12-14", label: isHi ? "उम्र 12–14 (पहला पीरियड)" : "Ages 12–14 (First Period)" },
    { id: "15-18", label: isHi ? "उम्र 15–18 (चक्र साक्षरता)" : "Ages 15–18 (Cycle Literacy)" },
  ];

  return (
    <aside className={`flex flex-col gap-1 ${className}`} aria-label="Caregiver navigation">
      {/* Top Section */}
      <div className="mb-2 px-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-berry">
          <Sparkles size={11} />
          <span>CAREGIVER COMPANION</span>
        </div>
      </div>

      {navItems.map(({ href, label, icon: Icon }) => {
        const isExactHub = href === "/caregivers" && pathname === "/caregivers";
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
              isExactHub
                ? "bg-[#FBF1F6] text-[#7B3E73] font-semibold border border-[#F5D8E8]/70 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-ink"
            }`}
          >
            <Icon size={16} className={isExactHub ? "text-berry" : "text-slate-400"} />
            <span>{label}</span>
          </Link>
        );
      })}

      {/* Mentor Role Focus */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="mb-2.5 px-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40">
          <span className="flex items-center gap-1.5">
            <Users2 size={12} />
            <span>{isHi ? "संरक्षक भूमिका" : "MENTOR FOCUS"}</span>
          </span>
        </p>

        <div className="space-y-1">
          {ROLES.map((r) => {
            const isSelected = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  if (onSelectRole) onSelectRole(r.id);
                  const el = document.getElementById("hero");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full text-left rounded-xl px-3 py-1.5 text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-[#3F1F36] text-white font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-ink"
                }`}
              >
                <span>{r.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age Stages */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-ink/40">
          {isHi ? "आयु वर्ग" : "AGE BANDS"}
        </p>

        <div className="space-y-1">
          {STAGES.map((s) => {
            const isSelected = activeStage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (onSelectStage) onSelectStage(s.id);
                  const el = document.getElementById("roadmap");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full text-left rounded-xl px-3 py-1.5 text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-[#FBF1F6] text-[#7B3E73] font-semibold border border-[#F5D8E8]/70 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-ink"
                }`}
              >
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Seal */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-berry/5 to-lavender/10 p-3.5 border border-berry/10 text-xs text-slate-600">
        <p className="font-bold text-ink flex items-center gap-1.5 mb-1 text-[11px]">
          <span>🩺</span>
          <span>{isHi ? "बाल चिकित्सा विशेषज्ञ पैनल" : "Pediatric Panel"}</span>
        </p>
        <p className="text-[11px] leading-relaxed text-slate-500">
          {isHi 
            ? "डॉ. सुनीता रामनाथन (MD) और बाल मनोवैज्ञानिकों के मार्गदर्शन में तैयार।"
            : "Curated under guidance of Dr. Sunita Ramanathan, MD & youth psychologists."}
        </p>
      </div>
    </aside>
  );
}
