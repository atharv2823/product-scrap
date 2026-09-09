import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapPrice — Agentic Visual Product Price Scraper & Arbitrage",
  description: "Upload any product image to trigger an autonomous multi-agent AI pipeline that scrapes live prices across Amazon, Walmart, Best Buy, eBay, and B&H, discovers hidden coupons, and recommends smart alternatives.",
  keywords: ["price comparison", "visual search", "AI price scraper", "product image search", "ecommerce arbitrage", "agentic AI"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#060814] text-slate-100">{children}</body>
    </html>
  );
}
