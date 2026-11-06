import type { MetadataRoute } from "next";

// Makes the portal installable on a phone: own icon, opens without browser bars.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Jachtbus portaal",
    short_name: "Jachtbus",
    description: "Aanvragen, klussen, agenda en de bus, altijd bij de hand.",
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
      { name: "Aanvragen", url: "/aanvragen", icons: [{ src: "/app/icoon-192.png", sizes: "192x192" }] },
      { name: "Klussen", url: "/klussen", icons: [{ src: "/app/icoon-192.png", sizes: "192x192" }] },
      { name: "Temperatuur meten", url: "/bus/voedselveiligheid", icons: [{ src: "/app/icoon-192.png", sizes: "192x192" }] },
    ],
  };
}
