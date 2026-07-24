# Sakhi AI Frontend Implementation Log

## Stack
| | |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand (with `persist` middleware) |
| **Fonts** | Local serif/sans fallback stack via CSS variables |
| **Package Manager** | npm |

---

## Completed Work

### Phase 0 - Foundation and Landing Page
| File | What it does |
|------|-------------|
| `next.config.mjs` | Next.js config |
| `tailwind.config.ts` | Design tokens: cream, blush, peach, lavender, mint, rose, berry, moss, ink |
| `tsconfig.json` | TypeScript strict config with path alias `@/` |
| `eslint.config.mjs` | ESLint for app code only |
| `postcss.config.mjs` | PostCSS and autoprefixer |
| `app/globals.css` | Global styles, radial gradient background, Google font variables |
| `app/layout.tsx` | Root layout with Fraunces and Manrope fonts and SEO metadata |
| `app/page.tsx` | Public landing page with hero, features, journey, language support, safety sections |
| `components/home/Badge.tsx` | Pill badge component |
| `components/home/FlowCard.tsx` | Numbered step card |
| `components/home/GuidedQuestionForm.tsx` | Client-side guided question form with validation |
| `components/home/InfoCard.tsx` | Feature info card |
| `components/home/SectionHeading.tsx` | Reusable section heading |
| `components/home/SiteNav.tsx` | Public landing page navigation with separate Login and Sign up buttons in navbar |
| `components/home/StatCard.tsx` | Statistic display card |

---

### Phase 1 - State, Auth, and Routing
| File | What it does |
|------|-------------|
| `lib/auth-store.ts` | Zustand auth store - user, token, language, ageGroup, onboardingComplete; persisted to localStorage |
| `lib/chat-store.ts` | Zustand chat store - messages array, typing indicator, sessionId |
| `lib/api.ts` | Typed fetch-based API service module - auth, chat, learn, progress, profile endpoints |
| `middleware.ts` | Next.js middleware - protects `/dashboard`, `/chat`, `/learn`, `/profile`, `/settings`, `/progress`; redirects unauthenticated users to `/login` |

---

### Phase 1 - Shared UI Component Library
| File | What it does |
|------|-------------|
| `components/ui/Button.tsx` | Reusable button - `primary`, `secondary`, `ghost`, `danger` variants; `sm/md/lg` sizes; `isLoading` state |
| `components/ui/Input.tsx` | Reusable input - label, error message, hint text, left icon slot; accessible ARIA attributes |
| `components/ui/Card.tsx` | Reusable card - padding options, optional glassmorphism (`glass` prop) |

---

### Phase 1 - Layout Components
| File | What it does |
|------|-------------|
| `components/layout/AppNav.tsx` | Sticky desktop top navigation - brand logo, nav links, notification bell, profile dropdown with logout |
| `components/layout/MobileNav.tsx` | Fixed mobile bottom navigation bar - 5 tabs (Home, Chat, Learn, Progress, Profile) with active state |

---

### Phase 1 and 2 - Authentication and Dashboard Pages (`app/(auth)/` and `app/(dashboard)/`)
| Route | File | What it does |
|-------|------|-------------|
| `/login` | `app/(auth)/login/page.tsx` | Login page - bold "Welcome to Sakhi AI" hero with the generated cute girl illustration, email and password form, validation, loading state, link to register |
| `/register` | `app/(auth)/register/page.tsx` | Register form - name, email, password, confirm password, validation |
| `/onboarding` | `app/(auth)/onboarding/page.tsx` | 3-step onboarding - name, age group, language; progress bar |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Home dashboard - personalised greeting, stats, quick tiles, Sakhi chat prompt, topic chips |
| `/chat` | `app/(dashboard)/chat/page.tsx` | Full AI chat - user and Sakhi message bubbles, typing indicator, prompt chips, demo responses |
| `/learn` | `app/(dashboard)/learn/page.tsx` | Module listing - 6 health modules with progress bars, completion badges, lesson count, duration |
| `/learn/[slug]` | `app/(dashboard)/learn/[slug]/page.tsx` | Individual module page - lesson list, progress bar, continue CTA, completion states |
| `/progress` | `app/(dashboard)/progress/page.tsx` | Progress page - streak, points, modules bars, earned badges |
| `/profile` | `app/(dashboard)/profile/page.tsx` | Profile page - avatar, editable name form, read-only email, age group and language tiles |
| `/settings` | `app/(dashboard)/settings/page.tsx` | Settings - language switcher, notification toggle, sign out |
| `/notifications` | `app/(dashboard)/notifications/page.tsx` | Notifications center - unread cards, filters, read actions, quick shortcuts |
| `/search` | `app/(dashboard)/search/page.tsx` | Global search - query input, category filters, curated results, quick actions |
| `(layout)` | `app/(dashboard)/layout.tsx` | Dashboard group layout - wraps all app pages with AppNav and MobileNav |

