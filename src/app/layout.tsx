import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { Toaster } from "~/components/ui/sonner";
import { Header } from "~/components/header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poker Planner",
  description: "Poker Planner is a tool for planning poker sessions",
  keywords: [
    "poker",
    "planning",
    "poker planning",
    "poker planner",
    "planning poker",
    "agile",
    "storypointing",
    "scrum",
    "scrum master tool",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark overflow-x-hidden`}
      >
        <NuqsAdapter>
          <Providers>
            <ConvexClientProvider>
              <Header />
              {children}
            </ConvexClientProvider>
          </Providers>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
