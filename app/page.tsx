import Link from "next/link";

import { Badge } from "@/components/home/Badge";
import { FlowCard } from "@/components/home/FlowCard";
import { InfoCard } from "@/components/home/InfoCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SiteNav } from "@/components/home/SiteNav";
import { StatCard } from "@/components/home/StatCard";

const languageHighlights = ["English", "Hindi", "Bengali", "Marathi", "Tamil", "Telugu"];

const supportCards = [
  {
    title: "First periods, explained gently",
    body: "Simple answers for young users and caregivers, with age-appropriate language and no shame.",
  },
  {
    title: "Care routines that feel practical",
    body: "Menstrual hygiene, personal hygiene, and intimate care guidance that is easy to act on.",
  },
  {
    title: "Health education with empathy",
    body: "Trusted information that makes room for questions, curiosity, and privacy.",
  },
];

const pillars = [
  "Safety-first AI responses",
  "Multilingual learning support",
  "Education designed for rural and semi-urban communities",
  "Accessible, low-stress interfaces",
];

const stats = [
  { value: "11", label: "planned languages" },
  { value: "24/7", label: "guided learning" },
  { value: "100%", label: "education first" },
];

const navItems = [
  { href: "#chat", label: "Chat" },
  { href: "#support", label: "Support" },
  { href: "#journey", label: "Journey" },
  { href: "#languages", label: "Languages" },
  { href: "#safety", label: "Safety" },
];

const journeySteps = [
  {
    step: "Step 01",
    title: "Choose the right language",
    body: "Users start with the language they understand best, so the experience feels familiar from the first screen.",
  },
  {
    step: "Step 02",
    title: "Ask a question or open a lesson",
    body: "The interface supports casual conversation as well as structured education modules for deeper learning.",
  },
  {
    step: "Step 03",
    title: "Save progress and continue later",
    body: "The product flow is designed to support repeat visits, progress tracking, and future personalization.",
  },
];

const chatMessages = [
  {
    role: "User",
    text: "I am nervous about my first period. What should I know?",
  },
  {
    role: "Sakhi",
    text: "That is completely okay. I can explain the signs, what to keep ready, and how to stay comfortable without overwhelming you.",
    highlight: true,
  },
  {
    role: "Sakhi",
    text: "If you want, I can also show a simple checklist or help you talk to a trusted adult.",
  },
];

const quickPrompts = [
  "What is a period?",
  "How do I stay clean safely?",
  "How do I talk to my mother?",
  "What changes happen during puberty?",
];