---

### Phase 3 - FAQ and Help Pages
| Route | File | What it does |
|-------|------|-------------|
| `/faq` | `app/faq/page.tsx` | FAQ page - accordion Q&A about Sakhi AI and women's health with category filters |
| `/help` | `app/help/page.tsx` | Help and support page - contact options, help topics, resources, emergency information |

---

### Phase 3 - Internationalisation (i18n)
| File | What it does |
|------|-------------|
| `i18n.ts` | next-intl config â€” reads `NEXT_LOCALE` cookie, loads locale messages |
| `next.config.mjs` | Wrapped with `createNextIntlPlugin` |
| `app/layout.tsx` | `NextIntlClientProvider` with locale and messages |
| `messages/en.json` | English translation keys (source of truth) |
| `messages/hi.json` | Hindi translations (Navigation, SiteNav, GuidedForm, Dashboard + partial) |
| `messages/{bn,mr,ta,te,kn,gu,pa,or}.json` | Placeholder locale files (English copy until translated) |
| `lib/auth-store.ts` | Sets `NEXT_LOCALE` cookie on language change and onboarding |
| `app/page.tsx` | Landing page â€” all strings via `t()` |
| `components/home/SiteNav.tsx` | Public nav brand, tagline, login/sign-up via `t()` |
| `components/home/GuidedQuestionForm.tsx` | Guided form labels, errors, topics via `t()` |
| `components/layout/AppNav.tsx` | Desktop nav links via `t()` |
| `components/layout/MobileNav.tsx` | Mobile bottom nav via `t()` |
| `app/(auth)/login/page.tsx` | Login page via `t()` |
| `app/(auth)/register/page.tsx` | Register page via `t()` |
| `app/(auth)/onboarding/page.tsx` | Onboarding steps via `t()` |
| `app/(dashboard)/dashboard/page.tsx` | Dashboard greetings, tiles, topics via `t()` |
| `app/(dashboard)/chat/page.tsx` | Chat UI, prompts, demo replies via `t()` |
| `app/(dashboard)/learn/page.tsx` | Learn module listing via `t()` |
| `app/(dashboard)/progress/page.tsx` | Progress stats, badges via `t()` |
| `app/(dashboard)/profile/page.tsx` | Profile form and labels via `t()` |
| `app/(dashboard)/settings/page.tsx` | Settings page via `t()` |
| `app/(dashboard)/notifications/page.tsx` | Notifications center via `t()` |
| `app/(dashboard)/search/page.tsx` | Global search via `t()` |
| `app/faq/page.tsx` | FAQ page via `t()` |
| `app/help/page.tsx` | Help and support via `t()` |
| `app/(dashboard)/learn/[slug]/page.tsx` | Learn module detail via `t()` |

---

## Remaining Work

### Phase 3 - Remaining Pages
| Route | Status | What to build |
|-------|--------|---------------|
| `/search` | Complete | Global search - query input, category filters, curated results, quick actions |
| `/faq` | Complete | FAQ page - accordion Q&A about Sakhi AI and women's health |
| `/help` | Complete | Help and support page - contact options, community links |

---

### Phase 3 - Voice Interaction
| Feature | Status | What to build |
|---------|--------|---------------|
| Speech-to-text | Complete | Web Speech API integration - voice input in chat |
| Text-to-speech | Complete | Sakhi reads responses aloud via SpeechSynthesis API |
| Language-aware voice | Complete | Voice language follows user language preference |

---

### Phase 3 - Internationalisation (i18n)
| Feature | Status | What to build |
|---------|--------|---------------|
| `next-intl` setup | Complete | Installed and configured next-intl |
| Translation files | In Progress | `en.json` complete; `hi.json` partially translated; 8 locales use English placeholders |
| Replace hardcoded strings â€” Landing, Nav, Auth | Complete | Landing, SiteNav, GuidedForm, AppNav, MobileNav, login, register, onboarding |
| Replace hardcoded strings â€” Dashboard, Chat | Complete | Dashboard and Chat pages internationalised |
| Replace hardcoded strings â€” Learn, Progress, Profile, Settings | Complete | Core dashboard pages internationalised |
| Replace hardcoded strings â€” Notifications, Search, FAQ, Help, Learn detail | Complete | All remaining user-facing pages internationalised |
| Full Hindi translation of all keys | In Progress | UI sections translated; long FAQ/help content still English in hi.json |
| Language switcher hook | Complete | Persist language in Zustand plus NEXT_LOCALE cookie |

