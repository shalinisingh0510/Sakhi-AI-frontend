import type { Metadata } from "next";
import { CalculatorsHub } from "@/components/calculators/CalculatorsHub";

export const metadata: Metadata = {
  title: "Health & Pregnancy Calculators | Sakhi AI",
  description:
    "Explore our complete suite of evidence-based health calculators — including ovulation, period, pregnancy due dates, beta hCG doubling, implantation, and IVF calculators.",
};

export default function ToolsPage() {
  return <CalculatorsHub />;
}
