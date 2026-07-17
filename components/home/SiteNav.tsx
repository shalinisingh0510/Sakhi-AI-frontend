"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type NavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items: NavItem[];
};

export function SiteNav({ items }: SiteNavProps) {
  const t = useTranslations("SiteNav");

  return (
    <header className="flex flex-col gap-4 rounded-[1.5rem] border border-peach/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-berry">{t("brand")}</p>
          <p className="mt-1 text-sm text-berry/80">{t("tagline")}</p>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/login"
            className="rounded-full border border-berry/20 bg-white px-4 py-2 text-sm font-medium text-berry transition hover:border-berry/30 hover:bg-peach/35"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-4 py-2 text-sm font-semibold text-white transition hover:from-berry hover:to-rose"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>

      <nav aria-label="Primary" className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-berry/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-berry/20 hover:bg-peach/50"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2 lg:flex">
        <Link
          href="/login"
          className="rounded-full border border-berry/20 bg-white px-4 py-2 text-sm font-medium text-berry transition hover:border-berry/30 hover:bg-peach/35"
        >
          {t("login")}
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-4 py-2 text-sm font-semibold text-white transition hover:from-berry hover:to-rose"
        >
          {t("signUp")}
        </Link>
      </div>
    </header>
  );
}