const journeyAudiences = [
  {
    title: "First-time learner",
    body: "Start with simple explanations, age-appropriate terms, and a calm tone that reduces anxiety.",
  },
  {
    title: "Caregiver support",
    body: "Get practical guidance for answering questions clearly and compassionately at home.",
  },
  {
    title: "Returning learner",
    body: "Revisit topics, track what you have learned, and continue from the last lesson or chat.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-radial">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <SiteNav items={navItems} ctaLabel="Explore chat" ctaHref="#chat" />

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <Badge tone="rose">Multilingual women&apos;s health education</Badge>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              Support that feels warm, clear, and quietly confident.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72 sm:text-xl">
              Sakhi AI helps girls and women learn about periods, hygiene, puberty, nutrition,
              mental wellbeing, and emergency awareness in language that feels safe and easy to trust.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#chat"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-6 py-3 text-base font-semibold text-cream transition hover:from-berry hover:to-rose"
              >
                Try the chat flow
              </Link>
              <a
                href="mailto:hello@sakhi.ai"
                className="inline-flex items-center justify-center rounded-full border border-mint/70 bg-white px-6 py-3 text-base font-semibold text-moss transition hover:bg-mint/45"
              >
                Talk to the team
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-lavender/55 blur-3xl" />
            <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-berry via-rose to-ink p-6 text-cream shadow-soft backdrop-blur">
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-6 text-cream backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-peach/90">Live guidance</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">Ask softly. Learn clearly.</h2>
                <p className="mt-4 text-sm leading-7 text-cream/84">
                  The interface is designed to feel calm, respectful, and safe for first-time users,
                  caregivers, and younger learners alike.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {languageHighlights.map((language, index) => (
                    <Badge key={language} tone={index % 3 === 0 ? "lavender" : index % 3 === 1 ? "mint" : "dark"}>
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Designed for trust"
                  body="Clear explanations, privacy-aware UX, and a tone that never feels rushed or dismissive."
                  tone="lavender"
                />
                <InfoCard
                  title="Accessible by default"
                  body="Large type, gentle contrast, and layout choices that work smoothly across screen sizes."
                  tone="mint"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="chat" className="border-t border-berry/10 bg-gradient-to-b from-white/75 to-lavender/35">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="AI chat"
              title="A calm conversation that teaches without overwhelming."
              description="The first interaction should feel reassuring, especially for users who are shy, anxious, or asking for the first time."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {quickPrompts.map((prompt, index) => (
                <Badge key={prompt} tone={index % 2 === 0 ? "lavender" : "mint"}>
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-peach/60 bg-gradient-to-br from-peach/50 via-white to-lavender/45 p-5 shadow-soft">
            <div className="rounded-[1.5rem] bg-white/92 p-5 backdrop-blur">
              <div className="flex items-center justify-between border-b border-berry/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-moss">Sakhi</p>
                  <p className="mt-1 text-sm text-ink/60">Gentle education for women and girls</p>
                </div>
                <span className="rounded-full bg-mint/70 px-3 py-1 text-xs font-semibold text-moss">
                  Safe mode on
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={`${message.role}-${message.text}`}
                    className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 ${
                      message.role === "User"
                        ? "ml-auto rounded-br-md bg-gradient-to-r from-rose to-berry text-cream"
                        : message.highlight
                          ? "rounded-bl-md bg-blush/75 text-ink"
                          : "rounded-bl-md bg-cream text-ink"
                    }`}
                  >
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] opacity-70">
                      {message.role}
                    </p>
                    <p className="mt-2">{message.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="border-t border-berry/10 bg-gradient-to-b from-white/70 to-peach/25">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="What Sakhi AI supports"
            title="A gentle foundation for the first version."
            description="The first frontend experience should make the platform feel calm, trustworthy, and ready for future learning flows."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {supportCards.map((card, index) => (
              <InfoCard key={card.title} title={card.title} body={card.body} tone={index === 1 ? "mint" : index === 2 ? "lavender" : "cream"} />
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="border-t border-berry/10 bg-gradient-to-b from-peach/25 to-white/90">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="User journey"
            title="A simple path from curiosity to confidence."
            description="The navigation should help users understand where to start, how to learn, and how to return later without friction."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {journeySteps.map((step, index) => (
              <FlowCard
                key={step.step}
                step={step.step}
                title={step.title}
                body={step.body}
                accent={<span className="text-xs font-medium text-berry/70">0{index + 1}</span>}
              />
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {journeyAudiences.map((audience, index) => (
              <InfoCard
                key={audience.title}
                title={audience.title}
                body={audience.body}
                tone={index === 1 ? "mint" : index === 2 ? "lavender" : "blush"}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="languages" className="border-t border-berry/10 bg-gradient-to-b from-white/75 to-mint/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Language support"
              title="Multilingual by design, not as an afterthought."
              description="The app should make users feel at home in the language they choose first, while keeping content consistent and easy to extend later."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {languageHighlights.map((language, index) => (
                <Badge key={language} tone={index % 3 === 0 ? "rose" : index % 3 === 1 ? "lavender" : "mint"}>
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-berry via-rose to-ink p-8 text-cream shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-peach/80">Why it matters</p>
            <p className="mt-4 text-xl leading-8 text-cream/90">
              Language is part of safety. When users can understand the UI immediately, they can focus on learning instead of translating.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard
                title="Readable on mobile"
                body="Responsive sections keep text comfortable to scan even on smaller screens."
                tone="ink"
              />
              <InfoCard
                title="Extendable later"
                body="The structure is ready for localized content and additional regional languages."
                tone="ink"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="border-t border-berry/10 bg-gradient-to-b from-white/70 to-lavender/25">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Safety boundaries"
            title="Helpful guidance without crossing into medical advice."
            description="The interface should make the platform feel supportive while preserving clear boundaries around education and professional care."
          />

          <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-ink via-moss to-berry px-8 py-7 text-cream shadow-soft">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-sm leading-6 text-cream/88 backdrop-blur"
                >
                  {pillar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
