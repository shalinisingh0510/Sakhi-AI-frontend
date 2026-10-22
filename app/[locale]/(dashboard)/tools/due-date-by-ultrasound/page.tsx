import type { Metadata } from "next";
import { UltrasoundDueDateCalculator } from "@/components/calculators/UltrasoundDueDateCalculator";

export const metadata: Metadata = {
  title: "Due Date Calculator by Ultrasound | Sakhi AI",
  description:
    "Calculate your due date based on an early sonogram / ultrasound scan and understand ACOG redating criteria.",
};

export default function DueDateByUltrasoundPage() {
  return <UltrasoundDueDateCalculator />;
}
