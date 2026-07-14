import Link from "next/link";

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

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-radial">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-berry/10 bg-white/75 px-5 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-moss">Sakhi AI</p>
            <p className="mt-1 text-sm text-berry/80">Trusted health education, made calmer.</p>
          </div>
          <Link
            href="#support"
            className="rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white transition hover:bg-berry/90"
          >
            Explore support
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-rose/20 bg-white px-4 py-2 text-sm font-medium text-rose shadow-sm">
              Multilingual women&apos;s health education
            </span>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              Support that feels warm, clear, and quietly confident.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72 sm:text-xl">
              Sakhi AI helps girls and women learn about periods, hygiene, puberty, nutrition,
              mental wellbeing, and emergency awareness in language that feels safe and easy to trust.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#support"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-base font-semibold text-cream transition hover:bg-ink/90"
              >
                See the experience
              </Link>
              <a
                href="mailto:hello@sakhi.ai"
                className="inline-flex items-center justify-center rounded-full border border-berry/15 bg-white px-6 py-3 text-base font-semibold text-berry transition hover:border-berry/30 hover:bg-cream"
              >
                Talk to the team
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["11", "planned languages"],
                ["24/7", "guided learning"],
                ["100%", "education first"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-soft">
                  <p className="text-3xl font-semibold text-berry">{value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ink/55">{label}</p>
                </div>
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
                    <span key={language} className="rounded-full bg-white/10 px-3 py-1 text-sm text-cream/90">
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-cream p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Designed for trust</p>
                  <p className="mt-3 text-sm leading-7 text-ink/70">
                    Clear explanations, privacy-aware UX, and a tone that never feels rushed or dismissive.
                  </p>
                </div>
                <div className="rounded-3xl bg-blush/60 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-berry">Accessible by default</p>
                  <p className="mt-3 text-sm leading-7 text-ink/70">
                    Large type, gentle contrast, and layout choices that work smoothly across screen sizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="border-t border-berry/10 bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-moss">What Sakhi AI supports</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em] text-ink sm:text-5xl">
              A gentle foundation for the first version.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {supportCards.map((card) => (
              <article key={card.title} className="rounded-[1.75rem] border border-berry/10 bg-cream p-7 shadow-sm">
                <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/70">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] bg-ink px-8 py-7 text-cream shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-blush/80">Core principles</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map((pillar) => (
                <div key={pillar} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-cream/88">
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