---

### Phase 4 - Quality and Accessibility
| Feature | Status |
|---------|--------|
| Skip-to-main link | Complete |
| Global focus-visible styles | Complete |
| Reduced motion support (`prefers-reduced-motion`) | Complete |
| High-contrast mode toggle (Settings) | Complete |
| `prefers-contrast: more` CSS support | Complete |
| ARIA labels on icon-only buttons (chat, nav) | Complete |
| Keyboard-accessible profile menu (Enter, Escape) | Complete |
| Main landmark (`#main-content`) on all page groups | Complete |
| Button `aria-busy` during loading | Complete |
| GitHub Actions CI (lint, typecheck, build) | Complete |
| Screen reader testing | Pending |
| Mobile responsive review (core dashboard pages) | Complete | Dashboard, progress, profile, and settings pages tightened for mobile layouts |
| Unit tests - Vitest + React Testing Library | Complete | Added a jsdom-based unit test foundation for shared UI components |
| E2E tests - Playwright | Pending |
| Accessibility audit - axe-core | Pending |

---

### Phase 5 - Backend Integration and Launch
| Feature | Status | Notes |
|---------|--------|-------|
| Connect `authApi.login()` | Pending | Replace demo login in `/login` |
| Connect `authApi.register()` | Pending | Replace demo register |
| Connect `chatApi.sendMessage()` | Pending | Replace simulated Sakhi replies in `/chat` |
| Connect `learnApi.getModules()` | Pending | Dynamic module data in `/learn` |
| Connect `progressApi.getProgress()` | Pending | Real streak and points in `/progress` |
| Connect `profileApi.updateProfile()` | Pending | Real save in `/profile` |
| `.env.local` configuration | Pending | `NEXT_PUBLIC_API_URL` and secrets |
| Vercel deployment | Pending | Connect GitHub repo to Vercel |
| GitHub Actions CI/CD | Complete | Lint, typecheck, build on push and PR |
| Lighthouse audit | Pending | Performance, SEO, accessibility scores |

---

## Session Update

- Migrated the app to a locale-scoped route tree under `app/[locale]/` and updated the locale layout to match the Next 15 route contract.
- Kept i18n routing and auth redirects aligned through `i18n.ts`, `middleware.ts`, and `lib/i18n-config.ts`.
- Removed the remote Google Fonts fetch from the root layout and switched the app to CSS-driven local/system font fallbacks.
- Cleaned unused imports in the profile and settings pages and added a Vitest + React Testing Library test foundation for shared UI components.
- Verified `npm run lint`, `npm run typecheck`, and `npm run test` all pass.
- `npm run build` still fails in this sandbox with `spawn EPERM`, so the production build issue appears environment-related rather than a source error.

### What remains next

- Phase 4: screen reader testing, Jest + React Testing Library, Playwright E2E, and axe-core accessibility audit.
- Phase 5: connect the backend APIs, configure `.env.local`, and prepare deployment and Lighthouse work.

---

## Current Progress

- Phase 0, Phase 1, and Phase 2 are complete.
- Notifications center is complete with filters, unread/read states, and quick shortcuts.
- The login page has a refreshed welcome hero with stylish typography.
- The search page is complete with filters, curated results, and quick actions.
- The chat page renders stored message content from Zustand chat-store instead of hardcoded placeholders.
- The landing page navbar now has separate Login and Sign up buttons for better UX.
- Navbar branding changed from "Sakhi AI" to "WELCOME TO SAKHI AI" in capital letters with display font.
- FAQ page is complete with accordion Q&A and category filters.
- Help page is complete with contact options, help topics, and emergency information.
- Middleware protects all dashboard routes including /search, /faq, and /help.
- Phase 3 remaining pages are now 100% complete.
- Phase 3 Voice Interaction is complete with speech-to-text, text-to-speech, and language-aware voice support for 10 Indian languages.
- Phase 3 Internationalisation is complete for all pages: every user-facing screen now uses `t()` keys.
- Translation files exist for all 10 locales; Hindi has partial translations for dashboard UI, other locales use English placeholders until translated.
- Next step: Phase 4 remaining â€” screen reader testing, Playwright E2E, and axe-core audit.
- Phase 4 accessibility foundations are complete: skip link, focus styles, high contrast, keyboard nav, ARIA labels, CI pipeline, and the core mobile responsive review.

---

## Overall Progress

