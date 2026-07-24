import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakhi AI",
  description: "Trusted multilingual women's health education with a calm, supportive experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
