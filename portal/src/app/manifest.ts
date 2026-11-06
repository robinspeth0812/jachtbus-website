import type { MetadataRoute } from "next";
import { moduleAan } from "@/lib/pakket";

// Makes the portal installable on a phone: own icon, opens without browser bars.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Jachtbus portaal",
    short_name: "Jachtbus",
    description: "Je aanvragen en je website, altijd bij de hand.",
    lang: "nl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/app/icoon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app/icoon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app/icoon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Aanvragen", url: "/aanvragen", aan: true },
      { name: "Klussen", url: "/klussen", aan: moduleAan("klussen") },
      { name: "Temperatuur meten", url: "/bus/voedselveiligheid", aan: moduleAan("voedselveiligheid") },
      { name: "Ticket maken", url: "/tickets/nieuw", aan: true },
    ]
      .filter((s) => s.aan)
      .map(({ name, url }) => ({ name, url, icons: [{ src: "/app/icoon-192.png", sizes: "192x192" }] })),
  };
}
