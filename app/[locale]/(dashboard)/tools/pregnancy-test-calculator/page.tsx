import type { Metadata } from "next";
import { PregnancyTestCalculator } from "@/components/calculators/PregnancyTestCalculator";

export const metadata: Metadata = {
  title: "Pregnancy Test Calculator: When to Take a Test | Sakhi AI",
  description:
    "Find out the most accurate day to take a home pregnancy test based on your last period or ovulation date to prevent false negatives.",
};

export default function PregnancyTestCalculatorPage() {
  return <PregnancyTestCalculator />;
}
