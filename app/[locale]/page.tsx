"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { AppFooter } from "@/components/layout/AppFooter";
import { AnonymousShieldModal } from "@/components/privacy/AnonymousShieldModal";
import { AnonymousPaywallModal } from "@/components/privacy/AnonymousPaywallModal";
import { AnonymousTrialBanner } from "@/components/privacy/AnonymousTrialBanner";
import { PanicBlurCurtain } from "@/components/privacy/PanicBlurCurtain";
import {
  BookOpen,
  Search,
  Sparkles,
  ShieldCheck,
  Globe2,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Share2,
  ThumbsUp,
  CheckCircle2,
  Clock,
  Mic,
  Calendar,
  HeartHandshake,
  Lightbulb,
  Droplet,
  User,
  Users,
  X,
} from "lucide-react";

interface QuestionAnswer {
  id: string;
  question: string;
  verifiedBy: string;
  paragraphs: string[];
  facts: string[];
  audioText: string;
}

const TRY_OUT_QUESTIONS: QuestionAnswer[] = [
  {
    id: "q1",
    question: "Why do periods happen?",
    verifiedBy: "Pediatrician Verified",
    paragraphs: [
      "Think of your uterus (womb) as building a soft, cozy nest each month with nutrients and tiny blood vessels, preparing in case you are ready to grow a baby.",
      "When you are not pregnant, the body naturally cleans house! That soft lining gently detaches and leaves through the vagina over 3 to 7 days. It is not dirty blood—it is proof your reproductive system is active and healthy.",
    ],
    facts: [
      "🩸 Normal loss is only about 2 to 3 tablespoons",
      "⏱ Natural rhythm repeats every 21 to 35 days",
    ],
    audioText:
      "पीरियड्स शरीर की एक बहुत ही स्वाभाविक प्रक्रिया है। हर महीने गर्भाशय एक नरम परत तैयार करता है। जब गर्भधारण नहीं होता, तो शरीर इस परत को साफ कर देता है। यह गंदा खून नहीं, बल्कि स्वस्थ शरीर का संकेत है।",
  },
  {
    id: "q2",
    question: "What should I know before my first period?",
    verifiedBy: "Gynecologist Verified",
    paragraphs: [
      "Your first period (menarche) usually arrives between ages 9 and 15. You might notice brownish discharge or light spotting a few months before your first flow.",
      "Always keep an emergency kit in your school bag with two pads, spare underwear, and wet wipes. Remember, it is a milestone celebrating your body's growth—there is nothing to whisper about or fear.",
    ],
    facts: [
      "🎒 Emergency school pouch checklist included",
      "🌸 Average onset age in India is 12.4 years",
    ],
    audioText:
      "पहला पीरियड आमतौर पर 9 से 15 साल की उम्र में आता है। स्कूल बैग में हमेशा दो पैड और एक अतिरिक्त अंडरवियर का छोटा पाउच रखें। यह आपके बड़े होने का एक सुंदर पड़ाव है, जिससे डरने की कोई ज़रूरत नहीं है।",
  },
  {
    id: "q3",
    question: "Is irregular cycle normal at age 14?",
    verifiedBy: "Adolescent Health Verified",
    paragraphs: [
      "Yes! In the first 2 to 3 years after your first period, your brain (hypothalamus) and ovaries are still learning to synchronize their hormone signals.",
      "Skipping a month or having cycles ranging anywhere between 21 and 45 days is extremely common during teenage years. Track your dates to understand your natural pattern.",
    ],
    facts: [
      "📊 70%+ teen girls experience irregular cycles early on",
      "🗓️ Synchronization typically stabilizes by age 17-18",
    ],
    audioText:
      "हाँ, 14 साल की उम्र में अनियमित पीरियड होना बिल्कुल सामान्य है। पहले दो से तीन साल शरीर के हार्मोन्स तालमेल बिठाना सीख रहे होते हैं। अपने कैलेंडर में तारीखें नोट करते रहें।",
  },
];

