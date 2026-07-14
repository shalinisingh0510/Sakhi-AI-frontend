type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-moss">{eyebrow}</p>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em] text-ink sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-ink/70 sm:text-lg">{description}</p>
    </div>
  );
}
