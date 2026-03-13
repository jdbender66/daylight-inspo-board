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
        load: (element?: HTMLElement | null) => Promise<HTMLElement[]>;
      };
    };
  }
}

interface Props {
  url: string;
  oembedHtml?: string; // pre-fetched at build time — renders instantly
  dark?: boolean;
}

export default function TweetEmbed({ url, oembedHtml, dark }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (oembedHtml) {
      // Static HTML is already rendered — just ask widget.js to enhance it
      // (shows avatar, images, proper styling). Content is already visible.
      function enhance(tw: NonNullable<Window["twttr"]>) {
        if (container) tw.widgets.load(container);
      }
      if (window.twttr) {
        window.twttr.ready(enhance);
      } else {
        const t = setInterval(() => {
          if (window.twttr) { clearInterval(t); window.twttr.ready(enhance); }
        }, 200);
        return () => clearInterval(t);
      }
      return;
    }

    // ── Fallback: no pre-fetched HTML, use createTweet() lazily ──────────────
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
        .then(() => { if (!cancelled) setFallbackLoaded(true); });
    }

    function startEmbed() {
      if (window.twttr) {
        window.twttr.ready(doCreate);
      } else {
        const t = setInterval(() => {
          if (window.twttr) { clearInterval(t); window.twttr.ready(doCreate); }
        }, 150);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { observer.disconnect(); startEmbed(); }
      },
      { rootMargin: "400px" }
    );
    observer.observe(container);

    return () => { cancelled = true; observer.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, oembedHtml]);

  // ── Pre-fetched path: render HTML immediately ─────────────────────────────
  if (oembedHtml) {
    return (
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: oembedHtml }}
        style={{ minHeight: 80, padding: "4px 0" }}
      />
    );
  }

  // ── Fallback path: show spinner while createTweet() runs ─────────────────
  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      {!fallbackLoaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 20, height: 20,
            border: "2px solid var(--daylight-border)",
            borderTopColor: "var(--daylight-orange)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
        </div>
      )}
      <div ref={containerRef} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
