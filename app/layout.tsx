import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://build-my-first-agent.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Build My First Agent — Go from idea to AI agent in 60 seconds",
    template: "%s | Build My First Agent",
  },
  description:
    "Hire a pre-built AI employee or build your own in 2 minutes. No coding. Customer service reps, leasing coordinators, sales agents — live and shareable instantly.",
  keywords: [
    "AI agent builder",
    "no-code AI",
    "AI employee",
    "AI customer service",
    "hire AI agent",
    "build AI agent",
    "AI for small business",
  ],
  openGraph: {
    title: "Build My First Agent",
    description: "Hire an AI employee or build your own in 60 seconds. No coding required.",
    type: "website",
    url: APP_URL,
    siteName: "Build My First Agent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build My First Agent",
    description: "Hire an AI employee or build your own in 60 seconds. No coding required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
