import type { ReactNode } from "react";
import Link from "next/link";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-barlow",
});
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"], weight: ["600", "700", "800"], variable: "--font-barlow-condensed",
});

export const metadata = { title: BRAND_NAME, description: BRAND_TAGLINE };
export const viewport = { themeColor: "#071317" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="sr-only rounded-full bg-surface px-4 py-2 text-sm font-bold text-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:outline-2 focus:outline-brand-teal"
        >
          Pular para o conteúdo
        </a>
        <header className="border-b border-band-line bg-band">
          <div className="mx-auto w-full max-w-7xl px-4 py-3">
            <Link
              href="/"
              translate="no"
              className="rounded font-display text-xl font-extrabold uppercase tracking-wide text-brand-gradient focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
            >
              {BRAND_NAME}
            </Link>
          </div>
        </header>
        <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 focus:outline-none">{children}</main>
        <footer className="px-4 py-4 text-center text-xs text-muted">
          {BRAND_TAGLINE} · dados atualizados diariamente
        </footer>
      </body>
    </html>
  );
}
