type InfoCardProps = {
  title: string;
  body: string;
  tone?: "cream" | "blush" | "ink";
};

const toneStyles = {
  cream: {
    shell: "bg-cream",
    title: "text-ink",
    body: "text-ink/70",
  },
  blush: {
    shell: "bg-blush/60",
    title: "text-ink",
    body: "text-ink/70",
  },
  ink: {
    shell: "bg-ink",
    title: "text-cream",
    body: "text-cream/80",
  },
} as const;

export function InfoCard({ title, body, tone = "cream" }: InfoCardProps) {
  const styles = toneStyles[tone];

  return (
    <article className={`rounded-[1.75rem] border border-berry/10 p-7 shadow-sm ${styles.shell}`}>
      <h3 className={`text-xl font-semibold ${styles.title}`}>{title}</h3>
      <p className={`mt-4 text-sm leading-7 ${styles.body}`}>{body}</p>
    </article>
  );
}
