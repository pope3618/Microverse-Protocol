import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { Providers } from "@/components/providers";
import { GlassNav } from "@/components/glass-nav";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Microverse Protocol",
  description:
    "小宇宙 AI 共識協議 — 錨定全球 AI 算力，定義數位資產的重工業時代",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${unbounded.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <LanguageProvider>
            <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-[max(env(safe-area-inset-bottom),1.5rem)]">
              <GlassNav />
              <main className="flex-1 px-4 pt-4">{children}</main>
              <SiteFooter />
            </div>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
