"use client";

import { useEffect } from "react";

/** Registers the service worker behind the page shown when there is no connection. */
export function AppWerker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
