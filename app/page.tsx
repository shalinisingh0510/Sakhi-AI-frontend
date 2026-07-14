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

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-radial">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <SiteNav items={navItems} ctaLabel="Explore support" ctaHref="#support" />

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
                href="#journey"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-cream transition hover:bg-ink/90"
              >
                See the journey
              </Link>
              <a
                href="mailto:hello@sakhi.ai"
                className="inline-flex items-center justify-center rounded-full border border-berry/15 bg-white px-6 py-3 text-base font-semibold text-berry transition hover:border-berry/30 hover:bg-cream"
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
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-berry/10 blur-3xl" />
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur">
              <div className="rounded-[1.75rem] bg-ink px-5 py-6 text-cream">
                <p className="text-xs uppercase tracking-[0.35em] text-blush/90">Live guidance</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">Ask softly. Learn clearly.</h2>
                <p className="mt-4 text-sm leading-7 text-cream/80">
                  The interface is designed to feel calm, respectful, and safe for first-time users,
                  caregivers, and younger learners alike.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {languageHighlights.map((language) => (
                    <Badge key={language} tone="dark">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Designed for trust"
                  body="Clear explanations, privacy-aware UX, and a tone that never feels rushed or dismissive."
                />
                <InfoCard
                  title="Accessible by default"
                  body="Large type, gentle contrast, and layout choices that work smoothly across screen sizes."
                  tone="blush"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="border-t border-berry/10 bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="What Sakhi AI supports"
            title="A gentle foundation for the first version."
            description="The first frontend experience should make the platform feel calm, trustworthy, and ready for future learning flows."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {supportCards.map((card) => (
              <InfoCard key={card.title} title={card.title} body={card.body} />
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="border-t border-berry/10 bg-cream/90">
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
        </div>
      </section>

      <section id="languages" className="border-t border-berry/10 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-10">
          <div>
            <SectionHeading
              eyebrow="Language support"
              title="Multilingual by design, not as an afterthought."
              description="The app should make users feel at home in the language they choose first, while keeping content consistent and easy to extend later."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {languageHighlights.map((language) => (
                <Badge key={language}>{language}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-ink p-8 text-cream shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-blush/80">Why it matters</p>
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

      <section id="safety" className="border-t border-berry/10 bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Safety boundaries"
            title="Helpful guidance without crossing into medical advice."
            description="The interface should make the platform feel supportive while preserving clear boundaries around education and professional care."
          />

          <div className="mt-10 rounded-[2rem] bg-ink px-8 py-7 text-cream shadow-soft">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-cream/88"
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
