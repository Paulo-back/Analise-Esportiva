import type { ReactNode } from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });

export const metadata = { title: BRAND_NAME, description: BRAND_TAGLINE };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-line px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-wide text-accent">
            {BRAND_NAME}
          </Link>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
        <footer className="px-4 py-4 text-center text-xs text-muted">
          {BRAND_TAGLINE} · dados atualizados diariamente
        </footer>
      </body>
    </html>
  );
}
