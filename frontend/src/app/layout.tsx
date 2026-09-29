import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Bridge | Placement Predictor",
  description: "Estimate placement likelihood and salary range from an engineering student profile."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-navy-200 bg-white">
          <div className="container-main flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <Image src="/logo.png" alt="Skill Bridge" width={42} height={42} priority />
              <span>Skill Bridge</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="text-navy-600 hover:text-navy-900">Overview</Link>
              <Link href="/predict" className="btn-primary btn-sm">Try the model</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-navy-200 bg-white py-8">
          <div className="container-main text-sm text-navy-500">
            Skill Bridge placement prediction demo. Predictions are estimates, not placement guarantees.
          </div>
        </footer>
      </body>
    </html>
  );
}
