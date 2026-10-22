import type { Metadata } from "next";
import { PeriodCalculator } from "@/components/calculators/PeriodCalculator";

export const metadata: Metadata = {
  title: "Period Calculator: Predict Your Next 3 Cycles | Sakhi AI",
  description:
    "Predict when your next periods will arrive, plan trips and events, and stay in tune with your personal cycle schedule.",
};

export default function PeriodCalculatorPage() {
  return <PeriodCalculator />;
}
