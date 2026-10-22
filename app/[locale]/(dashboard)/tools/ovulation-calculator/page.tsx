import type { Metadata } from "next";
import { OvulationCalculator } from "@/components/calculators/OvulationCalculator";

export const metadata: Metadata = {
  title: "Ovulation Calculator: Figure Out Your Fertile Days | Sakhi AI",
  description:
    "Our clinical ovulation calculator predicts your 6-day fertile window and likely ovulation day to help you maximize conception or understand your cycle.",
};

export default function OvulationCalculatorPage() {
  return <OvulationCalculator />;
}
