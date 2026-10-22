import type { Metadata } from "next";
import { DueDateCalculator } from "@/components/calculators/DueDateCalculator";

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator | Sakhi AI",
  description:
    "Calculate your estimated due date (EDD) using your last period or conception date, and see key trimester milestones.",
};

export default function DueDateCalculatorPage() {
  return <DueDateCalculator />;
}
