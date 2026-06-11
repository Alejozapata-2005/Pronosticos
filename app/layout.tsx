import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IA Predictor - Mundial 2026",
  description: "Predicciones estadísticas de inteligencia artificial para cada partido del Mundial 2026. Probabilidades de campeón, goles, tarjetas y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
