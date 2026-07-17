import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakhi AI",
  description: "Trusted multilingual women's health education with a calm, supportive experience.",
};

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SkipToMain } from '@/components/accessibility/SkipToMain';
import { AccessibilityInit } from '@/components/accessibility/AccessibilityInit';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${display.variable} ${body.variable} bg-cream text-ink antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <AccessibilityInit />
          <SkipToMain />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
