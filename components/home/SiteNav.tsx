import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items: NavItem[];
  ctaLabel: string;
  ctaHref: string;
};

export function SiteNav({ items, ctaLabel, ctaHref }: SiteNavProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[1.5rem] border border-peach/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-moss">Sakhi AI</p>
        <p className="mt-1 text-sm text-berry/80">Trusted health education, made calmer.</p>
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

      <Link
        href={ctaHref}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-4 py-2 text-sm font-semibold text-white transition hover:from-berry hover:to-rose"
      >
        {ctaLabel}
      </Link>
    </header>
  );
}
