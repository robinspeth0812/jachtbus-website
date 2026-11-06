import "@fontsource-variable/open-sans";
import "@fontsource-variable/asap/wdth.css";
import type { Metadata, Viewport } from "next";
import type React from "react";
import { AppWerker } from "@/components/AppWerker";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Portaal | Jachtbus", template: "%s | Portaal Jachtbus" },
  robots: { index: false, follow: false },
  applicationName: "Jachtbus",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/app/favicon-48.png", apple: "/app/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Jachtbus", statusBarStyle: "black" },
  formatDetection: { telephone: false },
};

// viewport-fit=cover lets the bottom navigation run behind the phone's home bar.
export const viewport: Viewport = { themeColor: "#000000", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      {/* Browser extensions add attributes to html and body; that is not our error. */}
      <body suppressHydrationWarning>
        <AppWerker />
        {children}
      </body>
    </html>
  );
}
