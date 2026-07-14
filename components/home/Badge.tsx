import type { ReactNode } from "react";

type BadgeTone = "rose" | "neutral" | "dark" | "lavender" | "mint";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  rose: "border-rose/20 bg-peach/80 text-berry",
  neutral: "border-berry/10 bg-white/80 text-berry",
  dark: "border-white/10 bg-white/12 text-cream",
  lavender: "border-lavender/70 bg-lavender/85 text-berry",
  mint: "border-mint/70 bg-mint/85 text-moss",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
