import "@fontsource-variable/open-sans";
import "@fontsource-variable/asap/wdth.css";
import type { Metadata, Viewport } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Portaal | Jachtbus", template: "%s | Portaal Jachtbus" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#1b1817" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      {/* Browser extensions add attributes to html and body; that is not our error. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
