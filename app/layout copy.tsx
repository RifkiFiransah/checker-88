import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalkulator Muatan Truk Beras",
  description: "Perhitungan Tonase Muatan Truk Beras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-100 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
