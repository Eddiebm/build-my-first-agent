import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build My First Agent — Go from idea to AI agent in one afternoon",
  description:
    "A step-by-step guide that teaches anyone how to design, build, and deploy a working AI agent. No coding experience needed.",
  keywords: ["AI agent", "build AI", "beginner AI", "no-code AI", "AI assistant"],
  openGraph: {
    title: "Build My First Agent",
    description: "Go from idea to working AI agent in one afternoon.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
