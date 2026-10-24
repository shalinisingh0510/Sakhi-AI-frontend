"use client";

import { useLocale } from "next-intl";
import { ShieldCheck, Sparkles, HeartHandshake, CheckCircle2, Menu } from "lucide-react";

interface CaregiverHeroProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
  onOpenMobileNav?: () => void;
}

const ROLE_TIPS: Record<string, { title: string; desc: string }> = {
  all: {
    title: "Universal Foundation",
    desc: "Speak with calm candor. When caregivers speak about menstruation with pride and clarity, young people carry that confidence for life."
  },
  mothers: {
    title: "Mothers & Aunts: Normalizing bodily autonomy",
    desc: "Share your own early memories gently, but focus on modern products and choices so she feels in complete control of her bodily rhythm."
  },
  fathers: {
    title: "Fathers & Male Mentors: Removing awkwardness",
    desc: "Stock pads in the family bathroom openly. Never treat menstruation as a secret, and validate physical discomfort without teasing."
  },
  teachers: {
    title: "Teachers & Counselors: Safe school environments",
    desc: "Establish a non-verbal restroom pass system and maintain an emergency kit in the classroom or nurse station to eliminate anxiety."
  },
  siblings: {
    title: "Elder Siblings: Peer reassurance",
    desc: "Be the accessible confidante who answers the 'real' questions without adult lecturing. Reassure her that cramps and spots happen to everyone."
  }
};

const ROLE_TIPS_HI: Record<string, { title: string; desc: string }> = {
  all: {
    title: "बुनियादी दृष्टिकोण",
    desc: "सहजता और स्पष्टता से बात करें। जब अभिभावक आत्मविश्वास के साथ मासिक धर्म पर चर्चा करते हैं, तो बच्चों में जीवनभर का संकोच समाप्त होता है।"
  },
  mothers: {
    title: "माताएं व मौसी/बुआ: शारीरिक स्वायत्तता को सामान्य बनाएं",
    desc: "अपनी शुरुआती यादें साझा करें और आधुनिक उत्पादों के बारे में बताएं ताकि वह अपने स्वास्थ्य और चक्र पर आत्मविश्वास महसूस करे।"
  },
  fathers: {
    title: "पिता व पुरुष संरक्षक: झिझक मिटाएं",
    desc: "घर में पैड्स सहजता से उपलब्ध रखें। मासिक धर्म को कभी गुप्त न समझें और शारीरिक परेशानी में सहयोग व संवेदनशीलता दिखाएं।"
  },
  teachers: {
    title: "शिक्षक व काउंसलर: सुरक्षित विद्यालय वातावरण",
    desc: "कक्षा या मेडिकल कक्ष में आपातकालीन पैड किट रखें और बिना किसी असहजता के शौचालय उपयोग की अनुमति दें।"
  },
  siblings: {
    title: "बड़े भाई-बहन: सहकर्मी समर्थन",
    desc: "एक विश्वासपात्र साथी बनें जो बिना किसी उपदेश के सही सलाह दे सके। उन्हें आश्वस्त करें कि ऐंठन और दाग लगना पूरी तरह स्वाभाविक है।"
  }
};

export function CaregiverHero({ selectedRole, onSelectRole, onOpenMobileNav }: CaregiverHeroProps) {
  const locale = useLocale();
  const isHi = locale === "hi";

  const currentTip = isHi 
    ? (ROLE_TIPS_HI[selectedRole] || ROLE_TIPS_HI.all) 
    : (ROLE_TIPS[selectedRole] || ROLE_TIPS.all);

  const ROLES = [
    { id: "mothers", label: isHi ? "माताएं व मौसी/बुआ" : "Mothers & Aunts" },
    { id: "fathers", label: isHi ? "पिता व संरक्षक" : "Fathers & Male Mentors" },
    { id: "teachers", label: isHi ? "शिक्षक व काउंसलर" : "Teachers & Counselors" },
    { id: "siblings", label: isHi ? "बड़े भाई-बहन" : "Elder Siblings" },
  ];

  return (
    <div id="hero" className="mb-10 overflow-hidden rounded-3xl border border-[#EDE2E7] bg-gradient-to-br from-[#FFFDFE] via-[#FCF4F8] to-[#F8ECF3] p-6 sm:p-8 md:p-10 shadow-sm relative">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blush/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-lavender/30 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headlines & Tailored Pills */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-4">
            {onOpenMobileNav && (
              <button
                onClick={onOpenMobileNav}
                className="lg:hidden rounded-xl p-1.5 text-ink/70 hover:bg-white/80 hover:text-ink transition-colors border border-slate-200/80 bg-white/60 shadow-2xs"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-berry/20 bg-white/90 px-3.5 py-1 text-[11px] font-bold text-berry shadow-2xs backdrop-blur-sm">
              <ShieldCheck size={13} className="text-berry" />
              <span>{isHi ? "बाल रोग विशेषज्ञों और स्वास्थ्य शिक्षकों के साथ सह-निर्मित" : "Co-created with pediatricians and child health educators"}</span>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink leading-[1.18] tracking-tight">
            {isHi 
              ? "नई पीढ़ी का सशक्तिकरण: यौवन और मासिक धर्म साक्षरता के लिए अभिभावक मार्गदर्शिका"
              : "Empowering the Next Generation: A Caregiver's Guide to Puberty & Period Literacy"}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            {isHi
              ? "माताओं, पिताओं, बड़ी बहनों, शिक्षकों और संरक्षकों के लिए व्यावहारिक बातचीत, आयु-अनुकूल मार्गदर्शन और कलंक-मुक्त सलाह।"
              : "Practical conversation starters, age-appropriate guidance, and stigma-free advice for mothers, fathers, elder sisters, teachers, and guardians navigating growing years together."}
          </p>

          {/* Tailored For Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">{isHi ? "विशेष रूप से इनके लिए:" : "Tailored for:"}</span>
            {ROLES.map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(isActive ? "all" : r.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
                    isActive
                      ? "bg-[#3F1F36] text-white shadow-sm ring-2 ring-berry/20"
                      : "bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Role Guidance Alert */}
          <div className="mt-5 rounded-2xl border border-berry/15 bg-white/90 p-4 shadow-2xs backdrop-blur-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-berry/10 p-2 text-berry shrink-0 mt-0.5">
                <HeartHandshake size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">{currentTip.title}</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {currentTip.desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Card matching Stitch Screenshot 2 */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80"
                alt="Mother and daughter sharing a comforting book"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              <div className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-800 shadow-sm backdrop-blur-md flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>{isHi ? "बाल चिकित्सा प्रमाणित" : "Pediatric Approved"}</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-berry/10 text-berry shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">{isHi ? "सुरक्षित आश्रय स्थल" : "Safe Sanctuary Space"}</h4>
                  <p className="text-[11px] text-slate-500">{isHi ? "गोपनीय, कलंक-मुक्त मार्गदर्शन" : "Confidential, stigma-neutral advice"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
