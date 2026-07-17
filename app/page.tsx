import Link from "next/link";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/home/Badge";
import { FlowCard } from "@/components/home/FlowCard";
import { GuidedQuestionForm } from "@/components/home/GuidedQuestionForm";
import { InfoCard } from "@/components/home/InfoCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { SiteNav } from "@/components/home/SiteNav";
import { StatCard } from "@/components/home/StatCard";

export default function Home() {
  const t = useTranslations("Landing");

  const languageHighlights = t.raw("languageHighlights");
  const supportCards = t.raw("supportCards");
  const pillars = t.raw("pillars");
  const stats = t.raw("stats");
  const navItems = t.raw("navItems");
  const journeySteps = t.raw("journeySteps");
  const chatMessages = t.raw("chatMessages");
  const quickPrompts = t.raw("quickPrompts");
  const journeyAudiences = t.raw("journeyAudiences");

  return (
    <main id="main-content" className="min-h-screen bg-hero-radial" tabIndex={-1}>
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <SiteNav items={navItems} />

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <Badge tone="rose">{t("hero.badge")}</Badge>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72 sm:text-xl">
              {t("hero.description")}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#chat"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-6 py-3 text-base font-semibold text-cream transition hover:from-berry hover:to-rose"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <a
                href="mailto:hello@sakhi.ai"
                className="inline-flex items-center justify-center rounded-full border border-mint/70 bg-white px-6 py-3 text-base font-semibold text-moss transition hover:bg-mint/45"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat: { value: string; label: string }) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-lavender/55 blur-3xl" />
            <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-berry via-rose to-ink p-6 text-cream shadow-soft backdrop-blur">
              <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-6 text-cream backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-peach/90">{t("liveGuidance.eyebrow")}</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">{t("liveGuidance.title")}</h2>
                <p className="mt-4 text-sm leading-7 text-cream/84">
                  {t("liveGuidance.description")}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {languageHighlights.map((language: string, index: number) => (
                    <Badge key={language} tone={index % 3 === 0 ? "lavender" : index % 3 === 1 ? "mint" : "dark"}>
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title={t("liveGuidance.card1.title")}
                  body={t("liveGuidance.card1.body")}
                  tone="lavender"
                />
                <InfoCard
                  title={t("liveGuidance.card2.title")}
                  body={t("liveGuidance.card2.body")}
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
              eyebrow={t("chatSection.eyebrow")}
              title={t("chatSection.title")}
              description={t("chatSection.description")}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {quickPrompts.map((prompt: string, index: number) => (
                <Badge key={prompt} tone={index % 2 === 0 ? "lavender" : "mint"}>
                  {prompt}
                </Badge>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-peach/70 bg-white/85 p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-moss">{t("chatSection.preview")}</p>
              <div className="mt-4 space-y-4">
                {chatMessages.map((message: { role: string; text: string; highlight?: boolean }) => (
                  <div
                    key={`${message.role}-${message.text}`}
                    className={`max-w-[92%] rounded-[1.35rem] px-4 py-3 text-sm leading-7 ${
                      message.role === "User"
                        ? "ml-auto rounded-br-md bg-gradient-to-r from-rose to-berry text-cream"
                        : message.highlight
                          ? "rounded-bl-md bg-blush/75 text-ink"
                          : "rounded-bl-md bg-cream text-ink"
                    }`}
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] opacity-70">
                      {message.role}
                    </p>
                    <p className="mt-2">{message.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GuidedQuestionForm languages={languageHighlights} />
        </div>
      </section>

      <section id="support" className="border-t border-berry/10 bg-gradient-to-b from-white/70 to-peach/25">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow={t("supportSection.eyebrow")}
            title={t("supportSection.title")}
            description={t("supportSection.description")}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {supportCards.map((card: { title: string; body: string }, index: number) => (
              <InfoCard key={card.title} title={card.title} body={card.body} tone={index === 1 ? "mint" : index === 2 ? "lavender" : "cream"} />
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="border-t border-berry/10 bg-gradient-to-b from-peach/25 to-white/90">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow={t("journeySection.eyebrow")}
            title={t("journeySection.title")}
            description={t("journeySection.description")}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {journeySteps.map((step: { step: string; title: string; body: string }, index: number) => (
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
            {journeyAudiences.map((audience: { title: string; body: string }, index: number) => (
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
              eyebrow={t("languagesSection.eyebrow")}
              title={t("languagesSection.title")}
              description={t("languagesSection.description")}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {languageHighlights.map((language: string, index: number) => (
                <Badge key={language} tone={index % 3 === 0 ? "rose" : index % 3 === 1 ? "lavender" : "mint"}>
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-berry via-rose to-ink p-8 text-cream shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-peach/80">{t("languagesSection.whyItMatters")}</p>
            <p className="mt-4 text-xl leading-8 text-cream/90">
              {t("languagesSection.whyItMattersText")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard
                title={t("languagesSection.card1.title")}
                body={t("languagesSection.card1.body")}
                tone="ink"
              />
              <InfoCard
                title={t("languagesSection.card2.title")}
                body={t("languagesSection.card2.body")}
                tone="ink"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="border-t border-berry/10 bg-gradient-to-b from-white/70 to-lavender/25">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow={t("safetySection.eyebrow")}
            title={t("safetySection.title")}
            description={t("safetySection.description")}
          />

          <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-ink via-moss to-berry px-8 py-7 text-cream shadow-soft">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map((pillar: string) => (
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
