import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "마케팅 캠페인 대시보드",
  description: "마케팅 캠페인 대시보드",
};

interface RootLayoutProps {
  children: React.ReactNode;
  charts: React.ReactNode;
  table: React.ReactNode;
}

export default function RootLayout({
  children,
  charts,
  table,
}: RootLayoutProps) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main className="container mx-auto px-4 py-8 space-y-8 flex-1 w-full max-w-7xl">
            {children}

            <div className="w-full">{charts}</div>

            <div className="w-full">{table}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
