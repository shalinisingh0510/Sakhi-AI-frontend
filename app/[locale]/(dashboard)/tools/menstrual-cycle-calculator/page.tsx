import type { Metadata } from "next";
import { MenstrualCycleCalculator } from "@/components/calculators/MenstrualCycleCalculator";

export const metadata: Metadata = {
  title: "Menstrual Cycle Calculator: Phases & Hormone Rhythm | Sakhi AI",
  description:
    "Explore the 4 phases of your menstrual cycle — menstrual, follicular, ovulation, and luteal — and how your hormones fluctuate.",
};

export default function MenstrualCycleCalculatorPage() {
  return <MenstrualCycleCalculator />;
}
