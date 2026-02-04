"use client";

// composant pour enregistrer le service worker

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("sw registered:", registration.scope);
        })
        .catch((error) => {
          console.error("sw registration failed:", error);
        });
    }
  }, []);

  return null;
}