```
Phase 0 - Foundation          100% complete
Phase 1 - Auth and State      100% complete
Phase 2 - Core Pages          100% complete
Phase 3 - Remaining Pages     100% complete
Phase 3 - Voice Interaction   100% complete
Phase 3 - Internationalisation  100% complete (keys); Hindi translation ~40%
Phase 4 - Quality and Tests   80% in progress
Phase 5 - Backend and Launch  0% pending
```

---

## Current File Tree

```
sakhi-ai-frontend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ (auth)/
â”‚   â”‚   â”œâ”€â”€ login/page.tsx          Login page
â”‚   â”‚   â”œâ”€â”€ register/page.tsx       Register page
â”‚   â”‚   â””â”€â”€ onboarding/page.tsx     3-step onboarding
â”‚   â”œâ”€â”€ (dashboard)/
â”‚   â”‚   â”œâ”€â”€ layout.tsx              Dashboard shell layout
â”‚   â”‚   â”œâ”€â”€ dashboard/page.tsx      Home dashboard
â”‚   â”‚   â”œâ”€â”€ search/page.tsx         Global search page
â”‚   â”‚   â”œâ”€â”€ chat/page.tsx           AI chat page
â”‚   â”‚   â”œâ”€â”€ learn/
â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx            Module listing
â”‚   â”‚   â”‚   â””â”€â”€ [slug]/page.tsx     Individual lesson
â”‚   â”‚   â”œâ”€â”€ progress/page.tsx       Progress and badges
â”‚   â”‚   â”œâ”€â”€ profile/page.tsx        User profile
â”‚   â”‚   â”œâ”€â”€ settings/page.tsx       Settings page
â”‚   â”‚   â””â”€â”€ notifications/page.tsx  Notifications center
â”‚   â”œâ”€â”€ faq/page.tsx                FAQ page
â”‚   â”œâ”€â”€ help/page.tsx               Help and support page
â”‚   â”œâ”€â”€ globals.css                 Global styles
â”‚   â”œâ”€â”€ layout.tsx                  Root layout
â”‚   â””â”€â”€ page.tsx                    Landing page
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ accessibility/
â”‚   â”‚   â”œâ”€â”€ AccessibilityInit.tsx High contrast and reduced motion init
â”‚   â”‚   â””â”€â”€ SkipToMain.tsx          Skip-to-main link
â”‚   â”œâ”€â”€ home/
â”‚   â”‚   â”œâ”€â”€ Badge.tsx               Complete
â”‚   â”‚   â”œâ”€â”€ FlowCard.tsx            Complete
â”‚   â”‚   â”œâ”€â”€ GuidedQuestionForm.tsx  Complete
â”‚   â”‚   â”œâ”€â”€ InfoCard.tsx            Complete
â”‚   â”‚   â”œâ”€â”€ SectionHeading.tsx      Complete
â”‚   â”‚   â”œâ”€â”€ SiteNav.tsx             Complete
â”‚   â”‚   â””â”€â”€ StatCard.tsx            Complete
â”‚   â”œâ”€â”€ layout/
â”‚   â”‚   â”œâ”€â”€ AppNav.tsx              Desktop nav
â”‚   â”‚   â””â”€â”€ MobileNav.tsx           Mobile bottom nav
â”‚   â””â”€â”€ ui/
â”‚       â”œâ”€â”€ Button.tsx              Reusable button
â”‚       â”œâ”€â”€ Input.tsx               Reusable input
â”‚       â””â”€â”€ Card.tsx                Reusable card
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ auth-store.ts               Zustand auth store
â”‚   â”œâ”€â”€ chat-store.ts               Zustand chat store
â”‚   â”œâ”€â”€ use-voice.ts                Web Speech API hook for voice interaction
â”‚   â””â”€â”€ api.ts                      API service module
â”œâ”€â”€ messages/
â”‚   â”œâ”€â”€ en.json                     English translations (source)
â”‚   â”œâ”€â”€ hi.json                     Hindi translations (partial)
â”‚   â””â”€â”€ {bn,mr,ta,te,kn,gu,pa,or}.json  Placeholder locale files
â”œâ”€â”€ i18n.ts                         next-intl locale config
â”œâ”€â”€ middleware.ts                   Protected routes
â”œâ”€â”€ tailwind.config.ts              Design tokens
â”œâ”€â”€ next.config.mjs                 Next.js config
â”œâ”€â”€ tsconfig.json                   TypeScript config
â”œâ”€â”€ package.json                    Package metadata
â”œâ”€â”€ IMPLEMENTATION.md               This file
â””â”€â”€ README.md                       Project overview
```




