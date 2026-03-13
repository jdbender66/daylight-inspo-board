"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      ready: (cb: (tw: NonNullable<Window["twttr"]>) => void) => void;
      widgets: {
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement | undefined>;
      };
    };
  }
}

export default function TweetEmbed({
  url,
  dark,
}: {
  url: string;
  dark?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Extract numeric tweet ID from x.com or twitter.com URL
    const tweetId = url.match(/\/status\/(\d+)/)?.[1];
    if (!tweetId) return;

    let cancelled = false;

    function doCreate(tw: NonNullable<Window["twttr"]>) {
      if (cancelled || !container) return;
      container.innerHTML = "";
      tw.widgets
        .createTweet(tweetId!, container, {
          theme: dark ? "dark" : "light",
          dnt: true,
          conversation: "none",
        })
        .then(() => {
          if (!cancelled) setLoaded(true);
        });
    }

    if (window.twttr) {
      window.twttr.ready(doCreate);
    } else {
      // widget.js not yet on the page — poll until it is
      const timer = setInterval(() => {
        if (window.twttr) {
          clearInterval(timer);
          window.twttr.ready(doCreate);
        }
      }, 150);
      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }

    return () => {
      cancelled = true;
    };
    // Intentionally exclude `dark` — tweets don't re-render on theme toggle
    // (avoids flashing all 120 embeds when toggling dark mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      {/* Loading placeholder */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid var(--daylight-border)",
              borderTopColor: "var(--daylight-orange)",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        </div>
      )}
      {/* Tweet mounts here */}
      <div ref={containerRef} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
