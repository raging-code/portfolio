import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "bycarlo — Web Design & Development",
  description: "Custom websites for weddings, birthdays, corporate brands, and businesses. Freelance web developer based in the Philippines.",
  keywords: ["web design", "web development", "freelance", "Philippines", "wedding website", "corporate website"],
  openGraph: {
    title: "bycarlo",
    description: "Custom websites for every occasion.",
    url: "https://bycarlo.vercel.app",
    siteName: "bycarlo",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased cursor-none">{children}</body>
    </html>
  );
}