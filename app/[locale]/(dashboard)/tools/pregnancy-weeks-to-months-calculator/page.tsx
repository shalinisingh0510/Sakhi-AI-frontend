import type { Metadata } from "next";
import { PregnancyWeeksToMonthsCalculator } from "@/components/calculators/PregnancyWeeksToMonthsCalculator";

export const metadata: Metadata = {
  title: "Pregnancy Weeks to Months Calculator | Sakhi AI",
  description:
    "Convert pregnancy weeks into months and trimesters, track fetal size comparisons, and understand developmental milestones.",
};

export default function PregnancyWeeksToMonthsPage() {
  return <PregnancyWeeksToMonthsCalculator />;
}
