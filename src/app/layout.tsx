import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
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
  title: {
    default: "Meteo Web - Meteo en temps reel",
    template: "%s | Meteo Web",
  },
  description:
    "Application meteo complete avec previsions horaires, journalieres et graphiques interactifs. Utilise Open-Meteo API.",
  keywords: ["meteo", "weather", "previsions", "forecast", "temperature", "open-meteo"],
  authors: [{ name: "Meteo Web" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meteo Web",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PreferencesProvider>
          {children}
          <ServiceWorkerRegistration />
        </PreferencesProvider>
      </body>
    </html>
  );
}
