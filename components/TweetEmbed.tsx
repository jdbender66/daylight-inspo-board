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

    function startEmbed() {
      if (window.twttr) {
        window.twttr.ready(doCreate);
      } else {
        // widget.js not loaded yet — poll until ready
        const timer = setInterval(() => {
          if (window.twttr) {
            clearInterval(timer);
            window.twttr.ready(doCreate);
          }
        }, 150);
      }
    }

    // Only start loading when the card is within 400px of the viewport.
    // This prevents all 120+ tweets from firing simultaneously on page load.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          startEmbed();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      {/* Spinner shown while loading */}
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
      <div ref={containerRef} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
