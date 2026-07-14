type InfoCardProps = {
  title: string;
  body: string;
  tone?: "cream" | "blush" | "lavender" | "mint" | "ink";
};

const toneStyles = {
  cream: {
    shell: "bg-cream",
    title: "text-ink",
    body: "text-ink/70",
  },
  blush: {
    shell: "bg-blush/75",
    title: "text-ink",
    body: "text-ink/70",
  },
  lavender: {
    shell: "bg-lavender/70",
    title: "text-berry",
    body: "text-ink/70",
  },
  mint: {
    shell: "bg-mint/70",
    title: "text-moss",
    body: "text-ink/70",
  },
  ink: {
    shell: "bg-gradient-to-br from-berry via-rose to-ink",
    title: "text-cream",
    body: "text-cream/84",
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
