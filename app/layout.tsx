import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-stamp",
  display: "swap",
  weight: ["400", "500"],
});

const SITE_URL = "https://nomadic-kitchen.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nomadic Kitchen — The kitchen that follows you outside",
  description:
    "A hand-built, wood-clad outdoor kitchen cart, made to order. Configure your build and request a quote. Starting at $9,950.",
  keywords: [
    "outdoor kitchen",
    "kitchen cart",
    "built to order",
    "overlanding kitchen",
    "wood outdoor kitchen",
    "Nomadic Kitchen",
  ],
  openGraph: {
    title: "Nomadic Kitchen — The kitchen that follows you outside",
    description:
      "A hand-built, wood-clad outdoor kitchen cart, made to order. Starting at $9,950.",
    url: SITE_URL,
    siteName: "Nomadic Kitchen",
    images: [{ url: "/images/hero-defender.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomadic Kitchen",
    description:
      "A hand-built, wood-clad outdoor kitchen cart, made to order. Starting at $9,950.",
    images: ["/images/hero-defender.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
