import type React from "react";
import { vereisModule } from "@/lib/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  vereisModule("voedselveiligheid");
  return children;
}