const CORE_TOPICS = [
  {
    title: "Puberty & Changes",
    description: "Growth spurts, mood swings, skin changes, and emotional shifts explained with gentle biology.",
    duration: "4 min read",
    tag: "EN • HI • TA",
    icon: User,
    color: "from-pink-500/20 to-rose-500/10 text-pink-700",
    slug: "puberty-changes",
  },
  {
    title: "First Period (Menarche)",
    description: "What to pack in your school pouch, how to wear a pad, and talking to your mom or teacher.",
    duration: "6 min read",
    tag: "Audio Ready",
    icon: Droplet,
    color: "from-berry/20 to-purple-500/10 text-berry",
    slug: "first-period",
  },
  {
    title: "Cycle Tracking",
    description: "Understanding phases: follicular, ovulation, luteal, and why early cycles are fluctuating.",
    duration: "5 min read",
    tag: "Interactive",
    icon: Calendar,
    color: "from-rose/20 to-orange-500/10 text-rose",
    slug: "cycle-tracking",
  },
  {
    title: "Intimate Wellness",
    description: "Gentle hygiene routines, fabric choices, dealing with discharge, and urinary tract care.",
    duration: "3 min read",
    tag: "EN • BN • TE",
    icon: Sparkles,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-800",
    slug: "intimate-wellness",
  },
  {
    title: "Myths vs. Facts",
    description: "Busting traditional taboos about foods, hair washing, pickles, and religious taboos.",
    duration: "4 min read",
    tag: "Mythbuster",
    icon: Lightbulb,
    color: "from-amber-500/20 to-yellow-500/10 text-amber-800",
    slug: "myths-facts",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { openAuthModal } = useAuthModalStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Hero Companion Audio state
  const [heroAudioPlaying, setHeroAudioPlaying] = useState(false);

  // Try it out interactive state
  const [activeQuestionId, setActiveQuestionId] = useState("q1");
  const [tryOutAudioPlaying, setTryOutAudioPlaying] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState<Record<string, number>>({ q1: 142, q2: 98, q3: 115 });
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  // Video modal preview state
  const [activeVideo, setActiveVideo] = useState<{ title: string; desc: string } | null>(null);

  const activeQuestion = TRY_OUT_QUESTIONS.find((q) => q.id === activeQuestionId) || TRY_OUT_QUESTIONS[0];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/learn?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/learn");
    }
  };

  const playSpeech = (text: string, isHindi = true, onFinish?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio speech synthesis is not supported on your browser.");
      if (onFinish) onFinish();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? "hi-IN" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      if (onFinish) onFinish();
    };
    utterance.onerror = () => {
      if (onFinish) onFinish();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleHeroAudio = () => {
    if (heroAudioPlaying) {
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
      setHeroAudioPlaying(false);
    } else {
      setHeroAudioPlaying(true);
      playSpeech(
        "हाँ प्यारी बहन, पहली बार हल्का ऐंठन और खिंचाव होना बिल्कुल स्वाभाविक है। गुनगुने पानी की सिकाई और हल्का आराम आपको तुरंत राहत देगा।",
        true,
        () => setHeroAudioPlaying(false)
      );
    }
  };

  const handleToggleTryOutAudio = () => {
    if (tryOutAudioPlaying) {
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
      setTryOutAudioPlaying(false);
    } else {
      setTryOutAudioPlaying(true);
      playSpeech(activeQuestion.audioText, true, () => setTryOutAudioPlaying(false));
    }
  };

  const handleToggleHelpful = (id: string) => {
    const isLiked = !!hasLiked[id];
    setHasLiked((prev) => ({ ...prev, [id]: !isLiked }));
    setHelpfulCount((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (isLiked ? -1 : 1),
    }));
  };

  const handleShareGuide = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#FFFDF9] text-ink selection:bg-rose/20 selection:text-berry" tabIndex={-1}>
      <AnonymousTrialBanner />
      {/* 1. TOP NAVBAR (Matches Stitch Screenshot 1) */}
      <header className="sticky top-0 z-40 border-b border-peach/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Slogan */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose/20 via-blush to-berry/10 text-xl shadow-xs group-hover:scale-105 transition-transform" aria-hidden="true">
              🌸
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-berry">
                Sakhi AI
              </span>
              <span className="hidden text-[10px] font-medium tracking-wide text-slate-500 sm:inline">
                Your Health. Your Voice. Your Sakhi.
              </span>
            </div>
          </Link>

          {/* Navigation Center Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Link
              href="/"
              className="rounded-full bg-blush/60 px-3.5 py-1.5 text-berry transition-all hover:bg-blush"
            >
              Home
            </Link>
            <Link
              href="/learn"
              className="rounded-full px-3.5 py-1.5 transition-all hover:bg-peach/40 hover:text-berry"
            >
              Learn &amp; Topics
            </Link>
            <Link
              href="/chat"
              className="rounded-full px-3.5 py-1.5 transition-all hover:bg-peach/40 hover:text-berry"
            >
              AI Sakhi
            </Link>
            <Link
              href="/learn?type=VIDEO"
              className="rounded-full px-3.5 py-1.5 transition-all hover:bg-peach/40 hover:text-berry"
            >
              Video Hub
            </Link>
            <Link
              href="/caregivers"
              className="rounded-full px-3.5 py-1.5 transition-all hover:bg-peach/40 hover:text-berry"
            >
              Caregivers
            </Link>
            <Link
              href="/about"
              className="rounded-full px-3.5 py-1.5 transition-all hover:bg-peach/40 hover:text-berry"
            >
              About
            </Link>
          </nav>

          {/* Search, Language & Sign In */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search health topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 rounded-full border border-peach/80 bg-slate-50/80 py-1.5 pl-8 pr-3 text-xs font-medium text-ink placeholder:text-slate-400 outline-none transition-all hover:bg-white focus:w-72 focus:border-berry focus:bg-white focus:ring-1 focus:ring-berry/20"
              />
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </form>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-peach/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-berry/30 hover:bg-peach/20 transition-all"
                aria-expanded={langMenuOpen}
                aria-label="Select Language"
              >
                <span>{selectedLanguage}</span>
                <Globe2 className="h-3.5 w-3.5 text-slate-500" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl border border-peach/80 bg-white p-1.5 shadow-lg z-50">
                  {["English", "हिंदी (Hindi)", "मराठी (Marathi)", "বাংলা (Bengali)", "தமிழ் (Tamil)"].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang.split(" ")[0]);
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-peach/30 hover:text-berry"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={() => openAuthModal("general")}
              className="flex items-center gap-2 rounded-full border border-peach/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-berry shadow-2xs hover:bg-blush/30 hover:border-berry/30 transition-all active:scale-[0.98]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-berry/10 text-[11px] font-bold text-berry">
                <User className="h-3.5 w-3.5" />
              </span>
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Matches Stitch Screenshot 1) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFF9F5] to-peach/20 pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-blush/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-lavender/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Pill Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/10 px-3 py-1 text-xs font-semibold text-rose">
              <span>🌸</span> Medically Vetted Content
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> 100% Private &amp; Anonymous
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-900">
              <Globe2 className="h-3.5 w-3.5 text-amber-700" /> 8+ Indian Regional Languages
            </span>
          </div>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Hero Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-berry">
                <span>✦</span>
                <span>COMPASSIONATE WOMEN&apos;S HEALTH EDUCATION</span>
              </div>

              <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.08]">
                Every Girl Deserves to Understand{" "}
                <span className="text-berry">Her Body.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
                Accurate, stigma-free health education powered by conversational AI, bite-sized multilingual guides, and culturally sensitive resources for girls, women, and caregivers.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-2xl bg-berry px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-berry/90 hover:shadow-lg active:scale-[0.99]"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Start Learning</span>
                </Link>

                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 rounded-2xl border border-berry/20 bg-blush/60 px-6 py-3.5 text-sm font-semibold text-berry transition-all hover:bg-blush hover:border-berry/40 active:scale-[0.99]"
                >
                  <Sparkles className="h-4 w-4 text-berry" />
                  <span>Talk to Sakhi</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-peach/80 pt-8 max-w-lg">
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">120K+</div>
                  <div className="mt-1 text-xs text-slate-500 font-medium">Questions Answered Safely</div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">100%</div>
                  <div className="mt-1 text-xs text-slate-500 font-medium">Stigma-Free &amp; Verified</div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">8+</div>
                  <div className="mt-1 text-xs text-slate-500 font-medium">Mother Tongues</div>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Sakhi AI Companion Interactive Card */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-peach/80 bg-white/95 p-5 shadow-soft backdrop-blur-sm">
                {/* Companion Header */}
                <div className="flex items-center justify-between pb-4 border-b border-peach/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-berry to-rose text-white shadow-sm font-bold text-base">
                      🌸
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-ink">Sakhi AI Companion</h2>
                      <p className="text-[11px] text-slate-500 font-medium">Active in English &amp; हिंदी (Hindi)</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Simulated Conversation */}
                <div className="mt-4 space-y-3.5">
                  {/* User Bubble */}
                  <div className="rounded-2xl rounded-tr-xs bg-peach/40 p-3.5 text-xs text-ink">
                    <p className="font-medium text-slate-800 leading-relaxed">
                      &ldquo;दीदी, क्या पहली बार पीरियड्स के वक्त पेट में दर्द होना सामान्य है?&rdquo;
                    </p>
                    <div className="mt-1.5 text-right text-[10px] text-slate-400 font-medium">
                      14:20 • English &amp; Hindi
                    </div>
                  </div>

                  {/* Sakhi Answer Bubble */}
                  <div className="rounded-2xl rounded-tl-xs border border-purple-100 bg-[#FCF8FA] p-4 text-xs text-ink space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-berry">
                      <span>💜</span>
                      <span>Sakhi&apos;s Gentle Answer</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      हाँ प्यारी बहन, पहली बार हल्का ऐंठन और खिंचाव होना बिल्कुल स्वाभाविक है। आपके शरीर में हार्मोन्स गर्भाशय की परत को तैयार करते हैं।
                    </p>

                    {/* Quick Relief Box */}
                    <div className="rounded-xl border border-amber-200/60 bg-amber-50/70 p-2.5 text-[11px] font-medium text-amber-900 leading-snug">
                      <strong>💡 Quick Relief:</strong> गुनगुने पानी की सिकाई और हल्का आराम तुरंत राहत देता है।
                    </div>

                    {/* Card Footer: Audio & Verification */}
                    <div className="flex items-center justify-between pt-1 border-t border-purple-50 text-[11px]">
                      <button
                        type="button"
                        onClick={handleToggleHeroAudio}
                        className="inline-flex items-center gap-1 font-semibold text-berry hover:text-berry/80 transition-colors"
                      >
                        {heroAudioPlaying ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5 text-rose animate-pulse" />
                            <span>Stop audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5 text-berry" />
                            <span>Listen to audio</span>
                          </>
                        )}
                      </button>
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Verified by Gynecologists
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tap to Ask Sakhi Prompt Pills */}
                <div className="mt-4 pt-3 border-t border-peach/50">
                  <div className="text-[11px] font-bold text-slate-500 mb-2">Tap to ask Sakhi:</div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/chat?prompt=First Period prep checklist"
                      className="inline-flex items-center gap-1.5 rounded-full border border-peach bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-berry/30 hover:bg-peach/20 hover:text-berry transition-all"
                    >
                      <span>🌸</span>
                      <span>First Period prep checklist</span>
                    </Link>
                    <Link
                      href="/chat?prompt=Is dark blood normal?"
                      className="inline-flex items-center gap-1.5 rounded-full border border-peach bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-berry/30 hover:bg-peach/20 hover:text-berry transition-all"
                    >
                      <span>🩸</span>
                      <span>Is dark blood normal?</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE CORE HEALTH TOPICS (Matches Stitch Screenshot 2) */}
      <section className="py-16 sm:py-20 bg-white border-t border-peach/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-berry">
                EDUCATIONAL MODULES
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
                Explore Core Health Topics
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-xl">
                Written with pediatricians, gynaecologists, and compassionate educators.
              </p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-berry hover:text-berry/80 hover:gap-2 transition-all"
            >
              <span>View all 24 guides</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 5 Topic Cards Row */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CORE_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.title}
                  href={`/learn?search=${encodeURIComponent(topic.title)}`}
                  className="group flex flex-col justify-between rounded-3xl border border-peach/70 bg-[#FFFDFB] p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-berry/30 hover:shadow-md"
                >
                  <div>
                    {/* Icon and duration */}
                    <div className="flex items-center justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${topic.color} shadow-2xs`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Clock className="h-3 w-3" />
                        {topic.duration}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-base font-bold text-ink group-hover:text-berry transition-colors">
                      {topic.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-peach/40 text-xs font-semibold text-slate-500">
                    <span className="text-[11px] font-bold text-slate-400">{topic.tag}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach/40 text-berry group-hover:bg-berry group-hover:text-white transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. OUR CORE COMMITMENT (Matches Stitch Screenshot 3) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FFFDF9] to-peach/20 border-t border-peach/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-berry">
              OUR CORE COMMITMENT
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Learn Without Fear or Shame
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
              Health literacy is every girl&apos;s birthright. We have redesigned feminine healthcare education around empathy, clarity, and deep cultural warmth.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Commitment Card 1 */}
            <div className="flex flex-col justify-between rounded-3xl border border-peach/70 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-soft transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush/80 text-berry shadow-inner">
                  <HeartHandshake className="h-6 w-6 text-berry" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  1. Judgment-Free Companion
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ask anything without awkwardness or fear of being overheard. Whether it is menstrual cramps, unusual odor, or emotional changes, Sakhi listens with unconditional kindness.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-peach/40 px-3 py-1.5 text-xs font-semibold text-berry">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Zero-judgment algorithmic safety</span>
              </div>
            </div>

            {/* Commitment Card 2 */}
            <div className="flex flex-col justify-between rounded-3xl border border-peach/70 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-soft transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-inner">
                  <BookOpen className="h-6 w-6 text-purple-800" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  2. Simple &amp; Illustrated
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No dense clinical jargon or intimidating Latin medical names. We translate anatomical biology into gentle, illustrated stories intuitive for ages 10 to 60+.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Visual storyboards &amp; infographics</span>
              </div>
            </div>

            {/* Commitment Card 3 */}
            <div className="flex flex-col justify-between rounded-3xl border border-peach/70 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-soft transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-inner">
                  <Volume2 className="h-6 w-6 text-amber-800" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  3. Audio &amp; Multilingual First
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Healthcare should never require high literacy. Tap to listen in Hindi, Bengali, Tamil, Telugu, Marathi, and Kannada with natural regional pronunciations and caring voices.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
                <Volume2 className="h-3.5 w-3.5" />
                <span>Human-calibrated spoken audio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRY IT OUT INTERACTIVE SIMULATOR (Matches Stitch Screenshot 4) */}
      <section className="py-16 sm:py-20 bg-white border-t border-peach/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-berry">
              TRY IT OUT
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              Curious? Click a question to see how Sakhi responds.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              These are actual real questions asked by thousands of young girls in our health education workshops across India.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10 items-start">
            {/* Left Question Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {TRY_OUT_QUESTIONS.map((item) => {
                const isActive = item.id === activeQuestionId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveQuestionId(item.id);
                      setTryOutAudioPlaying(false);
                      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
                    }}
                    className={`w-full flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition-all ${
                      isActive
                        ? "border-berry bg-[#FCF8FA] text-berry shadow-2xs ring-1 ring-berry/20"
                        : "border-peach/70 bg-white text-slate-700 hover:border-berry/30 hover:bg-peach/20"
                    }`}
                  >
                    <span>&ldquo;{item.question}&rdquo;</span>
                    <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "text-berry translate-x-1" : "text-slate-400"}`} />
                  </button>
                );
              })}

              {/* Mic feature callout */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-peach/80 bg-[#FFF9F5] p-4 text-xs text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-berry/10 text-berry">
                  <Mic className="h-4 w-4" />
                </div>
                <p className="leading-snug">
                  You can also speak your questions into the microphone in your own language anytime.
                </p>
              </div>
            </div>

            {/* Right Question Response Box */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-peach/80 bg-[#FCF8FA] p-6 sm:p-8 shadow-soft">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">💬</span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                      {activeQuestion.question}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose/15 px-3 py-1 text-xs font-semibold text-rose">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {activeQuestion.verifiedBy}
                  </span>
                </div>

                {/* Paragraphs */}
                <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeQuestion.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Fact Pills */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {activeQuestion.facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-purple-200/60 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs"
                    >
                      {fact}
                    </div>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-purple-100 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleTryOutAudio}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 font-semibold text-berry border border-peach/80 shadow-2xs hover:bg-blush/40 transition-all"
                    >
                      {tryOutAudioPlaying ? (
                        <>
                          <VolumeX className="h-4 w-4 text-rose animate-pulse" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 text-berry" />
                          <span>Hear Hindi Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleShareGuide}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 border border-peach/80 shadow-2xs hover:bg-peach/20 transition-all"
                    >
                      <Share2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>{copiedShare ? "Link Copied!" : "Share Guide"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleHelpful(activeQuestion.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-semibold transition-all border ${
                        hasLiked[activeQuestion.id]
                          ? "bg-berry text-white border-berry"
                          : "bg-white text-slate-700 border-peach/80 hover:bg-peach/20"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Helpful ({helpfulCount[activeQuestion.id]})</span>
                    </button>

                    <Link
                      href={`/chat?prompt=${encodeURIComponent(activeQuestion.question)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-berry hover:underline"
                    >
                      <span>Ask Follow-up</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VISUAL EXPLAINER HUB & CAREGIVERS (Matches Stitch Screenshot 5) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FFFDF9] to-peach/20 border-t border-peach/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-berry">
                VISUAL EXPLAINER HUB
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
                Culturally Grounded Animated Videos
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Short, colorful stories without discomfort or shame. Watch with sisters or friends.
              </p>
            </div>

            <Link
              href="/learn?type=VIDEO"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-peach/80 bg-white px-4 py-2.5 text-xs font-bold text-berry shadow-2xs hover:bg-blush/30 hover:border-berry/30 transition-all"
            >
              <span>Explore Video Library (16 Episodes)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 2 Animated Video Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Video Card 1 */}
            <div className="group overflow-hidden rounded-3xl border border-peach/80 bg-white shadow-2xs hover:shadow-soft transition-all">
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {/* Fallback image with Unsplash visual */}
                <Image
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                  alt="Understanding Your Cycle in 3 Minutes"
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Top Badge */}
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  Season 1 • Ep 01
                </span>

                {/* Duration */}
                <span className="absolute right-4 bottom-4 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                  03:14 min
                </span>

                {/* Play Button Overlay */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo({
                      title: "Understanding Your Cycle in 3 Minutes",
                      desc: "A lively animated journey breaking down hormones, body signals, and tracking days on your wall calendar or mobile phone.",
                    })
                  }
                  className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-berry shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                  aria-label="Play Understanding Your Cycle in 3 Minutes"
                >
                  <Play className="h-6 w-6 fill-berry ml-1 text-berry" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-ink group-hover:text-berry transition-colors">
                  Understanding Your Cycle in 3 Minutes
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  A lively animated journey breaking down hormones, body signals, and tracking days on your wall calendar or mobile phone.
                </p>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-peach/50 text-xs font-semibold">
                  <span className="text-slate-500">🎙️ Dubbed in 6 Languages</span>
                  <Link
                    href="/learn?type=VIDEO"
                    className="inline-flex items-center gap-1 text-berry hover:underline"
                  >
                    <span>Watch Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Video Card 2 */}
            <div className="group overflow-hidden rounded-3xl border border-peach/80 bg-white shadow-2xs hover:shadow-soft transition-all">
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
                  alt="Sustainable Menstrual Products: Pads, Cups & Cloth"
                  fill
                  className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  Practical Skills
                </span>

                <span className="absolute right-4 bottom-4 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                  04:45 min
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo({
                      title: "Sustainable Menstrual Products: Pads, Cups & Cloth",
                      desc: "How to select what fits your lifestyle, proper washing guidelines for reusable pads, and safe disposal methods.",
                    })
                  }
                  className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-berry shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                  aria-label="Play Sustainable Menstrual Products"
                >
                  <Play className="h-6 w-6 fill-berry ml-1 text-berry" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-ink group-hover:text-berry transition-colors">
                  Sustainable Menstrual Products: Pads, Cups &amp; Cloth
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  How to select what fits your lifestyle, proper washing guidelines for reusable pads, and safe disposal methods.
                </p>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-peach/50 text-xs font-semibold">
                  <span className="text-slate-500">📖 Illustrated Step-by-Step</span>
                  <Link
                    href="/learn?type=VIDEO"
                    className="inline-flex items-center gap-1 text-berry hover:underline"
                  >
                    <span>Watch Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Caregiver Guide Card Banner */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-peach/80 bg-gradient-to-br from-white via-[#FCF8FA] to-blush/40 p-6 sm:p-8 lg:p-10 shadow-soft">
            <div className="grid gap-8 items-center lg:grid-cols-12">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-berry/10 px-3.5 py-1 text-xs font-bold text-berry">
                  <Users className="h-3.5 w-3.5" />
                  <span>For Mothers, Elder Sisters &amp; Guardians</span>
                </span>

                <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  Guiding Her with Confidence &amp; Love
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Don&apos;t know where to start the conversation? Access gentle dialogue starters, age-appropriate conversation scripts, and supportive tips to ensure her first period is celebrated, not whispered about.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <div className="rounded-xl border border-peach bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                    📖 Ready-to-use dialogue scripts
                  </div>
                  <div className="rounded-xl border border-peach bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                    🎒 School emergency kit checklist
                  </div>
                  <div className="rounded-xl border border-peach bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                    ✨ Dispelling myths together
                  </div>
                </div>

                <div className="mt-7">
                  <Link
                    href="/caregivers"
                    className="inline-flex items-center gap-2 rounded-2xl bg-berry px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xs hover:bg-berry/90 transition-all active:scale-[0.99]"
                  >
                    <span>Explore Caregiver Hub</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Photo on right */}
              <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Mother and daughter sharing a warm conversation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Preview */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-peach">
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-berry uppercase tracking-wider">
              <Play className="h-4 w-4 fill-berry" />
              <span>Video Preview</span>
            </div>

            <h3 className="mt-2 font-display text-xl font-bold text-ink">
              {activeVideo.title}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeVideo.desc}
            </p>

            <div className="mt-6 aspect-video rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white text-center p-4">
              <div className="h-12 w-12 rounded-full bg-berry flex items-center justify-center text-white mb-3">
                <Play className="h-6 w-6 fill-white ml-0.5" />
              </div>
              <p className="text-sm font-semibold">Video Streaming Ready</p>
              <p className="text-xs text-slate-400 mt-1">Full episode with 6 regional audio tracks available</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <Link
                href="/learn?type=VIDEO"
                className="rounded-xl bg-berry px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-berry/90"
              >
                Go to Video Hub
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Flo-Inspired AppFooter */}
      <AppFooter />

      {/* Global Modals & Privacy Curtains */}
      <AuthPromptModal />
      <AnonymousShieldModal />
      <AnonymousPaywallModal />
      <PanicBlurCurtain />
    </main>
  );
}
