import type { Metadata } from "next";
import { HcgCalculator } from "@/components/calculators/HcgCalculator";

export const metadata: Metadata = {
  title: "Beta hCG Doubling Time Calculator & Charts | Sakhi AI",
  description:
    "Track quantitative serum beta-hCG blood test results, calculate doubling time in hours and days, and view standard clinical reference curves.",
};

export default function HcgCalculatorPage() {
  return <HcgCalculator />;
}
