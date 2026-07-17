"use client";

import { useTranslations } from "next-intl";

export function SkipToMain() {
  const t = useTranslations("Accessibility");

  return (
    <a href="#main-content" className="skip-link">
      {t("skipToMain")}
    </a>
  );
}
