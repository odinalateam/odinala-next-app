"use client";

import Script from "next/script";

export function BotpressChat() {
  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://files.bpcontent.cloud/2025/11/03/16/20251103160919-AHL1WCCO.js"
        strategy="afterInteractive"
      />
    </>
  );
}
