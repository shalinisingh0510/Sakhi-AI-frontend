import type { Metadata } from "next";
import { ImplantationCalculator } from "@/components/calculators/ImplantationCalculator";

export const metadata: Metadata = {
  title: "Implantation Calculator: When Does Implantation Occur? | Sakhi AI",
  description:
    "Calculate the exact window when a fertilized egg attaches to the uterine lining and understand early implantation signs.",
};

export default function ImplantationCalculatorPage() {
  return <ImplantationCalculator />;
}
