import type { Metadata } from "next";
import { IvfDueDateCalculator } from "@/components/calculators/IvfDueDateCalculator";

export const metadata: Metadata = {
  title: "IVF and FET Due Date Calculator | Sakhi AI",
  description:
    "Calculate your accurate due date following a Day 3, Day 5 blastocyst, Day 6, or fresh/frozen embryo transfer.",
};

export default function IvfDueDateCalculatorPage() {
  return <IvfDueDateCalculator />;
}
