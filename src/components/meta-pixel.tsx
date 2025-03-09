"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

// Add this at the top of the file
declare global {
  interface Window {
    fbq: (
      command: string,
      eventName?: string,
      params?: Record<string, string | number | boolean | null | undefined> | string
    ) => void;
  }
}

// Replace with your actual Meta Pixel ID
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Track pageviews when the route changes
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}
    </>
  );
} 