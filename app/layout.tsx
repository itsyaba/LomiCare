import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/hooks/useLanguage";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selam — Wellness in your mother tongue",
  description:
    "A culturally grounded Ethiopian wellness companion. Voice journaling in Amharic, a guided Buna ceremony, ጾም-aware AI, and a coffee plant that grows with your streak.",
  applicationName: "Selam",
  keywords: [
    "Ethiopian wellness",
    "Amharic wellness app",
    "buna ceremony",
    "Selam",
    "ALX Hackathon",
    "Kuriftu",
  ],
  authors: [{ name: "Selam team" }],
  openGraph: {
    title: "Selam — Wellness in your mother tongue",
    description:
      "Voice journaling in Amharic, a guided Ethiopian coffee ceremony, ጾም-aware AI, and a coffee plant that grows with your streak.",
    siteName: "Selam",
    type: "website",
    locale: "en_ET",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selam — Wellness in your mother tongue",
    description:
      "Ethiopian wellness, voice journaling in Amharic, the Buna ceremony, ጾም-aware AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${cormorant.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
