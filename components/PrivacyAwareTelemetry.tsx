"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const privatePaths = ["/client-login", "/client-portal"];

function isPrivateUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return privatePaths.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`));
  } catch {
    return privatePaths.some((path) => value.includes(path));
  }
}

function withoutQueryOrHash(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
}

export function PrivacyAwareTelemetry() {
  return (
    <>
      <Analytics
        beforeSend={(event: BeforeSendEvent) => {
          if (isPrivateUrl(event.url)) return null;
          return { ...event, url: withoutQueryOrHash(event.url) };
        }}
      />
      <SpeedInsights
        beforeSend={(event) => {
          if (isPrivateUrl(event.url)) return null;
          return { ...event, url: withoutQueryOrHash(event.url) };
        }}
      />
    </>
  );
}
