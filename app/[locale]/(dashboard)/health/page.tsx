import { setRequestLocale } from "next-intl/server";
import { HealthHeader, HealthSnapshot, HealthEmptyState } from "@/components/health";

export default function HealthPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <HealthHeader />
      <HealthSnapshot />
      <HealthEmptyState />
    </div>
  );
}
