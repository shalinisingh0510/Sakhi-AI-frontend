import type { ReactNode } from "react";

type FlowCardProps = {
  step: string;
  title: string;
  body: string;
  accent?: ReactNode;
};

export function FlowCard({ step, title, body, accent }: FlowCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-berry/10 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-moss">{step}</span>
        {accent}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-ink/70">{body}</p>
    </article>
  );
}
