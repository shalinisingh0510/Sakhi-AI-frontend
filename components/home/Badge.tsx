import type { ReactNode } from "react";

type BadgeTone = "rose" | "neutral" | "dark";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  rose: "border-rose/20 bg-white text-rose",
  neutral: "border-berry/10 bg-white/75 text-berry",
  dark: "border-white/10 bg-white/10 text-cream",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
