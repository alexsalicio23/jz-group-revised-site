"use client";

import { useSyncExternalStore } from "react";
import { parseContactIntent } from "@/app/contact/contact-intent";

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

export function useContactIntent(defaultDivision: string) {
  // Read a stable primitive snapshot in the client to keep /contact static.
  const search = useSyncExternalStore(subscribeToLocation, () => window.location.search, () => "");
  return parseContactIntent(search, defaultDivision);
}
