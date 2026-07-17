"use client";

import { useEffect } from "react";

const STORAGE_KEY = "sakhi-high-contrast";

export function AccessibilityInit() {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      document.documentElement.setAttribute("data-high-contrast", "true");
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      document.documentElement.toggleAttribute("data-reduced-motion", media.matches);
    };
    applyMotion();
    media.addEventListener("change", applyMotion);
    return () => media.removeEventListener("change", applyMotion);
  }, []);

  return null;
}

export function setHighContrast(enabled: boolean) {
  localStorage.setItem(STORAGE_KEY, String(enabled));
  document.documentElement.toggleAttribute("data-high-contrast", enabled);
}

export function getHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}
