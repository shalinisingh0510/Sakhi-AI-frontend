import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items: NavItem[];
};

export function SiteNav({ items }: SiteNavProps) {
  return (
    <div className="relative">
      <header className="flex flex-col gap-4 rounded-[1.5rem] border border-peach/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-berry font-display">WELCOME TO SAKHI AI</p>
            <p className="mt-1 text-sm text-berry/80">Trusted health education, made calmer.</p>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/login"
              className="rounded-full border border-berry/20 bg-white px-4 py-2 text-sm font-medium text-berry transition hover:border-berry/30 hover:bg-peach/35"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-4 py-2 text-sm font-semibold text-white transition hover:from-berry hover:to-rose"
            >
              Sign up
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
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose to-berry px-4 py-2 text-sm font-semibold text-white transition hover:from-berry hover:to-rose"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Icon outside navbar on left side */}
      <div className="absolute -left-4 top-0 hidden lg:flex items-center gap-3">
        <img
          src="/sakhi-girl-icon.png"
          alt="Sakhi AI"
          className="h-20 w-20 object-contain"
        />
        <p className="text-2xl font-bold uppercase tracking-[0.15em] text-berry font-display">
          SAKHI AI
        </p>
      </div>
    </div>
  );
}
